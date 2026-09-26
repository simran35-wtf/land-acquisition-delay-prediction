from typing import Literal, Optional

from pydantic import BaseModel, Field

RiskLevel = Literal["High", "Medium", "Low"]


class ProjectInput(BaseModel):
    """Raw project details captured by the Add New Project form."""

    name: str = Field(default="New Project")
    district: str = Field(default="Not specified")
    state: str = Field(default="Uttar Pradesh")
    projectType: str = Field(default="Highway")
    landArea: float = Field(default=0, ge=0, description="Total land required (hectares)")
    acquired: float = Field(default=0, ge=0, description="Land already acquired (hectares)")
    landowners: int = Field(default=0, ge=0)
    approvalStage: str = Field(default="Environmental Clearance")
    disputes: int = Field(default=0, ge=0, description="Active legal disputes")
    pendingApprovals: int = Field(default=0, ge=0)
    compensationDelayDays: int = Field(default=0, ge=0)
    documentationIncomplete: bool = Field(default=False)
    rehabilitationStatus: str = Field(default="Pending")
    projectAgeDays: int = Field(default=0, ge=0)
    expectedDurationDays: int = Field(default=1095, gt=0)
    remarks: Optional[str] = None


class HistoryPoint(BaseModel):
    m: str
    actual: float
    exp: float


class Prediction(BaseModel):
    prob: float = Field(description="Delay probability in percent (0-100)")
    risk: RiskLevel
    isDelayed: bool
    reasons: list[str]
    actions: list[str]


class Project(Prediction):
    id: int
    name: str
    district: str
    state: str
    projectType: str
    progress: float
    landArea: float
    acquired: float
    landowners: int
    approvalStage: str
    disputes: int
    history: list[HistoryPoint]


class Activity(BaseModel):
    time: str
    project: str
    place: str
    text: str
    status: str


class Counts(BaseModel):
    total: int
    high: int
    medium: int
    low: int


class DistrictStat(BaseModel):
    district: str
    high: int
    medium: int
    low: int


class Options(BaseModel):
    states: list[str]
    districts: list[str]
    projectTypes: list[str]
    rehabilitationStatuses: list[str]
    approvalStages: list[str]


class FeatureImportance(BaseModel):
    feature: str
    importance: float
