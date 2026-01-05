import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../constants';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT token in all requests
axiosInstance.interceptors.request.use(
    (config) => {
        const userState = localStorage.getItem(STORAGE_KEYS.USER);
        if (userState) {
            const { state } = JSON.parse(userState);
            if (state.token) {
                config.headers.Authorization = `Bearer ${state.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors (e.g., 401 Unauthorized)
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized error - maybe logout the user?
            // For now, just pass the error
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
