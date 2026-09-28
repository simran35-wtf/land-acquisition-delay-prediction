# Land Acquisition Delay Prediction System

**SIH26017 | Ministry of Rural Development**

React (Vite) dashboard for land acquisition officers, backed by a FastAPI service that serves the trained Random Forest delay models.

```
frontend (React + Vite, :5173)  ──/api──▶  backend (FastAPI, :8000)  ──▶  ml-model/delay_model.pkl
```

## 🚀 Quick Start - Localhost Test (5 minutes)

### Terminal 1: Start Backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

✅ You should see:
```
Uvicorn running on http://127.0.0.1:8000
```

Test it:
```bash
curl http://localhost:8000/api/health
# Should return: {"status": "ok", "model_loaded": true}
```

### Terminal 2: Start Frontend
```bash
npm install
npm run dev
```

✅ You should see:
```
Local: http://localhost:5173
```

**Open browser: http://localhost:5173**

---

## ✅ Test Checklist (Make sure all work)

- [ ] Dashboard loads with stats cards (Total, High Risk, Medium, Low Risk)
- [ ] Can see project list
- [ ] Can click on a project and see details
- [ ] Can add new project from "Add Project" button
- [ ] When adding project, can select state, district, project type from dropdowns
- [ ] After adding project, it shows prediction (High/Medium/Low risk)
- [ ] Reports page shows district-wise chart
- [ ] No red errors in browser console (F12 → Console)
- [ ] Network requests work (F12 → Network tab, refresh page)

---

## 📦 Public Deployment (Choose One)

### **Option A: GitHub Pages + Render (RECOMMENDED - Easiest)**

#### Step 1: Deploy Backend to Render.com (2 minutes)

1. Go to https://render.com and sign up (free tier)
2. Click "New +" → "Web Service"
3. Select "Deploy an existing Git repository"
4. Connect your GitHub (simran35-wtf/land-acquisition-delay-prediction)
5. Fill form:
   - **Name:** land-acquisition-api
   - **Region:** Singapore (closest to India)
   - **Runtime:** Python 3.11
   - **Build Command:** `cd backend && pip install -r requirements.txt`
   - **Start Command:** `cd backend && uvicorn app.main:app --host 0.0.0.0 --port 8000`
6. Click "Create Web Service"
7. Wait 3-5 minutes for deployment ✅
8. Copy your URL: `https://land-acquisition-api-xxxx.onrender.com`

#### Step 2: Deploy Frontend to GitHub Pages (5 minutes)

```bash
# From repo root
npm install
VITE_API_BASE_URL=https://land-acquisition-api-xxxx.onrender.com npm run build
npm run preview
```

Test locally first to verify API calls work:
```bash
# Should see dashboard load and projects appear
```

Push to GitHub:
```bash
git add -A
git commit -m "Deploy: Add production build"
git push origin main
```

Go to repo Settings → Pages:
- Source: Deploy from a branch
- Branch: main, folder: /root
- Wait for deployment ✅

**Your live URLs:**
- Frontend: `https://simran35-wtf.github.io/land-acquisition-delay-prediction/`
- Backend: `https://land-acquisition-api-xxxx.onrender.com`

---

### **Option B: Docker Compose + Heroku (Alternative)**

```bash
docker-compose up -d --build
```

Test:
```bash
curl http://localhost:8000/api/health
curl http://localhost:5173
```

---

## 🧪 Full Test Before Showing to Ministers

```bash
# Test 1: Backend Health
curl http://YOUR-BACKEND-URL/api/health

# Test 2: Get Projects
curl http://YOUR-BACKEND-URL/api/projects

# Test 3: Get Options (dropdowns)
curl http://YOUR-BACKEND-URL/api/options

# Test 4: Add New Project (copy-paste this)
curl -X POST http://YOUR-BACKEND-URL/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Highway Project",
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
  }'

# Test 5: Get Stats
curl http://YOUR-BACKEND-URL/api/stats

# Test 6: Get Reports
curl http://YOUR-BACKEND-URL/api/reports/district-stats
```

All should return JSON without errors ✅

---

## 🎯 For Ministers/Audience (Demo)

**Live URL to share:** `https://simran35-wtf.github.io/land-acquisition-delay-prediction/`

They can:
1. View all land acquisition projects
2. See risk levels (High/Medium/Low)
3. Check district-wise statistics
4. Add new projects and get AI predictions
5. View reports and trends

---

## 📋 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | `pip install -r requirements.txt` again |
| Frontend build fails | `npm cache clean --force && npm install` |
| CORS error in browser | Backend not running or wrong URL in `.env` |
| Model not found | Check `ml-model/delay_model.pkl` exists |
| Port 8000 in use | `lsof -i :8000` then `kill -9 <PID>` |

---

## ✨ Success = All Tests Pass ✅

When you can:
- ✅ See dashboard with data
- ✅ Add projects and get predictions
- ✅ View reports
- ✅ Access from ANY browser/device (public URL)
- ✅ No errors in console

**THEN it's ready for ministers! 🎉**
