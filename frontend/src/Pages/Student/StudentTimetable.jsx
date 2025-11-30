import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../constants/api';
import StudentHeader from '../../components/StudentHeader';
import BackButton from '../../components/BackButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

const StudentTimetable = () => {
  const { studentId } = useParams();
  const [loading, setLoading] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00'];

  if (loading) return <LoadingSpinner message="Loading timetable..." />;

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader currentRole="student" />
      <div className="p-6">
        <BackButton className="mb-4" />
        <h1 className="text-3xl font-bold text-navy mb-6 flex items-center gap-3">
          <FaCalendarAlt /> My Timetable
        </h1>

        <div className="bg-white rounded-lg shadow-xl p-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-navy">
                <th className="p-3 text-white border border-soft-grey">Time</th>
                {days.map(day => (
                  <th key={day} className="p-3 text-white border border-soft-grey">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, idx) => (
                <tr key={slot} className={idx % 2 === 0 ? 'bg-background' : 'bg-white'}>
                  <td className="p-3 border border-soft-grey font-bold text-navy">
                    <FaClock className="inline mr-2" />
                    {slot}
                  </td>
                  {days.map(day => (
                    <td key={`${day}-${slot}`} className="p-3 border border-soft-grey text-center text-text-grey">
                      Free
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-center text-text-grey mt-6">No classes scheduled yet</p>
        </div>
      </div>
    </div>
  );
};

export default StudentTimetable;
