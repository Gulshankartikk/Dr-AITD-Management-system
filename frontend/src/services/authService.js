import axios from 'axios';
import { BASE_URL } from '../constants/api';

class AuthService {
  async login(credentials, role) {
    // Unified login route
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      ...credentials,
      role
    });
    return response.data;
  }

  async register(userData, role) {
    const endpoint = role === 'student' ? '/api/student/register' :
                    role === 'teacher' ? '/api/teacher/register' :
                    '/api/admin/register';
    
    const response = await axios.post(`${BASE_URL}${endpoint}`, userData);
    return response.data;
  }

  async forgotPassword(email, role) {
    // Backend uses 'forgetPassword' (camelCase)
    const endpoint = `/api/${role}/forgetPassword`;
    const response = await axios.post(`${BASE_URL}${endpoint}`, { email });
    return response.data;
  }

  async verifyOtp(otp, userId, role) {
    // Backend expects userId, otp. Role is injected by route but we pass it for URL construction if needed, 
    // actually backend routes are /student/verifyOtp etc so we need role for URL.
    // Backend controller expects userId in body.
    const endpoint = `/api/${role}/verifyOtp`;
    const response = await axios.post(`${BASE_URL}${endpoint}`, { otp, userId });
    return response.data;
  }

  async resetPassword(userId, otp, newPassword, role) {
    // Backend expects userId, password, otp.
    const endpoint = `/api/${role}/resetPassword`;
    const response = await axios.post(`${BASE_URL}${endpoint}`, { 
      userId, 
      otp, 
      password: newPassword 
    });
    return response.data;
  }

  async updatePassword(currentPassword, newPassword, userId, role) {
    // This route needs verification in backend. 
    // completeRoutes.js has:
    // router.post('/student/:studentId/change-password', verifyToken, studentController.changePassword);
    // router.post('/teacher/:teacherId/change-password', verifyToken, teacherController.changePassword);
    
    const endpoint = `/api/${role}/${userId}/change-password`;
    const response = await axios.post(`${BASE_URL}${endpoint}`, {
      currentPassword,
      newPassword
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Ensure token is sent
      }
    });
    return response.data;
  }
}

export default new AuthService();