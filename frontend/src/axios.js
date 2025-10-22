import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

export const setAuthToken = (token) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default api;
