import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import Cookies from 'js-cookie';
import { FaDownload, FaEye, FaUser, FaClock, FaTasks, FaCalendarAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import StudentHeader from '../../components/StudentHeader';
import BackButton from '../../components/BackButton';

const StudentAssignments = () => {
  const { studentId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    fetchAssignments();
  }, [studentId]);

  const fetchAssignments = async () => {
    try {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`${BASE_URL}/api/student/${studentId}/assignments`, { headers });
      setAssignments(response.data.assignments || []);
      setStudentName(response.data.student?.name || '');
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  const getDeadlineStatus = (deadline) => {
    const now = new Date();
    const dueDate = new Date(deadline);
    const diffTime = dueDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { status: 'overdue', text: 'Overdue', color: 'bg-red-100 text-red-800' };
    } else if (diffDays <= 3) {
      return { status: 'urgent', text: `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`, color: 'bg-navy/10 text-navy' };
    } else {
      return { status: 'normal', text: `Due in ${diffDays} days`, color: 'bg-sky-blue/10 text-sky-blue' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StudentHeader studentId={studentId} studentName={studentName} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-blue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader studentId={studentId} studentName={studentName} />
      <BackButton />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 mb-6">
            <FaTasks className="text-3xl text-navy" />
            <h1 className="text-3xl font-bold text-navy">My Assignments</h1>
          </div>

          {assignments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FaTasks className="mx-auto text-6xl text-soft-grey mb-4" />
              <p className="text-text-grey text-lg">No assignments available yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {assignments.map((assignment) => {
                const deadlineInfo = getDeadlineStatus(assignment.deadline);

                return (
                  <div key={assignment._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-navy">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold text-navy">{assignment.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${deadlineInfo.color}`}>
                            {deadlineInfo.text}
                          </span>
                        </div>

                        <p className="text-navy font-medium mb-2">{assignment.subjectId?.subjectName}</p>

                        {assignment.description && (
                          <p className="text-text-grey mb-4">{assignment.description}</p>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-text-grey">
                          <div className="flex items-center space-x-1">
                            <FaUser />
                            <span>By: {assignment.teacherId?.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaCalendarAlt />
                            <span>Due: {new Date(assignment.deadline).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaClock />
                            <span>Assigned: {new Date(assignment.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {assignment.fileUrl && (
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => window.open(assignment.fileUrl, '_blank')}
                            className="flex items-center space-x-1 px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/80 transition-colors"
                            title="View Assignment"
                          >
                            <FaEye />
                            <span>View</span>
                          </button>
                          <button
                            onClick={() => handleDownload(assignment.fileUrl, `${assignment.title}.pdf`)}
                            className="flex items-center space-x-1 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
                            title="Download Assignment"
                          >
                            <FaDownload />
                            <span>Download</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAssignments;
