import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../constants/api';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Send cookies efficiently
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        // Try getting token from Cookie (JS accessible) or LocalStorage
        // Note: HttpOnly cookies are automatically sent by browser with withCredentials: true
        // But we also support the Bearer header strategy for compatibility
        const token = Cookies.get('token') || localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Global Errors (like 401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            // We could trigger a logout action here if we had access to store
            // For now, we rely on the component handling the error or redirecting
            console.warn('Unauthorized access - potential token expiration');

            // Optional: Clear storage if 401 is persistent?
            // localStorage.removeItem('token');
            // Cookies.remove('token');
            // window.location.href = '/login'; // Aggressive redirect
        }
        return Promise.reject(error);
    }
);

export default api;
