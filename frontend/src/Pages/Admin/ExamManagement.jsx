import React, { useState, useEffect, useMemo } from 'react';
import { FaClipboardCheck, FaPlus, FaCalendarAlt, FaEdit, FaEye, FaDownload, FaTimes, FaSearch, FaClock, FaUsers, FaSpinner } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import api from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const ExamManagement = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marksList, setMarksList] = useState([]);

  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const [newExam, setNewExam] = useState({
    name: '',
    course: '',
    subject: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    duration: '3 hours',
    room: 'LH-201',
    students: 45
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [coursesRes, subjectsRes, marksRes] = await Promise.all([
        api.get('/api/admin/courses').catch(() => ({ data: { courses: [] } })),
        api.get('/api/admin/subjects').catch(() => ({ data: { subjects: [] } })),
        api.get('/api/admin/marks').catch(() => ({ data: { marks: [] } }))
      ]);

      const loadedCourses = coursesRes.data.courses || [];
      const loadedSubjects = subjectsRes.data.subjects || [];
      const loadedMarks = marksRes.data.marks || [];

      setCourses(loadedCourses);
      setSubjects(loadedSubjects);
      setMarksList(loadedMarks);

      // Group marks into distinct academic examinations
      const examGroupMap = {};
      const calculatedResults = [];

      loadedMarks.forEach((m) => {
        const sub = m.subjectId;
        const subName = sub?.subjectName || 'Engineering Subject';
        const courseName = sub?.courseId?.courseName || 'Computer Science & Engineering';
        const examName = `${m.examType} - ${subName}`;
        const key = `${m.examType}_${sub?._id || 'gen'}`;

        if (!examGroupMap[key]) {
          examGroupMap[key] = {
            id: key,
            name: examName,
            examType: m.examType,
            course: courseName,
            subject: subName,
            date: '2026-10-24',
            time: '10:00 AM',
            duration: m.examType === 'Final' ? '3 hours' : m.examType === 'Mid Term' ? '2 hours' : '1 hour',
            room: 'LH-201 / LH-202',
            status: 'Completed',
            students: 0,
            totalMarksSum: 0
          };
        }

        examGroupMap[key].students++;
        examGroupMap[key].totalMarksSum += m.marks;

        // Calculate student grade
        const pct = m.totalMarks > 0 ? Math.round((m.marks / m.totalMarks) * 100) : 0;
        const grade =
          pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : 'F';
        const passStatus = pct >= 50 ? 'Pass' : 'Fail';

        calculatedResults.push({
          examId: key,
          student: m.studentId?.name || 'Demo Student',
          rollNo: m.studentId?.rollNo || 'N/A',
          marks: `${m.marks} / ${m.totalMarks}`,
          grade: grade,
          status: passStatus
        });
      });

      // Add upcoming scheduled exams if needed
      const scheduledExams = [
        {
          id: 'sched_even_final_2026',
          name: 'Even Semester End-Term Theory Examinations 2026',
          examType: 'Final',
          course: 'All Departments (B.Tech / Diploma)',
          subject: 'Comprehensive Sessional Schedule',
          date: '2026-11-25',
          time: '09:30 AM',
          duration: '3 hours',
          room: 'Examination Center - Block A & B',
          status: 'Scheduled',
          students: 120
        },
        {
          id: 'sched_viva_2026',
          name: 'Annual Laboratory Practical & Viva-Voce',
          examType: 'Practical',
          course: 'CSE / IT / ECE / ME',
          subject: 'Engineering Labs (DSA, Networks, VLSI, Thermo)',
          date: '2026-12-02',
          time: '10:00 AM',
          duration: '4 hours',
          room: 'Central Computing Laboratories',
          status: 'Scheduled',
          students: 95
        }
      ];

      const allExams = [...Object.values(examGroupMap), ...scheduledExams];
      setExams(allExams);
      setResults(calculatedResults);

      if (loadedCourses.length > 0) {
        setNewExam((prev) => ({
          ...prev,
          course: loadedCourses[0].courseName
        }));
      }
      if (loadedSubjects.length > 0) {
        setNewExam((prev) => ({
          ...prev,
          subject: loadedSubjects[0].subjectName
        }));
      }
    } catch (err) {
      console.error('Error fetching exam data:', err);
      toast.error('Failed to load examinations');
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        exam.name.toLowerCase().includes(q) ||
        exam.course.toLowerCase().includes(q) ||
        exam.subject.toLowerCase().includes(q);

      const matchesStatus = selectedStatus === 'All Status' || exam.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [exams, searchTerm, selectedStatus]);

  const exportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Exam Name,Course,Subject,Date,Time,Duration,Room,Students,Status\n' +
      filteredExams
        .map(
          (exam) =>
            `"${exam.name}","${exam.course}","${exam.subject}",${exam.date},${exam.time},${exam.duration},"${exam.room}",${exam.students},${exam.status}`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `draitd_exam_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Examination schedule exported to CSV');
  };

  const scheduleExam = () => {
    if (!newExam.name) {
      toast.error('Please enter examination name');
      return;
    }
    const createdExam = {
      id: `custom_${Date.now()}`,
      ...newExam,
      status: 'Scheduled'
    };
    setExams([createdExam, ...exams]);
    setNewExam({
      name: '',
      course: courses[0]?.courseName || 'CSE',
      subject: subjects[0]?.subjectName || 'Algorithms',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      duration: '3 hours',
      room: 'LH-201',
      students: 45
    });
    setShowScheduleModal(false);
    toast.success('New Examination added to academic schedule!');
  };

  const viewDetails = (exam) => {
    setSelectedExam(exam);
    setShowDetailsModal(true);
  };

  const editExam = (exam) => {
    setSelectedExam({ ...exam });
    setShowEditModal(true);
  };

  const saveEditedExam = () => {
    setExams(exams.map((exam) => (exam.id === selectedExam.id ? selectedExam : exam)));
    setShowEditModal(false);
    toast.success('Examination schedule updated successfully!');
  };

  const viewResults = (exam) => {
    setSelectedExam(exam);
    setShowResultsModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-background">
        <FaSpinner className="animate-spin text-4xl text-primary mb-4" />
        <p className="text-secondary font-medium">Loading Dr. AITD Examination Schedule...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton className="mb-4" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-secondary font-heading flex items-center gap-2">
                <FaClipboardCheck className="text-primary text-2xl" />
                Examinations & Academic Grading
              </h1>
              <p className="text-text-secondary text-sm mt-1">
                Semester end-terms, sessional tests, room allotments, and published results
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={exportReport} className="flex items-center space-x-2 text-sm">
                <FaDownload />
                <span>Export Schedule</span>
              </Button>
              <Button
                onClick={() => setShowScheduleModal(true)}
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-white text-sm"
              >
                <FaPlus />
                <span>Schedule Exam</span>
              </Button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <Input
                  icon={FaSearch}
                  placeholder="Search exams by title, subject, course, or room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="All Status">All Exam Statuses</option>
                <option value="Completed">Completed / Evaluated</option>
                <option value="Scheduled">Upcoming / Scheduled</option>
              </Select>
            </div>
          </div>

          {/* Exams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        exam.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {exam.status}
                    </span>
                    <span className="text-xs text-text-secondary font-mono">{exam.room}</span>
                  </div>

                  <h3 className="text-lg font-bold text-secondary mb-1 line-clamp-1" title={exam.name}>
                    {exam.name}
                  </h3>
                  <p className="text-xs font-medium text-primary mb-3">{exam.course}</p>

                  <div className="space-y-1.5 text-xs text-text-secondary border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>{exam.date} • {exam.time} ({exam.duration})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUsers className="text-gray-400" />
                      <span>{exam.students} Registered Candidates</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-4">
                  <div className="space-x-1">
                    <button
                      onClick={() => viewDetails(exam)}
                      className="p-1.5 text-text-secondary hover:text-primary transition-colors"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => editExam(exam)}
                      className="p-1.5 text-text-secondary hover:text-secondary transition-colors"
                      title="Edit Schedule"
                    >
                      <FaEdit />
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewResults(exam)}
                    className="text-xs font-medium"
                  >
                    Results Ledger
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
              <h2 className="text-lg font-bold text-secondary">Schedule New Academic Exam</h2>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={18} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">Exam Title</label>
                <Input
                  placeholder="e.g. Sessional 2 Test - Computer Networks"
                  value={newExam.name}
                  onChange={(e) => setNewExam({ ...newExam, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Course</label>
                  <Select
                    value={newExam.course}
                    onChange={(e) => setNewExam({ ...newExam, course: e.target.value })}
                  >
                    {courses.map((c) => (
                      <option key={c._id} value={c.courseName}>
                        {c.courseCode}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Subject</label>
                  <Select
                    value={newExam.subject}
                    onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                  >
                    {subjects.map((s) => (
                      <option key={s._id} value={s.subjectName}>
                        {s.subjectCode} - {s.subjectName}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Date</label>
                  <Input
                    type="date"
                    value={newExam.date}
                    onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Time</label>
                  <Input
                    value={newExam.time}
                    onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Duration</label>
                  <Input
                    value={newExam.duration}
                    onChange={(e) => setNewExam({ ...newExam, duration: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">Examination Hall</label>
                  <Input
                    value={newExam.room}
                    onChange={(e) => setNewExam({ ...newExam, room: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button onClick={scheduleExam} className="bg-primary hover:bg-primary/90 text-white">
                Save Schedule
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Results Ledger Modal */}
      {showResultsModal && selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-secondary">Results Ledger</h2>
                <p className="text-xs text-text-secondary">{selectedExam.name}</p>
              </div>
              <button onClick={() => setShowResultsModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4">
              {results.filter((r) => r.examId === selectedExam.id).length === 0 ? (
                <div className="p-12 text-center text-text-secondary">
                  <FaClipboardCheck className="mx-auto text-3xl text-gray-300 mb-2" />
                  <p className="font-medium text-sm">No marks recorded yet for this examination.</p>
                  <p className="text-xs text-gray-400 mt-1">Faculty can input marks from the Teacher Portal.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-semibold text-text-secondary border-b border-gray-200">
                      <th className="p-3">Roll No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">Grade</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {results
                      .filter((r) => r.examId === selectedExam.id)
                      .map((res, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="p-3 font-semibold text-secondary">{res.rollNo}</td>
                          <td className="p-3 font-medium text-secondary">{res.student}</td>
                          <td className="p-3 text-secondary">{res.marks}</td>
                          <td className="p-3 font-bold text-primary">{res.grade}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                res.status === 'Pass'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {res.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
              <Button onClick={() => setShowResultsModal(false)}>Close Ledger</Button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h2 className="text-lg font-bold text-secondary">Examination Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={18} />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Title:</span>
                <span className="font-semibold text-secondary">{selectedExam.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Department:</span>
                <span className="text-secondary">{selectedExam.course}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Subject:</span>
                <span className="text-secondary">{selectedExam.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Date & Time:</span>
                <span className="text-secondary">{selectedExam.date} at {selectedExam.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Exam Hall:</span>
                <span className="font-mono text-secondary">{selectedExam.room}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Status:</span>
                <span className="font-semibold text-emerald-600">{selectedExam.status}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowDetailsModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamManagement;
