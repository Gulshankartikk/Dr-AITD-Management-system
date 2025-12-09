import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaPlus, FaClock, FaEdit, FaDownload, FaTimes, FaSearch, FaUsers, FaChalkboardTeacher, FaTrash } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';

const TimetableManagement = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [timetable, setTimetable] = useState([]);

  const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00', '4:00-5:00'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const [newSlot, setNewSlot] = useState({
    day: '',
    timeSlot: '',
    subjectId: '',
    teacherId: '',
    roomNo: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedCourse && selectedSemester) {
      fetchTimetable();
    }
  }, [selectedCourse, selectedSemester]);

  const fetchInitialData = async () => {
    try {
      const token = Cookies.get('token');
      const [coursesRes, teachersRes, subjectsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/admin/courses`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/api/admin/teachers`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${BASE_URL}/api/admin/subjects`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setCourses(coursesRes.data.courses || []);
      setTeachers(teachersRes.data.teachers || []);
      setSubjects(subjectsRes.data.subjects || []);

      if (coursesRes.data.courses.length > 0) {
        setSelectedCourse(coursesRes.data.courses[0]._id);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
      toast.error('Failed to load initial data');
    }
  };

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BASE_URL}/api/admin/timetable`, {
        params: { courseId: selectedCourse, semester: selectedSemester },
        headers: { Authorization: `Bearer ${token}` }
      });
      setTimetable(response.data.timetable || []);
    } catch (error) {
      console.error('Error fetching timetable:', error);
      toast.error('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSlot = async () => {
    if (!newSlot.day || !newSlot.timeSlot || !newSlot.subjectId || !newSlot.teacherId) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const token = Cookies.get('token');
      await axios.post(`${BASE_URL}/api/admin/timetable`, {
        ...newSlot,
        courseId: selectedCourse,
        semester: selectedSemester
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Slot added successfully');
      setShowCreateModal(false);
      setNewSlot({ day: '', timeSlot: '', subjectId: '', teacherId: '', roomNo: '' });
      fetchTimetable();
    } catch (error) {
      console.error('Error creating slot:', error);
      toast.error(error.response?.data?.msg || 'Failed to create slot');
    }
  };

  const handleDeleteSlot = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;

    try {
      const token = Cookies.get('token');
      await axios.delete(`${BASE_URL}/api/admin/timetable/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Slot deleted successfully');
      fetchTimetable();
    } catch (error) {
      console.error('Error deleting slot:', error);
      toast.error('Failed to delete slot');
    }
  };

  const getSlot = (day, time) => {
    return timetable.find(t => t.day === day && t.timeSlot === time);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <BackButton className="mb-4" />
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-secondary font-heading">Timetable Management</h1>
              <p className="text-text-secondary">Create and manage class schedules</p>
            </div>
            <Button onClick={() => setShowCreateModal(true)} className="flex items-center">
              <FaPlus className="mr-2" /> Add Slot
            </Button>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select
                label="Course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                {courses.map(course => (
                  <option key={course._id} value={course._id}>{course.courseName}</option>
                ))}
              </Select>
              <Select
                label="Semester"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </Select>
            </div>
          </div>

          {/* Timetable Grid */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-text-secondary border-r border-gray-200 w-32">Time</th>
                    {days.map(day => (
                      <th key={day} className="px-4 py-3 text-center font-medium text-text-secondary border-r border-gray-200 min-w-[160px]">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {timeSlots.map((time) => (
                    <tr key={time} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-secondary border-r border-gray-200 bg-gray-50/50">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-primary" />
                          {time}
                        </div>
                      </td>
                      {days.map(day => {
                        const slot = getSlot(day, time);
                        return (
                          <td key={day} className="p-2 border-r border-gray-200 text-center align-top h-24">
                            {slot ? (
                              <div className="bg-primary/10 p-2 rounded-lg border border-primary/20 h-full flex flex-col justify-between group relative transition-all hover:shadow-sm">
                                <div>
                                  <p className="font-semibold text-secondary text-sm">{slot.subjectId?.subjectName || 'Unknown Subject'}</p>
                                  <p className="text-xs text-primary mt-1">{slot.teacherId?.name || 'Unknown Teacher'}</p>
                                  <p className="text-xs text-text-muted mt-1">{slot.roomNo}</p>
                                </div>
                                <button
                                  onClick={() => handleDeleteSlot(slot._id)}
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-danger hover:text-red-700 transition-opacity"
                                >
                                  <FaTrash size={12} />
                                </button>
                              </div>
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-text-muted text-xs">
                                -
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Create Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-secondary/50 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-secondary font-heading">Add Class Slot</h2>
                  <button onClick={() => setShowCreateModal(false)} className="text-text-secondary hover:text-secondary">
                    <FaTimes size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <Select
                    label="Day"
                    value={newSlot.day}
                    onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value })}
                  >
                    <option value="">Select Day</option>
                    {days.map(day => <option key={day} value={day}>{day}</option>)}
                  </Select>

                  <Select
                    label="Time Slot"
                    value={newSlot.timeSlot}
                    onChange={(e) => setNewSlot({ ...newSlot, timeSlot: e.target.value })}
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                  </Select>

                  <Select
                    label="Subject"
                    value={newSlot.subjectId}
                    onChange={(e) => setNewSlot({ ...newSlot, subjectId: e.target.value })}
                  >
                    <option value="">Select Subject</option>
                    {subjects.filter(s => s.courseId?._id === selectedCourse).map(sub => (
                      <option key={sub._id} value={sub._id}>{sub.subjectName}</option>
                    ))}
                  </Select>

                  <Select
                    label="Teacher"
                    value={newSlot.teacherId}
                    onChange={(e) => setNewSlot({ ...newSlot, teacherId: e.target.value })}
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(teacher => (
                      <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                    ))}
                  </Select>

                  <Input
                    label="Room Number"
                    value={newSlot.roomNo}
                    onChange={(e) => setNewSlot({ ...newSlot, roomNo: e.target.value })}
                    placeholder="e.g. 101"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                  <Button onClick={handleCreateSlot}>Save Slot</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimetableManagement;