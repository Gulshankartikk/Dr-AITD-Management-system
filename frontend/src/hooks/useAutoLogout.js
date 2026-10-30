import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

/**
 * Custom hook to provide clean logout functionality.
 * Automatic inactivity timeout is disabled to maintain persistent long-lived sessions.
 */
const useAutoLogout = () => {
  const navigate = useNavigate();

  const logout = useCallback(() => {
    Cookies.remove('token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('role');
    sessionStorage.clear();
    window.history.pushState(null, '', window.location.href);
    navigate('/login', { replace: true });
  }, [navigate]);

  return logout;
};

export default useAutoLogout;
