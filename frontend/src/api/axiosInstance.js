import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
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
        // Assuming react-toastify is available since it was used in other files.

        // ... existing code ...

        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            console.warn('Unauthorized access - token expired or invalid. Logging out...');

            // Clear storage
            localStorage.removeItem('token');
            Cookies.remove('token');

            // Show Session Expired Message
            // We use a slight timeout to ensure the toast has a chance to be created before redirect (though full page reload wipes it unless persisted)
            // But since we are doing window.location.href, the toast might not be seen if it's instant.
            // A better approach for SPA is useNavigate, but we can't use hooks here.
            // We'll rely on the Login page to maybe show a message if we redirect with a query param?
            // Or just alert() for now to be "show as session expire". 
            // Better: use toast but the redirect might be too fast. 
            // Let's try redirecting with a query param ?sessionExpired=true

            if (!window.location.pathname.includes('/login')) {
                // alert("Session Expired. Please login again."); // Crude but effective "show"
                window.location.href = '/login?sessionExpired=true';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
