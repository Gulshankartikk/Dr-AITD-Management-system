import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:4001/api';

class AuthService {
  constructor() {
    this.token = Cookies.get('token');
    this.setupAxiosInterceptors();
  }

  setupAxiosInterceptors() {
    // Request interceptor to add token
    axios.interceptors.request.use(
      (config) => {
        const token = Cookies.get('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token expiration
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials, userType) {
    try {
      const response = await axios.post(`${API_BASE_URL}/${userType}/login`, credentials);
      const { token, user } = response.data;

      // Store token in cookie
      Cookies.set('token', token, { expires: 1 }); // 1 day
      Cookies.set('userType', userType, { expires: 1 });
      Cookies.set('user', JSON.stringify(user), { expires: 1 });

      this.token = token;
      return { token, user };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  logout() {
    Cookies.remove('token');
    Cookies.remove('userType');
    Cookies.remove('user');
    this.token = null;
  }

  isAuthenticated() {
    const token = Cookies.get('token');
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      return decoded.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  getCurrentUser() {
    const userStr = Cookies.get('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getUserType() {
    return Cookies.get('userType');
  }

  getToken() {
    return Cookies.get('token');
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const userType = this.getUserType();
      const response = await axios.put(`${API_BASE_URL}/${userType}/change-password`, {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password change failed');
    }
  }

  async forgotPassword(email, userType) {
    try {
      const response = await axios.post(`${API_BASE_URL}/${userType}/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset request failed');
    }
  }

  async resetPassword(token, newPassword, userType) {
    try {
      const response = await axios.post(`${API_BASE_URL}/${userType}/reset-password`, {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  }
}

export default new AuthService();
