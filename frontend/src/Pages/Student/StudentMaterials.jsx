import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import Cookies from 'js-cookie';
import { FaDownload, FaEye, FaUser, FaClock, FaBook } from 'react-icons/fa';
import { toast } from 'react-toastify';
import StudentHeader from '../../components/StudentHeader';
import BackButton from '../../components/BackButton';

const StudentMaterials = () => {
  const { studentId } = useParams();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    fetchMaterials();
  }, [studentId]);

  const fetchMaterials = async () => {
    try {
      const token = Cookies.get('token');
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`${BASE_URL}/api/student/${studentId}/materials`, { headers });
      setMaterials(response.data.materials || []);
      setStudentName(response.data.student?.name || '');
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Failed to load study materials');
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
            <FaBook className="text-3xl text-sky-blue" />
            <h1 className="text-3xl font-bold text-navy">Study Materials</h1>
          </div>

          {materials.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <FaBook className="mx-auto text-6xl text-soft-grey mb-4" />
              <p className="text-text-grey text-lg">No study materials available yet.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {materials.map((material) => (
                <div key={material._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-sky-blue">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-navy mb-2">{material.title}</h3>
                      <p className="text-sky-blue font-medium mb-2">{material.subjectId?.subjectName}</p>
                      {material.description && (
                        <p className="text-text-grey mb-4">{material.description}</p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-text-grey">
                        <div className="flex items-center space-x-1">
                          <FaUser />
                          <span>By: {material.teacherId?.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaClock />
                          <span>Updated: {new Date(material.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {material.fileUrl && (
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => window.open(material.fileUrl, '_blank')}
                          className="flex items-center space-x-1 px-4 py-2 bg-sky-blue text-white rounded-lg hover:bg-sky-blue/90 transition-colors"
                          title="View Material"
                        >
                          <FaEye />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownload(material.fileUrl, `${material.title}.pdf`)}
                          className="flex items-center space-x-1 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
                          title="Download Material"
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

export default StudentMaterials;
