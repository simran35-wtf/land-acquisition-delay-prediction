import client from "./client.js";

export const getProjects = () => client.get("/projects").then((r) => r.data);
export const getProject = (id) => client.get(`/projects/${id}`).then((r) => r.data);
export const createProject = (payload) => client.post("/projects", payload).then((r) => r.data);
export const predict = (payload) => client.post("/predict", payload).then((r) => r.data);
export const getActivity = () => client.get("/activity").then((r) => r.data);
export const getStats = () => client.get("/stats").then((r) => r.data);
export const getDistrictStats = () => client.get("/reports/district-stats").then((r) => r.data);
export const getOptions = () => client.get("/options").then((r) => r.data);
export const getFeatureImportance = () => client.get("/model/feature-importance").then((r) => r.data);
