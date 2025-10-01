import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL  //"https://digital-identity-tracker.onrender.com"
});

// Accounts
export const fetchAccounts = () => api.get("/accounts");
export const createAccount = (data) => api.post("/accounts", data);
export const getAccount = (id) => api.get(`/accounts/${id}`);

// Data Types
export const fetchDataTypes = () => api.get("/data-types");
export const createDataType = (data) => api.post("/data-types", data);
export const assignDataTypes = (payload) => api.post("/data-types/assign", payload);


export default api;