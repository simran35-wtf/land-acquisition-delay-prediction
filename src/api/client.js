import axios from "axios";

// In dev, Vite proxies /api to the FastAPI backend (see vite.config.js).
// In other environments set VITE_API_BASE_URL to the deployed API origin.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export function apiErrorMessage(error) {
  if (error.response) return `API error ${error.response.status}: ${error.response.data?.detail || error.response.statusText}`;
  if (error.request) return "Cannot reach the prediction API. Start the backend (uvicorn app.main:app --port 8000) and retry.";
  return error.message;
}

export default client;
