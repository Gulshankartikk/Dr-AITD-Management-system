import React, { useState } from 'react';
import { FaClipboardCheck, FaPlus, FaCalendarAlt, FaEdit, FaEye, FaDownload, FaTimes, FaSearch, FaClock, FaUsers } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';

const ExamManagement = () => {
  const [exams, setExams] = useState([
    { id: 1, name: 'Mid-Term Exam', course: 'Computer Science', subject: 'Data Structures', date: '2024-02-15', time: '10:00 AM', duration: '3 hours', room: 'Room 101', status: 'Scheduled', students: 45 },
    { id: 2, name: 'Final Exam', course: 'Mechanical Eng.', subject: 'Thermodynamics', date: '2024-03-20', time: '2:00 PM', duration: '3 hours', room: 'Room 205', status: 'Scheduled', students: 38 },
    { id: 3, name: 'Unit Test', course: 'Business Admin', subject: 'Marketing', date: '2024-01-25', time: '11:00 AM', duration: '2 hours', room: 'Room 301', status: 'Completed', students: 42 },
    { id: 4, name: 'Quiz 1', course: 'Computer Science', subject: 'Algorithms', date: '2024-02-10', time: '9:00 AM', duration: '1 hour', room: 'Room 102', status: 'Completed', students: 40 },
    { id: 5, name: 'Practical Exam', course: 'Mechanical Eng.', subject: 'Workshop', date: '2024-02-28', time: '1:00 PM', duration: '4 hours', room: 'Lab 1', status: 'Scheduled', students: 35 }
  ]);

  const [results] = useState([
    { examId: 1, student: 'John Doe', rollNo: 'CS001', marks: 85, grade: 'A', status: 'Pass' },
    { examId: 1, student: 'Jane Smith', rollNo: 'CS002', marks: 92, grade: 'A+', status: 'Pass' },
    { examId: 3, student: 'Mike Johnson', rollNo: 'BA003', marks: 78, grade: 'B+', status: 'Pass' }
  ]);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const [newExam, setNewExam] = useState({
    name: '', course: '', subject: '', date: '', time: '', duration: '', room: '', students: 0
  });

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All Status' || exam.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const exportReport = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Exam Name,Course,Subject,Date,Time,Duration,Room,Students,Status\n" +
      filteredExams.map(exam =>
        `"${exam.name}",${exam.course},${exam.subject},${exam.date},${exam.time},${exam.duration},${exam.room},${exam.students},${exam.status}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `exam_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scheduleExam = () => {
    const exam = {
      id: exams.length + 1,
      ...newExam,
      status: 'Scheduled'
    };
    setExams([...exams, exam]);
    setNewExam({ name: '', course: '', subject: '', date: '', time: '', duration: '', room: '', students: 0 });
    setShowScheduleModal(false);
    alert('Exam scheduled successfully!');
  };

  const viewDetails = (exam) => {
    setSelectedExam(exam);
    setShowDetailsModal(true);
  };

  const editExam = (exam) => {
    setSelectedExam(exam);
    setShowEditModal(true);
  };

  const saveEditedExam = () => {
    setExams(exams.map(exam => exam.id === selectedExam.id ? selectedExam : exam));
    setShowEditModal(false);
    alert('Exam updated successfully!');
  };

  const viewResults = (exam) => {
    setSelectedExam(exam);
    setShowResultsModal(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-navy">Exam Management</h1>
            <p className="text-text-grey">Schedule and manage examinations</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={exportReport}
              className="flex items-center space-x-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90"
            >
              <FaDownload />
              <span>Export Report</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-soft-grey text-navy rounded-lg hover:bg-soft-grey/80">
              <FaCalendarAlt />
              <span>Exam Calendar</span>
            </button>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
            >
              <FaPlus />
              <span>Schedule Exam</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border border-soft-grey">
            <div className="flex items-center">
              <FaClipboardCheck className="text-3xl text-sky-blue mr-4" />
              <div>
                <p className="text-text-grey">Total Exams</p>
                <p className="text-2xl font-bold">{exams.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-soft-grey">
            <div className="flex items-center">
              <FaClipboardCheck className="text-3xl text-sky-blue mr-4" />
              <div>
                <p className="text-text-grey">Completed</p>
                <p className="text-2xl font-bold">{exams.filter(exam => exam.status === 'Completed').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-soft-grey">
            <div className="flex items-center">
              <FaClipboardCheck className="text-3xl text-navy mr-4" />
              <div>
                <p className="text-text-grey">Scheduled</p>
                <p className="text-2xl font-bold">{exams.filter(exam => exam.status === 'Scheduled').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-soft-grey">
            <div className="flex items-center">
              <FaUsers className="text-3xl text-sky-blue mr-4" />
              <div>
                <p className="text-text-grey">Total Students</p>
                <p className="text-2xl font-bold">{exams.reduce((sum, exam) => sum + exam.students, 0)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-soft-grey">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-text-grey" />
              <input
                type="text"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
            >
              <option>All Status</option>
              <option>Scheduled</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        {/* Exam List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-soft-grey">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Exam Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-grey uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-soft-grey">
                {filteredExams.map((exam) => (
                  <tr key={exam.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaClipboardCheck className="text-sky-blue mr-3" />
                        <span className="font-medium text-navy">{exam.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{exam.course}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{exam.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{exam.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{exam.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{exam.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-navy">{exam.students}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${exam.status === 'Completed' ? 'bg-sky-blue/10 text-sky-blue' :
                        exam.status === 'Scheduled' ? 'bg-navy/10 text-navy' :
                          'bg-soft-grey text-text-grey'
                        }`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewDetails(exam)}
                          className="text-sky-blue hover:text-sky-blue/80"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => editExam(exam)}
                          className="text-sky-blue hover:text-sky-blue/80"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => viewResults(exam)}
                          className="text-navy hover:text-navy/80"
                        >
                          <FaClipboardCheck />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule Exam Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-navy">Schedule New Exam</h2>
                <button onClick={() => setShowScheduleModal(false)} className="text-text-grey hover:text-navy">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Exam Name</label>
                  <input
                    type="text"
                    value={newExam.name}
                    onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
                    className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Course</label>
                  <select
                    value={newExam.course}
                    onChange={(e) => setNewExam({ ...newExam, course: e.target.value })}
                    className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  >
                    <option value="">Select Course</option>
                    <option>Computer Science</option>
                    <option>Mechanical Engineering</option>
                    <option>Business Administration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Subject</label>
                  <input
                    type="text"
                    value={newExam.subject}
                    onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Date</label>
                  <input
                    type="date"
                    value={newExam.date}
                    onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                    className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Time</label>
                  <input
                    type="time"
                    value={newExam.time}
                    onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                    className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Duration</label>
                  <select
                    value={newExam.duration}
                    onChange={(e) => setNewExam({ ...newExam, duration: e.target.value })}
                    className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  >
                    <option value="">Select Duration</option>
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>3 hours</option>
                    <option>4 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Room</label>
                  <input
                    type="text"
                    value={newExam.room}
                    onChange={(e) => setNewExam({ ...newExam, room: e.target.value })}
                    className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Expected Students</label>
                  <input
                    type="number"
                    value={newExam.students}
                    onChange={(e) => setNewExam({ ...newExam, students: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-soft-grey text-navy rounded-lg hover:bg-soft-grey/80"
                >
                  Cancel
                </button>
                <button
                  onClick={scheduleExam}
                  className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
                >
                  Schedule Exam
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showDetailsModal && selectedExam && (
          <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-navy">Exam Details</h2>
                <button onClick={() => setShowDetailsModal(false)} className="text-text-grey hover:text-navy">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-background p-4 rounded-lg border border-soft-grey">
                  <h3 className="font-semibold text-navy mb-3">Exam Information</h3>
                  <p><strong>Name:</strong> {selectedExam.name}</p>
                  <p><strong>Course:</strong> {selectedExam.course}</p>
                  <p><strong>Subject:</strong> {selectedExam.subject}</p>
                  <p><strong>Room:</strong> {selectedExam.room}</p>
                </div>

                <div className="bg-background p-4 rounded-lg border border-soft-grey">
                  <h3 className="font-semibold text-navy mb-3">Schedule Details</h3>
                  <p><strong>Date:</strong> {selectedExam.date}</p>
                  <p><strong>Time:</strong> {selectedExam.time}</p>
                  <p><strong>Duration:</strong> {selectedExam.duration}</p>
                  <p><strong>Students:</strong> {selectedExam.students}</p>
                  <p><strong>Status:</strong>
                    <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${selectedExam.status === 'Completed' ? 'bg-sky-blue/10 text-sky-blue' :
                      selectedExam.status === 'Scheduled' ? 'bg-navy/10 text-navy' :
                        'bg-soft-grey text-text-grey'
                      }`}>
                      {selectedExam.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Exam Modal */}
        {showEditModal && selectedExam && (
          <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-navy">Edit Exam</h2>
                <button onClick={() => setShowEditModal(false)} className="text-text-grey hover:text-navy">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Exam Name</label>
                  <input
                    type="text"
                    value={selectedExam.name}
                    onChange={(e) => setSelectedExam({ ...selectedExam, name: e.target.value })}
                    className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Date</label>
                  <input
                    type="date"
                    value={selectedExam.date}
                    onChange={(e) => setSelectedExam({ ...selectedExam, date: e.target.value })}
                    className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Time</label>
                  <input
                    type="time"
                    value={selectedExam.time}
                    onChange={(e) => setSelectedExam({ ...selectedExam, time: e.target.value })}
                    className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-grey mb-2">Room</label>
                  <input
                    type="text"
                    value={selectedExam.room}
                    onChange={(e) => setSelectedExam({ ...selectedExam, room: e.target.value })}
                    className="w-full px-4 py-2 border border-soft-grey rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-soft-grey text-navy rounded-lg hover:bg-soft-grey/80"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedExam}
                  className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Results Modal */}
        {showResultsModal && selectedExam && (
          <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-navy">Exam Results - {selectedExam.name}</h2>
                <button onClick={() => setShowResultsModal(false)} className="text-text-grey hover:text-navy">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-navy mb-3">Exam Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <p><strong>Course:</strong> {selectedExam.course}</p>
                  <p><strong>Subject:</strong> {selectedExam.subject}</p>
                  <p><strong>Date:</strong> {selectedExam.date}</p>
                  <p><strong>Duration:</strong> {selectedExam.duration}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-grey uppercase">Roll No</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-grey uppercase">Student Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-grey uppercase">Marks</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-grey uppercase">Grade</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-grey uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-soft-grey">
                    {results.filter(result => result.examId === selectedExam.id).map((result, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm">{result.rollNo}</td>
                        <td className="px-4 py-3 text-sm">{result.student}</td>
                        <td className="px-4 py-3 text-sm">{result.marks}</td>
                        <td className="px-4 py-3 text-sm">{result.grade}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${result.status === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {result.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {results.filter(result => result.examId === selectedExam.id).length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-4 py-3 text-sm text-text-grey text-center">No results available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowResultsModal(false)}
                  className="px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamManagement;