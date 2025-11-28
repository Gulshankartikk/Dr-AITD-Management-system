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
                {userRole === 'admin' && (
                    <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                        {['admin', 'teacher', 'student'].map((role) => (
                            <button
                                key={role}
                                onClick={() => setViewRole(role)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${viewRole === role
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {role}
                            </button>
                        ))}
                    </div>
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
