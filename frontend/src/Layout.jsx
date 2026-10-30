import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Breadcrumbs from "./components/layout/Breadcrumbs";
import Footer from "./components/Footer";
import CampusAICopilot from "./components/ai/CampusAICopilot";
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { addUserDetails } from './features/UserSlice';

const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Determine if we should show the full layout (Sidebar + Navbar)
  // Hide on public pages: /, /login, /register, /unauthorized, /achievers, password reset pages
  const publicPaths = ['/', '/login', '/register', '/unauthorized', '/achievers'];
  const isPublicPage = publicPaths.includes(location.pathname) || location.pathname.includes('forgetPassword');

  // Close sidebar on route change (mobile)
  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const [viewRole, setViewRole] = useState(null);

  // Get user details from token safely
  const getUserDetails = () => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    if (!token) return { role: null, userId: null };
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return { role: null, userId: null };
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      return { role: payload.role, userId: payload.id || payload.user_id };
    } catch (e) {
      return { role: null, userId: null };
    }
  };

  const { role: userRole, userId } = getUserDetails();

  // Sync viewRole with userRole and handle Admin view switching
  React.useEffect(() => {
    if (userRole === 'admin') {
      // Only Admins can switch views based on URL
      if (location.pathname.startsWith('/student')) {
        setViewRole('student');
      } else if (location.pathname.startsWith('/teacher')) {
        setViewRole('teacher');
      } else if (location.pathname.startsWith('/admin')) {
        setViewRole('admin');
      } else {
        setViewRole('admin');
      }
    } else {
      setViewRole(userRole);
    }
  }, [location.pathname, userRole]);

  // Redux Hydration for Session Restore
  const dispatch = useDispatch();
  React.useEffect(() => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    if (token) {
      dispatch(addUserDetails({ token }));
    }
  }, [dispatch]);

  if (isPublicPage) {
    return (
      <>
        <Outlet />
        <CampusAICopilot />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900 relative">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userRole={viewRole || userRole}
        userId={userId}
        realRole={userRole}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          onMenuClick={() => setIsSidebarOpen(true)}
          userRole={userRole}
          viewRole={viewRole || userRole}
          setViewRole={setViewRole}
        />

        <main className="flex-1 overflow-y-auto bg-gray-50/50 flex flex-col justify-between">
          <div className="p-4 lg:p-8 flex-1">
            <Breadcrumbs />
            <Outlet />
          </div>
          <Footer mode="compact" />
        </main>
      </div>

      {/* Universal Floating Gemini AI Assistant */}
      <CampusAICopilot />
    </div>
  );
};

export default Layout;
