import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import Cookies from 'js-cookie';
import { FaDownload, FaEye, FaUser, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import StudentHeader from '../../components/StudentHeader';
import BackButton from '../../components/BackButton';

const StudentNotes = () => {
  const { studentId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [studentId]);

  const fetchNotes = async () => {
    try {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`${BASE_URL}/api/student/${studentId}/notes`, { headers });
      setNotes(response.data.notes || []);
      setStudentName(response.data.student?.name || '');
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <StudentHeader studentId={studentId} studentName={studentName} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader studentId={studentId} studentName={studentName} />
      <BackButton />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Notes</h1>

          {notes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">No notes available yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {notes.map((note) => (
                <div key={note._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{note.title}</h3>
                      <p className="text-gray-600 mb-3">{note.subjectId?.subjectName}</p>
                      {note.description && (
                        <p className="text-gray-700 mb-4">{note.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <FaUser />
                          <span>By: {note.teacherId?.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaClock />
                          <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {note.fileUrl && (
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => window.open(note.fileUrl, '_blank')}
                          className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          title="View"
                        >
                          <FaEye />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownload(note.fileUrl, `${note.title}.pdf`)}
                          className="flex items-center space-x-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          title="Download"
                        >
                          <FaDownload />
                          <span>Download</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentNotes;
