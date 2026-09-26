# Backend — Land Acquisition Delay Prediction API

FastAPI service that loads `ml-model/delay_model.pkl` (Random Forest classifier + regressor and
the label encoders) and serves predictions and project data to the React dashboard.

## Run

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Interactive docs: http://localhost:8000/docs

`ALLOWED_ORIGINS` (comma separated) controls CORS; it defaults to the Vite dev server origins.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Service + model status |
| GET | `/api/options` | Allowed states, districts, project types, rehabilitation and approval stages (from the label encoders) |
| POST | `/api/predict` | Score a project without storing it |
| GET | `/api/projects` | All projects with their predictions |
| POST | `/api/projects` | Score a project and store it (also logs an activity entry) |
| GET | `/api/projects/{id}` | One project |
| GET | `/api/activity` | Activity log |
| GET | `/api/stats` | Total / high / medium / low counts |
| GET | `/api/reports/district-stats` | District-wise risk split |
| GET | `/api/model/feature-importance` | Ranked feature importance from the classifier |

## Prediction payload

```json
{
  "name": "Riverdale Bypass Road",
  "state": "Uttar Pradesh",
  "district": "Agra",
  "projectType": "Highway",
  "landArea": 1200,
  "acquired": 400,
  "landowners": 130,
  "approvalStage": "Environmental Clearance",
  "disputes": 3,
  "pendingApprovals": 4,
  "compensationDelayDays": 200,
  "documentationIncomplete": true,
  "rehabilitationStatus": "Pending",
  "projectAgeDays": 500,
  "expectedDurationDays": 1000
}
```

Response: `prob` (delay probability %), `risk` (High/Medium/Low), `isDelayed`, `reasons`, `actions`.

`pending_land_hectares` and `pct_land_acquired` are derived server-side, and unseen categorical
values fall back to the first encoder class so the API never 500s on new districts.

## Storage

Projects live in an in-memory store seeded from `ml-model/Data/land_acquisition_dataset.csv`
and scored by the model at startup — data resets when the process restarts. Swap `app/store.py`
for a database when persistence is needed.
