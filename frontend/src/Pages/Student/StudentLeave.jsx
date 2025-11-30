import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import StudentHeader from '../../components/StudentHeader';
import BackButton from '../../components/BackButton';
import { FaPlus, FaCalendarAlt } from 'react-icons/fa';

const StudentLeave = () => {
  const { studentId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const leaveTypes = ['Sick Leave', 'Casual Leave', 'Emergency Leave', 'Family Function'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('Leave request submitted successfully!');
    setShowModal(false);
    setFormData({ leaveType: 'Sick Leave', startDate: '', endDate: '', reason: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader currentRole="student" />
      <div className="p-6">
        <BackButton className="mb-4" />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-navy">Leave Requests</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 rounded-lg text-white font-bold flex items-center gap-2 bg-sky-blue hover:bg-sky-blue/90 transition-colors"
          >
            <FaPlus /> Request Leave
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-12 text-center">
          <p className="text-gray-500 text-lg">No leave requests yet</p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-navy/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-navy">Request Leave</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-navy">Leave Type</label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                  className="w-full p-3 border border-soft-grey rounded-lg focus:border-sky-blue focus:outline-none"
                  required
                >
                  {leaveTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-navy">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full p-3 border border-soft-grey rounded-lg focus:border-sky-blue focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-navy">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full p-3 border border-soft-grey rounded-lg focus:border-sky-blue focus:outline-none"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-navy">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full p-3 border border-soft-grey rounded-lg focus:border-sky-blue focus:outline-none"
                  rows="3"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-lg text-white font-bold bg-navy hover:bg-navy/90 transition-colors"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg border-2 border-navy text-navy font-bold hover:bg-navy/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentLeave;
