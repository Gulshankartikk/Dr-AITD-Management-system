import React, { useState } from 'react';
import { FaFileAlt, FaDownload, FaChartBar, FaCalendarAlt, FaUsers, FaDollarSign } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';

const ReportsManagement = () => {
  const [selectedReport, setSelectedReport] = useState('attendance');
  
  const reportTypes = [
    { id: 'attendance', name: 'Attendance Report', icon: FaUsers, color: 'blue' },
    { id: 'fees', name: 'Fee Collection Report', icon: FaDollarSign, color: 'green' },
    { id: 'academic', name: 'Academic Performance', icon: FaChartBar, color: 'purple' },
    { id: 'monthly', name: 'Monthly Summary', icon: FaCalendarAlt, color: 'orange' }
  ];

  const recentReports = [
    { name: 'Monthly Attendance Report - January 2024', date: '2024-01-31', type: 'Attendance', size: '2.3 MB' },
    { name: 'Fee Collection Summary - Q4 2023', date: '2024-01-15', type: 'Financial', size: '1.8 MB' },
    { name: 'Academic Performance Analysis', date: '2024-01-10', type: 'Academic', size: '3.1 MB' },
    { name: 'Student Enrollment Report', date: '2024-01-05', type: 'Enrollment', size: '1.2 MB' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Reports Management</h1>
            <p className="text-gray-600">Generate and manage institutional reports</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <FaFileAlt />
            <span>Generate Report</span>
          </button>
        </div>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {reportTypes.map((report) => (
            <div 
              key={report.id}
              className={`bg-white p-6 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg ${
                selectedReport === report.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-full bg-${report.color}-100 mr-4`}>
                  <report.icon className={`text-2xl text-${report.color}-500`} />
                </div>
                <h3 className="font-bold text-gray-800">{report.name}</h3>
              </div>
              <button className="w-full py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                Generate
              </button>
            </div>
          ))}
        </div>

        {/* Report Generation Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Generate Custom Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Attendance Report</option>
                <option>Fee Collection Report</option>
                <option>Academic Performance</option>
                <option>Student Enrollment</option>
                <option>Teacher Performance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>Last Year</option>
                <option>Custom Range</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
              <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Generate Report
            </button>
            <button className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
              Schedule Report
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-800">Recent Reports</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Report Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generated Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentReports.map((report, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaFileAlt className="text-blue-500 mr-3" />
                        <span className="font-medium text-gray-900">{report.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{report.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{report.size}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-900">
                        <FaDownload />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaFileAlt className="text-3xl text-blue-500 mr-4" />
              <div>
                <p className="text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaDownload className="text-3xl text-green-500 mr-4" />
              <div>
                <p className="text-gray-600">Downloads</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaCalendarAlt className="text-3xl text-purple-500 mr-4" />
              <div>
                <p className="text-gray-600">This Month</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <FaChartBar className="text-3xl text-orange-500 mr-4" />
              <div>
                <p className="text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsManagement;