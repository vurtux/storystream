import axios from 'axios';
import NEXT_PUBLIC_API_URL from '../utils/api';

// Create Axios instance
const api = axios.create({
    baseURL: NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    withCredentials: true, // if you're using cookies/auth
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Example: Add token to headers
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized! Redirect or logout');
            // Optional: Redirect to login
        }

        return Promise.reject(error);
    }
);

export default api;
