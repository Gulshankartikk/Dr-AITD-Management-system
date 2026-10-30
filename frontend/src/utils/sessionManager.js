// Persistent Session Manager - Long-Lived Session
class SessionManager {
  constructor() {
    this.ACTIVITY_KEY = 'lastActivity';
    this.timer = null;
  }

  // Set session and start activity monitoring
  setSession(token) {
    localStorage.setItem('token', token);
    this.updateActivity();
  }

  // Update last activity time
  updateActivity() {
    localStorage.setItem(this.ACTIVITY_KEY, Date.now().toString());
  }

  // Check if session exists (no expiry check for navigation)
  isSessionValid() {
    return !!localStorage.getItem('token');
  }

  // Manual logout only
  logout() {
    if (this.timer) clearTimeout(this.timer);
    localStorage.removeItem('token');
    localStorage.removeItem(this.ACTIVITY_KEY);
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }
}

export default new SessionManager();