"""In-memory project store, seeded from the training dataset and scored by the model."""

import csv
import threading
from datetime import datetime
from itertools import count
from pathlib import Path

from .model import APPROVAL_STAGES, get_model
from .schemas import Activity, Counts, DistrictStat, HistoryPoint, Project, ProjectInput

DATASET_PATH = Path(__file__).resolve().parents[2] / "ml-model" / "Data" / "land_acquisition_dataset.csv"
SEED_COUNT = 24


def _history(progress: float) -> list[HistoryPoint]:
    """Five evenly spaced checkpoints ending at the project's current progress."""
    labels = ["Start", "+6m", "+12m", "+18m", "Now"]
    points = []
    for index, label in enumerate(labels):
        share = index / (len(labels) - 1)
        points.append(
            HistoryPoint(
                m=label,
                actual=round(progress * share, 1),
                exp=round(100 * share, 1),
            )
        )
    return points


def _seed_inputs() -> list[ProjectInput]:
    with open(DATASET_PATH, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))[:SEED_COUNT]
    inputs = []
    for row in rows:
        land_required = float(row["land_required_hectares"])
        inputs.append(
            ProjectInput(
                name=f"{row['district']} {row['project_type']}",
                district=row["district"],
                state=row["state"],
                projectType=row["project_type"],
                landArea=land_required,
                acquired=float(row["land_acquired_hectares"]),
                landowners=max(10, int(land_required / 8)),
                approvalStage=APPROVAL_STAGES[int(row["pending_approvals_count"]) % len(APPROVAL_STAGES)],
                disputes=int(row["legal_disputes_count"]),
                pendingApprovals=int(row["pending_approvals_count"]),
                compensationDelayDays=int(row["compensation_delay_days"]),
                documentationIncomplete=row["documentation_incomplete"].strip().upper() == "TRUE",
                rehabilitationStatus=row["rehabilitation_status"],
                projectAgeDays=int(row["project_age_days"]),
                expectedDurationDays=int(row["expected_duration_days"]),
            )
        )
    return inputs


SEED_ACTIVITY = [
    Activity(
        time="21 Sep 2026, 05:32 PM",
        project="Lucknow–Kanpur Expressway",
        place="Uttar Pradesh",
        text="Land record verification updated",
        status="In Progress",
    ),
    Activity(
        time="21 Sep 2026, 03:14 PM",
        project="Varanasi Ring Road",
        place="Uttar Pradesh",
        text="New objection raised",
        status="Under Review",
    ),
    Activity(
        time="21 Sep 2026, 12:08 PM",
        project="Ganga Riverfront Development",
        place="Varanasi",
        text="Field survey report uploaded",
        status="In Progress",
    ),
    Activity(
        time="20 Sep 2026, 06:45 PM",
        project="Noida Film City",
        place="Uttar Pradesh",
        text="AI risk score updated (Low)",
        status="On Track",
    ),
]


class ProjectStore:
    def __init__(self):
        self._lock = threading.Lock()
        self._ids = count(1)
        self._projects: list[Project] = []
        self._activity: list[Activity] = list(SEED_ACTIVITY)
        for data in _seed_inputs():
            self._insert(data, log_activity=False)

    def _insert(self, data: ProjectInput, log_activity: bool = True) -> Project:
        prediction = get_model().predict(data)
        progress = round(data.acquired / data.landArea * 100, 1) if data.landArea else 0.0
        project = Project(
            id=next(self._ids),
            name=data.name,
            district=data.district,
            state=data.state,
            projectType=data.projectType,
            progress=progress,
            landArea=data.landArea,
            acquired=data.acquired,
            landowners=data.landowners,
            approvalStage=data.approvalStage,
            disputes=data.disputes,
            history=_history(progress),
            **prediction.model_dump(),
        )
        self._projects.insert(0, project)
        if log_activity:
            self._activity.insert(
                0,
                Activity(
                    time=datetime.now().strftime("%d %b %Y, %I:%M %p"),
                    project=project.name,
                    place=project.district,
                    text=f"New project added — AI risk score {project.risk} ({project.prob}%)",
                    status="In Progress",
                ),
            )
        return project

    def add(self, data: ProjectInput) -> Project:
        with self._lock:
            return self._insert(data)

    def all(self) -> list[Project]:
        return list(self._projects)

    def get(self, project_id: int) -> Project | None:
        return next((p for p in self._projects if p.id == project_id), None)

    def activity(self) -> list[Activity]:
        return list(self._activity)

    def counts(self) -> Counts:
        projects = self._projects
        return Counts(
            total=len(projects),
            high=sum(1 for p in projects if p.risk == "High"),
            medium=sum(1 for p in projects if p.risk == "Medium"),
            low=sum(1 for p in projects if p.risk == "Low"),
        )

    def district_stats(self) -> list[DistrictStat]:
        stats: dict[str, DistrictStat] = {}
        for project in self._projects:
            stat = stats.setdefault(
                project.district, DistrictStat(district=project.district, high=0, medium=0, low=0)
            )
            if project.risk == "High":
                stat.high += 1
            elif project.risk == "Medium":
                stat.medium += 1
            else:
                stat.low += 1
        return sorted(
            stats.values(), key=lambda s: s.high + s.medium + s.low, reverse=True
        )


_store: ProjectStore | None = None


def get_store() -> ProjectStore:
    global _store
    if _store is None:
        _store = ProjectStore()
    return _store
