import React, { useState } from 'react';
import { FaCog, FaSave, FaUser, FaLock, FaBell, FaDatabase } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: FaCog },
    { id: 'users', name: 'User Management', icon: FaUser },
    { id: 'security', name: 'Security', icon: FaLock },
    { id: 'notifications', name: 'Notifications', icon: FaBell },
    { id: 'system', name: 'System', icon: FaDatabase }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-navy">System Settings</h1>
            <p className="text-text-grey">Configure system preferences and settings</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80">
            <FaSave />
            <span>Save Changes</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-md p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id
                        ? 'bg-sky-blue text-white'
                        : 'text-text-grey hover:bg-soft-grey/20'
                      }`}
                  >
                    <tab.icon />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              {activeTab === 'general' && (
                <div>
                  <h2 className="text-xl font-bold text-navy mb-6">General Settings</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-grey mb-2">Institution Name</label>
                        <input
                          type="text"
                          defaultValue="College ERP Management System"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-grey mb-2">Academic Year</label>
                        <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue">
                          <option>2023-2024</option>
                          <option>2024-2025</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-grey mb-2">Institution Address</label>
                      <textarea
                        rows="3"
                        defaultValue="123 Education Street, Knowledge City, State - 123456"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-grey mb-2">Contact Email</label>
                        <input
                          type="email"
                          defaultValue="admin@college.edu"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-grey mb-2">Contact Phone</label>
                        <input
                          type="tel"
                          defaultValue="+1 234 567 8900"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <h2 className="text-xl font-bold text-navy mb-6">User Management Settings</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <h3 className="font-medium text-navy">Allow Student Registration</h3>
                        <p className="text-sm text-text-grey">Enable students to register themselves</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-soft-grey peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-blue/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-soft-grey after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-blue"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <h3 className="font-medium text-navy">Require Email Verification</h3>
                        <p className="text-sm text-text-grey">Users must verify email before access</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-soft-grey peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-blue/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-soft-grey after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-blue"></div>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-grey mb-2">Default User Role</label>
                      <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue">
                        <option>Student</option>
                        <option>Teacher</option>
                        <option>Staff</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-bold text-navy mb-6">Security Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-text-grey mb-2">Password Policy</label>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-3" />
                          <span className="text-sm">Minimum 8 characters</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-3" />
                          <span className="text-sm">Require uppercase letters</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" defaultChecked className="mr-3" />
                          <span className="text-sm">Require numbers</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-3" />
                          <span className="text-sm">Require special characters</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-grey mb-2">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        defaultValue="30"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <h3 className="font-medium text-navy">Two-Factor Authentication</h3>
                        <p className="text-sm text-text-grey">Require 2FA for admin accounts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-soft-grey peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-blue/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-soft-grey after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-blue"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-bold text-navy mb-6">Notification Settings</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <h3 className="font-medium text-navy">Email Notifications</h3>
                        <p className="text-sm text-text-grey">Send notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-soft-grey peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-blue/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-soft-grey after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-blue"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <h3 className="font-medium text-navy">SMS Notifications</h3>
                        <p className="text-sm text-text-grey">Send notifications via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-soft-grey peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-blue/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-soft-grey after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-blue"></div>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-grey mb-2">SMTP Server</label>
                      <input
                        type="text"
                        placeholder="smtp.gmail.com"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'system' && (
                <div>
                  <h2 className="text-xl font-bold text-navy mb-6">System Settings</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-text-grey mb-2">Database Backup Frequency</label>
                        <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue">
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-grey mb-2">Log Retention (days)</label>
                        <input
                          type="number"
                          defaultValue="30"
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-background rounded-lg">
                      <div>
                        <h3 className="font-medium text-navy">Maintenance Mode</h3>
                        <p className="text-sm text-text-grey">Enable maintenance mode for system updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-soft-grey peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-blue/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-soft-grey after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-blue"></div>
                      </label>
                    </div>
                    <div className="space-y-3">
                      <button className="w-full p-3 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80">
                        Backup Database Now
                      </button>
                      <button className="w-full p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                        Clear System Cache
                      </button>
                      <button className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        Reset System Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;