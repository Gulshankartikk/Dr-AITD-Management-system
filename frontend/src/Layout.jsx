import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/Footer";
import Cookies from 'js-cookie';

const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Determine if we should show the full layout (Sidebar + Navbar)
  // Hide on public pages: /, /login, /register, /unauthorized, /404
  // Also hide on Landing Page if it's the root
  const publicPaths = ['/', '/login', '/register', '/unauthorized'];
  // Check if current path is exactly one of the public paths or starts with /landing (if we had one)
  const isPublicPage = publicPaths.includes(location.pathname);

  const [viewRole, setViewRole] = useState(null);

  // Get user details from token
  const getUserDetails = () => {
    const token = Cookies.get('token');
    if (!token) return { role: null, userId: null };
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
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
        // Default to admin view if on other pages (e.g. home)
        setViewRole('admin');
      }
    } else {
      // For non-admins, viewRole MUST always match userRole
      // This ensures that if a user logs out (userRole becomes null) 
      // or logs in as a different role, viewRole updates correctly.
      setViewRole(userRole);
    }
  }, [location.pathname, userRole]);

  if (isPublicPage) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
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

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto min-h-[calc(100vh-12rem)]">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Layout;
