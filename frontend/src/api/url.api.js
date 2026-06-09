import api from "./axios.js";

export const createUrl = (data) => api.post("/urls", data);

export const getUserUrls = (params) => api.get("/urls", { params });

export const getUrlById = (id) => api.get(`/urls/${id}`);

export const updateUrl = (id, data) => api.put(`/urls/${id}`, data);

export const deleteUrl = (id) => api.delete(`/urls/${id}`);

export const getDashboardAnalytics = () => api.get("/urls/analytics/dashboard");
