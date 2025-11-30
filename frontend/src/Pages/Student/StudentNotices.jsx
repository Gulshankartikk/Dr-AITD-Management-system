import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../constants/api';
import StudentHeader from '../../components/StudentHeader';
import BackButton from '../../components/BackButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaBell, FaCalendarAlt } from 'react-icons/fa';

const StudentNotices = () => {
  const { studentId } = useParams();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotices();
  }, [studentId]);

  const fetchNotices = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${BASE_URL}/api/student/${studentId}/notices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotices(response.data.notices || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading notices..." />;

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader currentRole="student" />
      <div className="p-6">
        <BackButton className="mb-4" />
        <h1 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
          <FaBell /> Notices & Announcements
        </h1>

        <div className="grid grid-cols-1 gap-4">
          {notices.length > 0 ? notices.map(notice => (
            <div key={notice._id} className="bg-white rounded-lg shadow-xl p-6 border-l-4 border-sky-blue">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-navy">{notice.title}</h3>
                <span className="text-sm text-text-grey">
                  <FaCalendarAlt className="inline mr-1" />
                  {new Date(notice.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-text-grey">{notice.description}</p>
            </div>
          )) : (
            <div className="bg-white rounded-lg shadow-xl p-12 text-center">
              <FaBell size={48} className="mx-auto mb-4 text-sky-blue" />
              <p className="text-text-grey text-lg">No notices available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentNotices;
