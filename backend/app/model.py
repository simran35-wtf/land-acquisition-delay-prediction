"""Loads the trained Random Forest models and turns form input into predictions."""

import pickle
from functools import lru_cache
from pathlib import Path

import pandas as pd

from .schemas import FeatureImportance, Options, Prediction, ProjectInput

MODEL_PATH = Path(__file__).resolve().parents[2] / "ml-model" / "delay_model.pkl"

FEATURE_ORDER = [
    "state",
    "district",
    "project_type",
    "land_required_hectares",
    "land_acquired_hectares",
    "pending_land_hectares",
    "pct_land_acquired",
    "pending_approvals_count",
    "legal_disputes_count",
    "compensation_delay_days",
    "documentation_incomplete",
    "rehabilitation_status",
    "project_age_days",
    "expected_duration_days",
]

CATEGORICAL = {
    "state": "state",
    "district": "district",
    "project_type": "project_type",
    "rehabilitation_status": "rehabilitation_status",
}

APPROVAL_STAGES = [
    "Environmental Clearance",
    "Compensation Disbursal",
    "Final Notification",
    "Handover",
]


class DelayModel:
    def __init__(self, path: Path = MODEL_PATH):
        with open(path, "rb") as f:
            saved = pickle.load(f)
        self.classifier = saved["classifier"]
        self.regressor = saved["regressor"]
        self.label_encoders = saved["label_encoders"]
        self.feature_importance = saved["feature_importance"]

    def options(self) -> Options:
        return Options(
            states=sorted(self.label_encoders["state"].classes_.tolist()),
            districts=sorted(self.label_encoders["district"].classes_.tolist()),
            projectTypes=sorted(self.label_encoders["project_type"].classes_.tolist()),
            rehabilitationStatuses=sorted(
                self.label_encoders["rehabilitation_status"].classes_.tolist()
            ),
            approvalStages=APPROVAL_STAGES,
        )

    def importances(self) -> list[FeatureImportance]:
        return [
            FeatureImportance(feature=row.feature, importance=float(row.importance))
            for row in self.feature_importance.itertuples()
        ]

    def _encode(self, column: str, value: str) -> int:
        """Encode a categorical value, falling back to the most common class."""
        encoder = self.label_encoders[column]
        classes = encoder.classes_.tolist()
        if value in classes:
            return int(encoder.transform([value])[0])
        return 0

    def features(self, data: ProjectInput) -> pd.DataFrame:
        land_required = float(data.landArea)
        acquired = min(float(data.acquired), land_required) if land_required else 0.0
        pending_land = max(land_required - acquired, 0.0)
        pct_acquired = round(acquired / land_required * 100, 1) if land_required else 0.0

        row = {
            "state": self._encode("state", data.state),
            "district": self._encode("district", data.district),
            "project_type": self._encode("project_type", data.projectType),
            "land_required_hectares": land_required,
            "land_acquired_hectares": acquired,
            "pending_land_hectares": pending_land,
            "pct_land_acquired": pct_acquired,
            "pending_approvals_count": data.pendingApprovals,
            "legal_disputes_count": data.disputes,
            "compensation_delay_days": data.compensationDelayDays,
            "documentation_incomplete": int(data.documentationIncomplete),
            "rehabilitation_status": self._encode(
                "rehabilitation_status", data.rehabilitationStatus
            ),
            "project_age_days": data.projectAgeDays,
            "expected_duration_days": data.expectedDurationDays,
        }
        return pd.DataFrame([[row[c] for c in FEATURE_ORDER]], columns=FEATURE_ORDER)

    def predict(self, data: ProjectInput) -> Prediction:
        frame = self.features(data)
        prob = float(self.regressor.predict(frame)[0])
        prob = round(max(0.0, min(100.0, prob)), 1)
        is_delayed = bool(self.classifier.predict(frame)[0])
        risk = "High" if prob >= 60 else "Medium" if prob >= 35 else "Low"
        reasons = self._reasons(data, frame.iloc[0])
        return Prediction(
            prob=prob,
            risk=risk,
            isDelayed=is_delayed,
            reasons=reasons,
            actions=self._actions(risk, data),
        )

    @staticmethod
    def _reasons(data: ProjectInput, row: pd.Series) -> list[str]:
        ranked: list[tuple[str, float]] = []
        if data.pendingApprovals >= 1:
            ranked.append(
                (f"{data.pendingApprovals} approval(s) pending with concerned departments",
                 data.pendingApprovals * 10)
            )
        if data.disputes >= 1:
            ranked.append(
                (f"{data.disputes} active legal dispute(s) affecting the project",
                 data.disputes * 12)
            )
        if data.compensationDelayDays >= 60:
            ranked.append(
                (f"Compensation disbursement delayed by {data.compensationDelayDays} days",
                 data.compensationDelayDays / 3)
            )
        if data.documentationIncomplete:
            ranked.append(("Incomplete land documentation", 25))
        if row["pct_land_acquired"] < 40:
            ranked.append(
                (f"Only {row['pct_land_acquired']}% of required land acquired so far",
                 40 - row["pct_land_acquired"])
            )
        if data.rehabilitationStatus == "Pending":
            ranked.append(("Rehabilitation & resettlement not started", 20))
        if data.landowners > 80:
            ranked.append(
                (f"Large landowner base ({data.landowners}) may slow consent", 15)
            )
        ranked.sort(key=lambda item: item[1], reverse=True)
        if not ranked:
            return ["No major blockers reported at this stage"]
        return [reason for reason, _ in ranked[:3]]

    @staticmethod
    def _actions(risk: str, data: ProjectInput) -> list[str]:
        if risk == "Low":
            return ["Continue routine monitoring", "Keep project data updated"]
        actions = []
        if data.pendingApprovals:
            actions.append("Escalate pending approvals with the district office")
        if data.disputes:
            actions.append("Fast-track dispute resolution with the district revenue office")
        if data.compensationDelayDays >= 60:
            actions.append("Release the pending compensation batch")
        if data.documentationIncomplete:
            actions.append("Complete land records and documentation verification")
        actions.append("Review the project again in 30 days")
        return actions[:4]


@lru_cache(maxsize=1)
def get_model() -> DelayModel:
    return DelayModel()
