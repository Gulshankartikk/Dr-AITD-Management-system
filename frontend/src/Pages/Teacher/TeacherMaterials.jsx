import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../constants/api';
import { FaPlus, FaFileAlt, FaDownload } from 'react-icons/fa';
import Card, { CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/LoadingSpinner';

const TeacherMaterials = () => {
  const { id: teacherId } = useParams();
  const [materials, setMaterials] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filterSubject, setFilterSubject] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    subjectId: '',
    title: '',
    description: '',
    fileUrl: ''
  });

  useEffect(() => {
    fetchData();
  }, [teacherId]);

  const fetchData = async () => {
    try {
      const token = Cookies.get('token');
      const [materialsRes, dashboardRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/teacher/${teacherId}/materials`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BASE_URL}/api/teacher/${teacherId}/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      const materialsData = materialsRes.data.materials || [];
      setAllMaterials(materialsData);
      setMaterials(materialsData);
      setSubjects(dashboardRes.data.teacher?.assignedSubjects || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterSubject && filterSubject !== 'all') {
      setMaterials(allMaterials.filter(m => m.subjectId?._id === filterSubject));
    } else {
      setMaterials(allMaterials);
    }
  }, [filterSubject, allMaterials]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      await axios.post(
        `${BASE_URL}/api/teacher/${teacherId}/materials`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Study material uploaded successfully!');
      setShowModal(false);
      setFormData({ subjectId: '', title: '', description: '', fileUrl: '' });
      fetchData();
    } catch (error) {
      console.error('Error uploading material:', error);
      alert('Failed to upload material');
    }
  };

  if (loading) return <LoadingSpinner message="Loading materials..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Study Materials</h1>
          <p className="text-text-grey">Manage and share course materials</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <FaPlus className="mr-2" /> Upload Material
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="max-w-md">
            <Select
              label="Filter by Subject"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.subjectName} ({subject.subjectCode})
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map(material => (
          <Card key={material._id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-sky-blue/10 rounded-lg">
                  <FaFileAlt className="text-sky-blue text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-navy mb-1">{material.title}</h3>
                  <p className="text-sm text-sky-blue font-medium mb-2">
                    {material.subjectId?.subjectName}
                  </p>
                  <p className="text-text-grey text-sm mb-4 line-clamp-2">{material.description}</p>

                  {material.fileUrl && (
                    <a
                      href={material.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-sky-blue hover:text-sky-blue/80"
                    >
                      <FaDownload className="mr-2" /> Download Resource
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {materials.length === 0 && (
        <div className="text-center py-12 bg-background rounded-xl border-2 border-dashed border-soft-grey">
          <FaFileAlt className="mx-auto h-12 w-12 text-soft-grey mb-4" />
          <p className="text-text-grey text-lg">No study materials found</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Upload Study Material</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Subject"
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                required
              >
                <option value="">-- Select Subject --</option>
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subjectName} ({subject.subjectCode})
                  </option>
                ))}
              </Select>

              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-navy mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-soft-grey rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-sky-blue outline-none transition-all"
                  rows="3"
                />
              </div>

              <Input
                label="File URL"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                placeholder="https://example.com/file.pdf"
                required
              />

              <div className="flex gap-3 mt-6">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Upload
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherMaterials;
