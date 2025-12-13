import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const useAutoLogout = (timeout = 1800000) => { // 30 minutes = 1800000ms
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const logout = () => {
    Cookies.remove('token');
    localStorage.clear();
    sessionStorage.clear();
    window.history.pushState(null, '', window.location.href);
    navigate('/login', { replace: true });
  };

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(logout, timeout);
  };

  useEffect(() => {
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
  }, [navigate, timeout]);

  return logout;
};

export default useAutoLogout;
