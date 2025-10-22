import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL
});

// ============ Accounts CRUD ============
export const fetchAccounts = () => api.get("/accounts");
export const createAccount = (data) => api.post("/accounts", data);
export const getAccount = (id) => api.get(`/accounts/${id}`);
export const updateAccount = (id, data) => api.put(`/accounts/${id}`, data);
export const deleteAccount = (id) => api.delete(`/accounts/${id}`);
export const getAccountsByProfile = (profileId) => api.get(`/accounts/profile/${profileId}`);

// ============ Data Types ============
export const fetchDataTypes = () => api.get("/data-types");
export const createDataType = (data) => api.post("/data-types", data);
export const assignDataTypes = (payload) => api.post("/data-types/assign", payload);

// ============ Reports ============
export const downloadCSV = () => api.get("/reports/csv", { 
    responseType: 'blob' 
});

export const downloadPDF = () => api.get("/reports/pdf", { 
    responseType: 'blob' 
});

export default api;