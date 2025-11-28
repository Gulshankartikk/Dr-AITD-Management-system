import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

const Navbar = ({ onMenuClick, userRole, viewRole, setViewRole }) => {
    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
            <div className="flex items-center">
                <button
                    onClick={onMenuClick}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden mr-4"
                >
                    <Menu size={24} />
                </button>

                {/* Breadcrumbs or Page Title could go here */}
                <h2 className="text-lg font-semibold text-gray-800 hidden sm:block capitalize">
                    {userRole ? `${userRole} Portal` : 'Dashboard'}
                </h2>
            </div>

            <div className="flex items-center space-x-4">
                {userRole === 'admin' && viewRole !== 'admin' && (
                    <button
                        onClick={() => {
                            setViewRole('admin');
                            window.location.href = '/admin/dashboard';
                        }}
                        className="px-4 py-2 bg-night-blue text-white text-sm font-medium rounded-lg hover:bg-night-blue-shadow transition-colors shadow-sm"
                    >
                        Back to Admin
                    </button>
                )}

                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-gray-900 capitalize">{userRole || 'User'}</p>
                        <p className="text-xs text-gray-500">
                            {userRole === 'admin' && viewRole !== 'admin' ? `Viewing as ${viewRole}` : 'View Profile'}
                        </p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
