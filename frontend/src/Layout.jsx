import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Navbar from "./components/layout/Navbar";
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

  // Get user role from token for Sidebar links
  const getUserRole = () => {
    const token = Cookies.get('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch (e) {
      return null;
    }
  };

  const userRole = getUserRole();

  // Initialize viewRole with userRole if not set
  React.useEffect(() => {
    if (userRole && !viewRole) {
      setViewRole(userRole);
    }
  }, [userRole, viewRole]);

  if (isPublicPage) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userRole={viewRole || userRole}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          onMenuClick={() => setIsSidebarOpen(true)}
          userRole={userRole}
          viewRole={viewRole || userRole}
          setViewRole={setViewRole}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
