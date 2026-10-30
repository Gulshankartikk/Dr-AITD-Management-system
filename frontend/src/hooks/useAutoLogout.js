import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Long-lived session: default to 30 days (2,592,000,000 ms) instead of short 30m idle logout
const DEFAULT_SESSION_TIMEOUT = 30 * 24 * 60 * 60 * 1000;

const useAutoLogout = (timeout = DEFAULT_SESSION_TIMEOUT) => {
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const logout = useCallback(() => {
    Cookies.remove('token');
    localStorage.clear();
    sessionStorage.clear();
    window.history.pushState(null, '', window.location.href);
    navigate('/login', { replace: true });
  }, [navigate]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (timeout && timeout > 0) {
      timeoutRef.current = setTimeout(logout, timeout);
    }
  }, [logout, timeout]);

  useEffect(() => {
    if (!timeout || timeout <= 0) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    // Clear timer on unmount
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [resetTimer, timeout]);

  return logout;
};

export default useAutoLogout;
