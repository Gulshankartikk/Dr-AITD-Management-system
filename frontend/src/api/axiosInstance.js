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
            console.warn('Unauthorized access - token expired or invalid. Logging out...');

            // Clear storage
            localStorage.removeItem('token');
            Cookies.remove('token');

            // Redirect to login but prevent infinite loops if already on login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
