import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .model import get_model
from .schemas import (
    Activity,
    Counts,
    DistrictStat,
    FeatureImportance,
    Options,
    Prediction,
    Project,
    ProjectInput,
)
from .store import get_store

ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(",")


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    get_store()
    yield


app = FastAPI(
    title="Land Acquisition Delay Prediction API",
    description="Serves the trained Random Forest delay models to the React dashboard.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str | bool]:
    return {"status": "ok", "modelLoaded": True}


@app.get("/api/options", response_model=Options)
def options() -> Options:
    return get_model().options()


@app.get("/api/model/feature-importance", response_model=list[FeatureImportance])
def feature_importance() -> list[FeatureImportance]:
    return get_model().importances()


@app.post("/api/predict", response_model=Prediction)
def predict(data: ProjectInput) -> Prediction:
    return get_model().predict(data)


@app.get("/api/projects", response_model=list[Project])
def list_projects() -> list[Project]:
    return get_store().all()


@app.post("/api/projects", response_model=Project, status_code=201)
def create_project(data: ProjectInput) -> Project:
    return get_store().add(data)


@app.get("/api/projects/{project_id}", response_model=Project)
def get_project(project_id: int) -> Project:
    project = get_store().get(project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@app.get("/api/activity", response_model=list[Activity])
def activity() -> list[Activity]:
    return get_store().activity()


@app.get("/api/stats", response_model=Counts)
def stats() -> Counts:
    return get_store().counts()


@app.get("/api/reports/district-stats", response_model=list[DistrictStat])
def district_stats() -> list[DistrictStat]:
    return get_store().district_stats()
