# Testing Guide - Land Acquisition Delay Prediction System

## ✅ Test Checklist Before Public Deployment

---

## 1️⃣ Local Testing

### Test 1.1: Backend API Starts Correctly

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Expected:**
- ✅ Terminal shows: `Uvicorn running on http://127.0.0.1:8000`
- ✅ No errors in console

**Verification:**
```bash
curl http://localhost:8000/api/health
# Expected response: {"status": "ok", "model_loaded": true}
```

---

### Test 1.2: Backend Documentation Access

```bash
# Open in browser:
http://localhost:8000/docs
```

**Expected:**
- ✅ Swagger UI loads with all endpoints listed
- ✅ Can see `/api/health`, `/api/projects`, `/api/predict`, etc.
- ✅ Try it out buttons work

---

### Test 1.3: Frontend Dev Server Starts

```bash
# In project root (new terminal)
npm install
npm run dev
```

**Expected:**
- ✅ Terminal shows: `Local: http://localhost:5173`
- ✅ No TypeScript or build errors

**Verification:**
```bash
curl http://localhost:5173
# Should return HTML (frontend index)
```

---

### Test 1.4: API Data Loading

Open frontend at `http://localhost:5173/`:

**Check Dashboard:**
- [ ] Stats cards load (Total Projects, High Risk, Medium Risk, Low Risk)
- [ ] Activity timeline shows recent entries
- [ ] Charts render without errors

**Check Projects Page:**
- [ ] Project list loads
- [ ] Project details can be viewed
- [ ] Risk indicators (High/Medium/Low) show correctly

**Check Add Project:**
- [ ] Form loads all dropdowns (states, districts, project types)
- [ ] Can fill form and submit
- [ ] Prediction appears after submit
- [ ] New project appears in project list

**Check Reports:**
- [ ] District-wise stats chart loads
- [ ] Feature importance chart displays model insights

---

## 2️⃣ API Endpoint Testing

Use curl or Postman to test all endpoints:

### Test 2.1: Health Check
```bash
curl http://localhost:8000/api/health
```
**Expected:** `{"status": "ok", "model_loaded": true}`

---

### Test 2.2: Get Options
```bash
curl http://localhost:8000/api/options
```
**Expected:** JSON with states, districts, project types, etc.

---

### Test 2.3: Get All Projects
```bash
curl http://localhost:8000/api/projects
```
**Expected:** Array of project objects with predictions

---

### Test 2.4: Get Project by ID
```bash
curl http://localhost:8000/api/projects/1
```
**Expected:** Single project object

---

### Test 2.5: Predict a Project
```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Highway",
    "state": "Uttar Pradesh",
    "district": "Agra",
    "projectType": "Highway",
    "landArea": 1000,
    "acquired": 400,
    "landowners": 100,
    "approvalStage": "Environmental Clearance",
    "disputes": 2,
    "pendingApprovals": 3,
    "compensationDelayDays": 150,
    "documentationIncomplete": false,
    "rehabilitationStatus": "Pending",
    "projectAgeDays": 400,
    "expectedDurationDays": 800
  }'
```
**Expected:** Response with `prob`, `risk`, `isDelayed`, `reasons`, `actions`

---

### Test 2.6: Add Project
```bash
curl -X POST http://localhost:8000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Bridge Project",
    "state": "Maharashtra",
    "district": "Mumbai",
    "projectType": "Bridge",
    "landArea": 500,
    "acquired": 200,
    "landowners": 50,
    "approvalStage": "Regulatory Approval",
    "disputes": 1,
    "pendingApprovals": 2,
    "compensationDelayDays": 100,
    "documentationIncomplete": false,
    "rehabilitationStatus": "In Progress",
    "projectAgeDays": 300,
    "expectedDurationDays": 600
  }'
```
**Expected:** Project created with ID and prediction

---

### Test 2.7: Get Statistics
```bash
curl http://localhost:8000/api/stats
```
**Expected:** Counts for total, high, medium, low risk projects

---

### Test 2.8: Get Reports
```bash
curl http://localhost:8000/api/reports/district-stats
```
**Expected:** District-wise risk breakdown

---

### Test 2.9: Model Feature Importance
```bash
curl http://localhost:8000/api/model/feature-importance
```
**Expected:** Ranked features driving model predictions

---

## 3️⃣ Full Stack Testing (Docker)

### Test 3.1: Build and Run with Docker Compose

```bash
docker-compose up --build
```

**Expected:**
- ✅ Backend builds and starts without errors
- ✅ Frontend builds and starts without errors
- ✅ Both services show healthy status

---

### Test 3.2: Test from Docker

```bash
# Backend
curl http://localhost:8000/api/health

# Frontend
curl http://localhost:5173

# Test through frontend (in browser)
# Open http://localhost:5173
```

**Expected:** All responses successful, no network errors

---

### Test 3.3: Verify API Proxy

From browser at `http://localhost:5173`:
- Open DevTools (F12)
- Go to Network tab
- Add a new project
- Check network requests:
  - ✅ Requests to `/api/options` and `/api/projects` should succeed
  - ✅ No 404 or 500 errors

---

## 4️⃣ Performance Testing

### Test 4.1: Response Times

```bash
time curl http://localhost:8000/api/projects
time curl http://localhost:8000/api/stats
time curl http://localhost:8000/api/reports/district-stats
```

**Expected:**
- ✅ Most endpoints respond in < 500ms
- ✅ No timeouts

---

### Test 4.2: Load Test (Optional)

```bash
# Install Apache Bench
# macOS: brew install httpd
# Ubuntu: sudo apt-get install apache2-utils

# Test backend
ab -n 100 -c 10 http://localhost:8000/api/projects

# Expected: 0 failed requests
```

---

## 5️⃣ Production Build Testing

### Test 5.1: Build for Production

```bash
npm run build
npm run preview
```

**Expected:**
- ✅ Build completes without errors
- ✅ `dist/` folder created
- ✅ Preview server starts at `http://localhost:4173`

---

### Test 5.2: Test Production Build

Open `http://localhost:4173`:
- [ ] Dashboard loads
- [ ] All navigation works
- [ ] API calls work (backend must still be running)
- [ ] No console errors

---

## 6️⃣ Pre-Deployment Checklist

- [ ] All local tests pass
- [ ] No console errors or warnings
- [ ] All API endpoints respond correctly
- [ ] Frontend and backend communicate successfully
- [ ] Production build works
- [ ] Docker images build successfully
- [ ] Environment variables documented
- [ ] CORS headers configured

---

## 7️⃣ Deployment Testing (Cloud)

After deploying to cloud (Railway, AWS, etc.):

### Test 7.1: Health Checks

```bash
curl https://your-backend-url.com/api/health
curl https://your-frontend-url.com/
```

**Expected:** Both return successfully

---

### Test 7.2: End-to-End Flow

1. Open frontend URL in browser
2. Dashboard should load
3. Try adding a project
4. Verify prediction appears
5. Check that data persists on refresh

---

### Test 7.3: Cross-Origin Requests

From browser console:
```javascript
fetch('https://your-backend-url.com/api/projects')
  .then(r => r.json())
  .then(d => console.log('✅ CORS works!', d))
  .catch(e => console.error('❌ CORS error:', e))
```

**Expected:** `✅ CORS works!` (no CORS errors)

---

## 📊 Test Results Template

```
Project: Land Acquisition Delay Prediction
Deployment Date: ____________________
Tester Name: ____________________
Environment: [ ] Local  [ ] Staging  [ ] Production

RESULTS:
- Backend API: [ ] ✅ PASS  [ ] ❌ FAIL
- Frontend UI: [ ] ✅ PASS  [ ] ❌ FAIL
- Predictions: [ ] ✅ PASS  [ ] ❌ FAIL
- Reports: [ ] ✅ PASS  [ ] ❌ FAIL
- Performance: [ ] ✅ PASS  [ ] ❌ FAIL

Issues Found:
1. ____________________
2. ____________________

Sign-off: ____________________
```

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check Python version (3.9+), run `pip install -r requirements.txt` again |
| Frontend build fails | Run `npm install` fresh, clear cache: `npm cache clean --force` |
| API returns 500 | Check backend logs, verify `ml-model/delay_model.pkl` exists |
| CORS errors | Update `ALLOWED_ORIGINS` in backend, restart backend |
| Port already in use | Kill existing process: `lsof -i :8000` then `kill -9 <PID>` |
| Model not found | Verify `ml-model/` folder and `delay_model.pkl` are in repo |

---

**✅ All tests passing? You're ready for production deployment!**
