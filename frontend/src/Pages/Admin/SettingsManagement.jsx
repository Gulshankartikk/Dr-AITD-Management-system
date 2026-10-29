import React, { useState, useEffect } from 'react';
import { FaCog, FaSave, FaUser, FaLock, FaBell, FaDatabase } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select, { SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/Select';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    institutionName: 'Dr. Ambedkar Institute of Technology for Divyangjan (AITD), Kanpur',
    academicYear: '2025-2026',
    address: 'Awadhpuri, Khyora, Lakhanpur, Kanpur - 208024, Uttar Pradesh',
    email: 'admin@draitd.edu',
    phone: '+91 512 258 0122'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await adminService.getSettings();
      if (data.success && data.settings) {
        setSettings(prev => ({ ...prev, ...data.settings }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await adminService.updateSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

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
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <BackButton className="mb-4" />
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary font-heading">System Settings</h1>
              <p className="text-text-secondary">Configure institutional parameters and access controls</p>
            </div>
            <Button className="flex items-center space-x-2" onClick={handleSave} isLoading={loading}>
              <FaSave />
              <span>Save Changes</span>
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-64">
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'text-text-secondary hover:bg-gray-100'
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
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                {activeTab === 'general' && (
                  <div>
                    <h2 className="text-xl font-bold text-secondary mb-6 font-heading">General Institutional Profile</h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Institution Name"
                          value={settings.institutionName}
                          onChange={(e) => handleChange('institutionName', e.target.value)}
                        />
                        <Select
                          label="Academic Year"
                          value={settings.academicYear}
                          onValueChange={(val) => handleChange('academicYear', val)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2025-2026">2025-2026</SelectItem>
                            <SelectItem value="2026-2027">2026-2027</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Campus Address</label>
                        <textarea
                          rows="3"
                          value={settings.address}
                          onChange={(e) => handleChange('address', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Contact Email"
                          type="email"
                          value={settings.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                        />
                        <Input
                          label="Contact Phone"
                          type="tel"
                          value={settings.phone}
                          onChange={(e) => handleChange('phone', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'users' && (
                  <div>
                    <h2 className="text-xl font-bold text-secondary mb-6 font-heading">User Management Settings</h2>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <h3 className="font-medium text-secondary">Allow Student Self-Registration</h3>
                          <p className="text-sm text-text-muted">Permit eligible students to register online</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <h3 className="font-medium text-secondary">Require Email Verification</h3>
                          <p className="text-sm text-text-muted">Users must verify email via OTP</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h2 className="text-xl font-bold text-secondary mb-6 font-heading">Security Policies</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Password Standards</label>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <input type="checkbox" defaultChecked className="mr-3 text-primary focus:ring-primary rounded" />
                            <span className="text-sm text-text-secondary">Minimum 8 characters length</span>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" defaultChecked className="mr-3 text-primary focus:ring-primary rounded" />
                            <span className="text-sm text-text-secondary">Enforce strong hashing (bcrypt salt 10 rounds)</span>
                          </div>
                        </div>
                      </div>
                      <Input
                        label="Session Timeout (minutes)"
                        type="number"
                        defaultValue="30"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-xl font-bold text-secondary mb-6 font-heading">Notification Preferences</h2>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <h3 className="font-medium text-secondary">Broadcast Circulars</h3>
                          <p className="text-sm text-text-muted">Publish notices instantly to Student & Faculty portals</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'system' && (
                  <div>
                    <h2 className="text-xl font-bold text-secondary mb-6 font-heading">System Diagnostics</h2>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-xs space-y-2 text-text-secondary">
                        <div className="flex justify-between">
                          <span className="font-semibold text-secondary">Database:</span>
                          <span className="text-success font-bold">MongoDB Active</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-secondary">API Version:</span>
                          <span>Dr-AITD ERP v2.5.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-secondary">AI Service:</span>
                          <span className="text-primary font-bold">Google Gemini 2.5 Flash</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;
