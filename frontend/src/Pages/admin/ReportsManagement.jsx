import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaDownload, FaChartBar, FaCalendarAlt, FaUsers, FaDollarSign, FaSpinner, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const ReportsManagement = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualReports, setManualReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'Administrative',
    content: ''
  });

  const reportTypes = [
    { id: 'attendance', name: 'Attendance Report', icon: FaUsers, color: 'blue', endpoint: '/api/admin/attendance-report' },
    { id: 'fees', name: 'Fee Collection Report', icon: FaDollarSign, color: 'green', endpoint: '/api/admin/reports/fees' },
    { id: 'academic', name: 'Academic Performance', icon: FaChartBar, color: 'purple', endpoint: '/api/admin/reports/academic' },
    { id: 'enrollment', name: 'Student Enrollment', icon: FaCalendarAlt, color: 'orange', endpoint: '/api/admin/reports/enrollment' }
  ];

  useEffect(() => {
    fetchManualReports();
  }, []);

  const fetchManualReports = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BASE_URL}/api/admin/manual-reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setManualReports(response.data.reports);
      }
    } catch (error) {
      console.error('Error fetching manual reports:', error);
    }
  };

  const generateReport = async (type) => {
    setLoading(true);
    setSelectedReport(type);
    setReportData(null);
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BASE_URL}${type.endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setReportData(response.data.data);
        toast.success(`${type.name} generated successfully`);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      if (editingReport) {
        await axios.put(`${BASE_URL}/api/admin/manual-reports/${editingReport._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Report updated successfully');
      } else {
        await axios.post(`${BASE_URL}/api/admin/manual-reports`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Report created successfully');
      }
      setShowModal(false);
      setEditingReport(null);
      setFormData({ title: '', type: 'Administrative', content: '' });
      fetchManualReports();
    } catch (error) {
      console.error('Error saving report:', error);
      toast.error('Failed to save report');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        const token = Cookies.get('token');
        await axios.delete(`${BASE_URL}/api/admin/manual-reports/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Report deleted successfully');
        fetchManualReports();
      } catch (error) {
        console.error('Error deleting report:', error);
        toast.error('Failed to delete report');
      }
    }
  };

  const downloadCSV = () => {
    if (!reportData) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += JSON.stringify(reportData, null, 2);
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedReport.id}_report.json`);
    document.body.appendChild(link);
    link.click();
  };

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-4xl text-sky-blue" />
        </div>
      );
    }

    if (!reportData) return null;

    switch (selectedReport.id) {
      case 'fees':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-green-800 font-semibold">Total Expected</h3>
                <p className="text-2xl font-bold text-green-600">₹{reportData.summary.totalExpected.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-blue-800 font-semibold">Total Collected</h3>
                <p className="text-2xl font-bold text-blue-600">₹{reportData.summary.totalCollected.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h3 className="text-red-800 font-semibold">Total Due</h3>
                <p className="text-2xl font-bold text-red-600">₹{reportData.summary.totalDue.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
              <h3 className="px-6 py-4 bg-background font-bold border-b border-soft-grey">Course-wise Collection</h3>
              <table className="min-w-full divide-y divide-soft-grey">
                <thead className="bg-background">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Course ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Collected</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Due</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-soft-grey">
                  {Object.entries(reportData.courseWiseStats).map(([courseId, stats]) => (
                    <tr key={courseId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-navy">{courseId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">₹{stats.collected.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">₹{stats.due.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'academic':
        return (
          <div className="space-y-6">
            <div className="bg-white border rounded-lg overflow-hidden">
              <h3 className="px-6 py-4 bg-background font-bold border-b border-soft-grey">Subject Performance</h3>
              <table className="min-w-full divide-y divide-soft-grey">
                <thead className="bg-background">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Average Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Highest Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Total Records</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-soft-grey">
                  {Object.entries(reportData.subjectStats).map(([subject, stats]) => (
                    <tr key={subject}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-navy">{subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-grey">{stats.average}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-grey">{stats.highest}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-grey">{stats.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'enrollment':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-soft-grey">
              <h3 className="text-lg font-bold text-navy mb-2">Total Students</h3>
              <p className="text-3xl font-bold text-sky-blue">{reportData.totalStudents}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-soft-grey rounded-lg overflow-hidden">
                <h3 className="px-6 py-4 bg-background font-bold border-b border-soft-grey">Course Distribution</h3>
                <ul className="divide-y divide-soft-grey">
                  {Object.entries(reportData.courseDistribution).map(([course, count]) => (
                    <li key={course} className="px-6 py-4 flex justify-between items-center">
                      <span className="text-text-grey">{course}</span>
                      <span className="bg-sky-blue/10 text-sky-blue py-1 px-3 rounded-full text-sm font-medium">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-soft-grey rounded-lg overflow-hidden">
                <h3 className="px-6 py-4 bg-background font-bold border-b border-soft-grey">Semester Distribution</h3>
                <ul className="divide-y divide-soft-grey">
                  {Object.entries(reportData.yearDistribution).map(([sem, count]) => (
                    <li key={sem} className="px-6 py-4 flex justify-between items-center">
                      <span className="text-text-grey">{sem}</span>
                      <span className="bg-purple-100 text-purple-800 py-1 px-3 rounded-full text-sm font-medium">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="bg-white p-6 rounded-lg border border-soft-grey text-center text-text-grey">
            <p>Attendance data loaded. {reportData.attendance?.length || 0} records found.</p>
            <p className="text-sm mt-2">Use the specific Attendance Management page for detailed analysis.</p>
          </div>
        );

      default:
        return <div className="text-center py-8 text-text-grey">Select a report type to view details</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <BackButton className="mb-4" />
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-navy">Reports Management</h1>
              <p className="text-text-grey mt-2">Generate and manage institutional reports</p>
            </div>
          </div>

          {/* Report Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {reportTypes.map((report) => (
              <div
                key={report.id}
                className={`bg-white p-6 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg border-2 ${selectedReport?.id === report.id ? `border-${report.color}-500` : 'border-transparent'
                  }`}
                onClick={() => generateReport(report)}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-full bg-${report.color}-100 mr-4`}>
                    <report.icon className={`text-2xl text-${report.color}-500`} />
                  </div>
                  <h3 className="font-bold text-navy">{report.name}</h3>
                </div>
                <button className="w-full py-2 bg-background text-text-grey rounded hover:bg-soft-grey/20 transition-colors text-sm font-medium">
                  Generate Report
                </button>
              </div>
            ))}
          </div>

          {/* Report Content Area */}
          {selectedReport && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-fade-in">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-navy">{selectedReport.name}</h2>
                {reportData && (
                  <button
                    onClick={downloadCSV}
                    className="flex items-center space-x-2 text-sky-blue hover:text-sky-blue/80 font-medium"
                  >
                    <FaDownload />
                    <span>Download Data</span>
                  </button>
                )}
              </div>

              {renderReportContent()}
            </div>
          )}

          {/* Manual Reports Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 bg-background border-b border-soft-grey flex justify-between items-center">
              <h2 className="text-xl font-bold text-navy">Custom Reports</h2>
              <button
                onClick={() => {
                  setEditingReport(null);
                  setFormData({ title: '', type: 'Administrative', content: '' });
                  setShowModal(true);
                }}
                className="flex items-center space-x-2 bg-sky-blue text-white px-4 py-2 rounded-lg hover:bg-sky-blue/80"
              >
                <FaPlus />
                <span>Add Report</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-soft-grey">
                <thead className="bg-background">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-soft-grey">
                  {manualReports.map((report) => (
                    <tr key={report._id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-navy">{report.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-soft-grey/20 text-navy">
                          {report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-text-grey">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => {
                            setEditingReport(report);
                            setFormData({ title: report.title, type: report.type, content: report.content });
                            setShowModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(report._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {manualReports.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-text-grey">
                        No custom reports found. Add one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-navy/50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-navy mb-4">
                {editingReport ? 'Edit Report' : 'Add Custom Report'}
              </h3>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-grey">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full border border-soft-grey rounded-md px-3 py-2 focus:ring-sky-blue focus:border-sky-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="mt-1 block w-full border border-soft-grey rounded-md px-3 py-2 focus:ring-sky-blue focus:border-sky-blue"
                  >
                    <option value="Administrative">Administrative</option>
                    <option value="Academic">Academic</option>
                    <option value="Financial">Financial</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey">Content</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="mt-1 block w-full border border-soft-grey rounded-md px-3 py-2 focus:ring-sky-blue focus:border-sky-blue"
                    rows="4"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-soft-grey text-navy rounded-md hover:bg-soft-grey/80"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-blue text-white rounded-md hover:bg-sky-blue/80"
                  >
                    {editingReport ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsManagement;