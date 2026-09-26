# Land Acquisition Delay Prediction System

**SIH26017 | Ministry of Rural Development**

React (Vite) dashboard for land acquisition officers, backed by a FastAPI service that serves the
trained Random Forest delay models.

```
frontend (React + Vite, :5173)  ──/api──▶  backend (FastAPI, :8000)  ──▶  ml-model/delay_model.pkl
```

## Run the API

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

See [backend/README.md](backend/README.md) for the endpoint list and payloads.

## Run the dashboard

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://127.0.0.1:8000` (override with `VITE_API_PROXY_TARGET`).
For a deployed API, set `VITE_API_BASE_URL` to its origin — see `.env.example`.

## How the pages use the API

| Page | Endpoint |
|---|---|
| Dashboard | `GET /api/stats`, `GET /api/activity` |
| Active Projects, Alerts | `GET /api/projects` |
| Project Details | `GET /api/projects/{id}` |
| Add New Project | `GET /api/options`, `POST /api/projects` (model scores the project) |
| Project History | `GET /api/activity` |
| Reports | `GET /api/reports/district-stats`, `GET /api/model/feature-importance` |

## ML model

`ml-model/` holds the training notebook, the synthetic dataset and `delay_model.pkl`
(classifier, regressor, label encoders, feature importance). See [ml-model/README.md](ml-model/README.md).
