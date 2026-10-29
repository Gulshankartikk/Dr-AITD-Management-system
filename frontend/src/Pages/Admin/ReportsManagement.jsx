import React, { useState, useEffect } from 'react';
import {
  FaFileAlt,
  FaDownload,
  FaChartBar,
  FaCalendarAlt,
  FaUsers,
  FaRupeeSign,
  FaSpinner,
  FaPlus,
  FaEdit,
  FaTrash,
  FaMagic,
  FaRobot,
  FaLightbulb
} from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';
import api from '../../api/axiosInstance';
import aiService from '../../services/aiService';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';

const ReportsManagement = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualReports, setManualReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  // Gemini AI Insights State
  const [aiInsights, setAiInsights] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [draftingCustomReport, setDraftingCustomReport] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Administrative',
    content: ''
  });

  const reportTypes = [
    { id: 'attendance', name: 'Attendance Report', icon: FaUsers, color: 'blue', endpoint: '/api/admin/attendance-report' },
    { id: 'fees', name: 'Fee Collection Report', icon: FaRupeeSign, color: 'green', endpoint: '/api/admin/reports/fees' },
    { id: 'academic', name: 'Academic Performance', icon: FaChartBar, color: 'purple', endpoint: '/api/admin/reports/academic' },
    { id: 'enrollment', name: 'Student Enrollment', icon: FaCalendarAlt, color: 'orange', endpoint: '/api/admin/reports/enrollment' }
  ];

  useEffect(() => {
    fetchManualReports();
  }, []);

  const fetchManualReports = async () => {
    try {
      const response = await api.get('/api/admin/manual-reports');
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
    setAiInsights('');
    setShowInsights(false);

    try {
      const response = await api.get(type.endpoint);

      if (response.data.success) {
        const data = response.data.data;
        setReportData(data);
        toast.success(`${type.name} generated successfully`);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  // Generate Gemini AI Executive Insights
  const handleGenerateAIInsights = async () => {
    if (!reportData) return;
    setShowInsights(true);
    setAiLoading(true);

    try {
      const res = await aiService.getReportSummary(selectedReport?.name || 'College Operations', reportData);
      setAiInsights(res.summary || 'Insights generated.');
    } catch (err) {
      console.error('Failed to generate AI insights:', err);
      setAiInsights('Unable to generate AI analysis. Please verify your connection.');
    } finally {
      setAiLoading(false);
    }
  };

  // AI draft for custom report
  const handleAIDraftCustomReport = async () => {
    if (!formData.title.trim()) {
      toast.warning('Please enter a report title first!');
      return;
    }

    setDraftingCustomReport(true);
    try {
      const res = await aiService.explainTopic(
        `Official Institutional Administrative Report titled: "${formData.title}" (Type: ${formData.type}). Summarize background, observations, and recommendations for Dr. AITD administration.`,
        'College Administration',
        'in-depth'
      );

      if (res.success && res.explanation) {
        setFormData(p => ({ ...p, content: res.explanation }));
        toast.success('✨ Report drafted with Gemini AI!');
      }
    } catch (err) {
      console.error('Draft error:', err);
      toast.error('AI drafting failed.');
    } finally {
      setDraftingCustomReport(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReport) {
        await api.put(`/api/admin/manual-reports/${editingReport._id}`, formData);
        toast.success('Report updated successfully');
      } else {
        await api.post('/api/admin/manual-reports', formData);
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
        await api.delete(`/api/admin/manual-reports/${id}`);
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

    if (selectedReport.id === 'fees') {
      csvContent += "Course ID,Collected,Due\n";
      Object.entries(reportData.courseWiseStats).forEach(([courseId, stats]) => {
        csvContent += `${courseId},${stats.collected},${stats.due}\n`;
      });
    } else if (selectedReport.id === 'academic') {
      csvContent += "Subject,Average Marks,Highest Marks,Total Records\n";
      Object.entries(reportData.subjectStats).forEach(([subject, stats]) => {
        csvContent += `${subject},${stats.average},${stats.highest},${stats.count}\n`;
      });
    } else if (selectedReport.id === 'enrollment') {
      csvContent += "Category,Key,Count\n";
      Object.entries(reportData.courseDistribution).forEach(([course, count]) => {
        csvContent += `Course,${course},${count}\n`;
      });
      Object.entries(reportData.yearDistribution).forEach(([year, count]) => {
        csvContent += `Year,${year},${count}\n`;
      });
    } else {
      csvContent += JSON.stringify(reportData);
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedReport.id}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderReportContent = () => {
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

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <h3 className="px-6 py-4 bg-gray-50 font-bold border-b border-gray-200 text-secondary font-heading">Course-wise Collection</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Course ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Collected</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Due</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(reportData.courseWiseStats).map(([courseId, stats]) => (
                    <tr key={courseId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">{courseId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-success font-medium">₹{stats.collected.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-danger font-medium">₹{stats.due.toLocaleString()}</td>
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
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <h3 className="px-6 py-4 bg-gray-50 font-bold border-b border-gray-200 text-secondary font-heading">Subject Performance</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Average Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Highest Marks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Total Records</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(reportData.subjectStats).map(([subject, stats]) => (
                    <tr key={subject} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary">{subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{stats.average}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{stats.highest}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{stats.count}</td>
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
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-secondary mb-2 font-heading">Total Students</h3>
              <p className="text-3xl font-bold text-primary">{reportData.totalStudents}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <h3 className="px-6 py-4 bg-gray-50 font-bold border-b border-gray-200 text-secondary font-heading">Course Distribution</h3>
                <ul className="divide-y divide-gray-200">
                  {Object.entries(reportData.courseDistribution).map(([course, count]) => (
                    <li key={course} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                      <span className="text-text-secondary">{course}</span>
                      <span className="bg-primary/10 text-primary py-1 px-3 rounded-full text-sm font-medium">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <h3 className="px-6 py-4 bg-gray-50 font-bold border-b border-gray-200 text-secondary font-heading">Semester Distribution</h3>
                <ul className="divide-y divide-gray-200">
                  {Object.entries(reportData.yearDistribution).map(([sem, count]) => (
                    <li key={sem} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                      <span className="text-text-secondary">{sem}</span>
                      <span className="bg-secondary/10 text-secondary py-1 px-3 rounded-full text-sm font-medium">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center text-text-secondary">
            <p>Attendance data loaded. {reportData.attendance?.length || 0} records found.</p>
            <p className="text-sm mt-2 text-text-muted">Use the specific Attendance Management page for detailed analysis.</p>
          </div>
        );

      default:
        return <div className="text-center py-8 text-text-muted">Select a report type to view details</div>;
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
              <h1 className="text-3xl font-bold text-secondary font-heading">Reports Management</h1>
              <p className="text-text-secondary mt-1">Generate institutional reports and synthesize AI executive insights</p>
            </div>
          </div>

          {/* Report Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {reportTypes.map((report) => (
              <div
                key={report.id}
                className={`bg-white p-6 rounded-lg shadow-md cursor-pointer transition-all hover:shadow-lg border-2 ${
                  selectedReport?.id === report.id ? `border-primary` : 'border-transparent'
                }`}
                onClick={() => generateReport(report)}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-full bg-primary/10 mr-4 text-primary`}>
                    <report.icon className="text-2xl" />
                  </div>
                  <h3 className="font-bold text-secondary">{report.name}</h3>
                </div>
                <Button variant="outline" className="w-full">
                  Generate Report
                </Button>
              </div>
            ))}
          </div>

          {/* Report Content Area */}
          {selectedReport && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-fade-in border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-200 pb-4">
                <h2 className="text-xl font-bold text-secondary font-heading">{selectedReport.name}</h2>
                <div className="flex items-center gap-3">
                  {reportData && (
                    <button
                      onClick={handleGenerateAIInsights}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <FaMagic />
                      <span>✨ AI Executive Insights</span>
                    </button>
                  )}
                  {reportData && (
                    <button
                      onClick={downloadCSV}
                      className="flex items-center space-x-2 text-primary hover:text-primary/80 font-medium text-sm"
                    >
                      <FaDownload />
                      <span>Download Data</span>
                    </button>
                  )}
                </div>
              </div>

              {/* AI Insights Card */}
              {showInsights && (
                <div className="mb-6 p-5 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-pink-50/40">
                  <div className="flex items-center justify-between mb-3 border-b border-indigo-100 pb-2">
                    <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                      <FaRobot className="text-indigo-600 text-base" />
                      <span>Gemini AI Strategic Insights & Observations</span>
                      <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold ml-1">Live Gemini 2.5</span>
                    </div>
                    <button
                      onClick={() => setShowInsights(false)}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Dismiss
                    </button>
                  </div>
                  {aiLoading ? (
                    <div className="py-6 flex items-center justify-center gap-2 text-indigo-700">
                      <FaSpinner className="animate-spin" />
                      <span className="text-xs font-medium">Gemini is analyzing institutional data patterns...</span>
                    </div>
                  ) : (
                    <div>
                      <div className="prose prose-sm max-w-none text-xs sm:text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                        {aiInsights}
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={handleGenerateAIInsights}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                        >
                          <FaLightbulb /> Refresh Analysis
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {loading ? (
                <div className="py-12 flex justify-center">
                  <FaSpinner className="animate-spin text-3xl text-primary" />
                </div>
              ) : (
                renderReportContent()
              )}
            </div>
          )}

          {/* Manual Reports Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-secondary font-heading">Custom Administrative Reports</h2>
                <p className="text-xs text-text-secondary">Draft and archive internal institutional memos</p>
              </div>
              <Button
                onClick={() => {
                  setEditingReport(null);
                  setFormData({ title: '', type: 'Administrative', content: '' });
                  setShowModal(true);
                }}
                className="flex items-center space-x-2"
              >
                <FaPlus />
                <span>Add Report</span>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {manualReports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-secondary">{report.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-secondary">
                          {report.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => {
                            setEditingReport(report);
                            setFormData({ title: report.title, type: report.type, content: report.content });
                            setShowModal(true);
                          }}
                          className="text-success hover:text-success/80"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(report._id)}
                          className="text-danger hover:text-danger/80"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {manualReports.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-text-muted">
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
        <div className="fixed inset-0 bg-secondary/50 overflow-y-auto h-full w-full z-50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative p-6 border max-w-xl w-full shadow-2xl rounded-xl bg-white border-gray-200">
            <div>
              <h3 className="text-lg font-bold text-secondary mb-1 font-heading">
                {editingReport ? 'Edit Custom Report' : 'Add Custom Report'}
              </h3>
              <p className="text-xs text-text-secondary mb-4">Write report or draft with Gemini AI</p>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <Input
                  label="Title *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual Academic Audit & Infrastructure Review"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                  >
                    <option value="Administrative">Administrative</option>
                    <option value="Academic">Academic</option>
                    <option value="Financial">Financial</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-text-secondary">Content *</label>
                    <button
                      type="button"
                      disabled={draftingCustomReport}
                      onClick={handleAIDraftCustomReport}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors disabled:opacity-50"
                    >
                      {draftingCustomReport ? (
                        <>
                          <FaSpinner className="animate-spin text-indigo-500" />
                          <span>Gemini Drafting...</span>
                        </>
                      ) : (
                        <>
                          <FaMagic className="text-indigo-500" />
                          <span>✨ AI Auto-Draft</span>
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono focus:ring-primary focus:border-primary transition-all duration-200"
                    rows="6"
                    placeholder="Enter report content or click ✨ AI Auto-Draft to generate based on title..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingReport ? 'Update Report' : 'Save Report'}
                  </Button>
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
