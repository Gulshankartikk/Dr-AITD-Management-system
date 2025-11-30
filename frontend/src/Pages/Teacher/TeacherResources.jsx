import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BASE_URL } from '../../constants/api';
import TeacherHeader from '../../components/TeacherHeader';
import BackButton from '../../components/BackButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaPlus, FaFileAlt, FaVideo, FaBook, FaLink, FaTrash, FaDownload, FaEye } from 'react-icons/fa';
import Card, { CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import { toast } from 'react-toastify';

const RESOURCE_TYPES = [
    { value: 'lecture_note', label: 'Lecture Note', icon: FaFileAlt },
    { value: 'video', label: 'Video / Recording', icon: FaVideo },
    { value: 'syllabus', label: 'Syllabus', icon: FaBook },
    { value: 'reference_book', label: 'Reference Book', icon: FaBook },
    { value: 'paper', label: 'Question Paper', icon: FaFileAlt },
    { value: 'other', label: 'Other', icon: FaLink },
];

const TeacherResources = () => {
    const { id: teacherId } = useParams();
    const [resources, setResources] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Filter State
    const [filterSubject, setFilterSubject] = useState('');
    const [filterType, setFilterType] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        subjectId: '',
        title: '',
        description: '',
        type: 'lecture_note',
        links: '', // JSON string or comma separated for simplicity in this version
        tags: '',
        isPublished: true
    });
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchData();
    }, [teacherId]);

    const fetchData = async () => {
        try {
            const token = Cookies.get('token');
            const [resourcesRes, dashboardRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/teacher/${teacherId}/resources`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${BASE_URL}/api/teacher/${teacherId}/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            setResources(resourcesRes.data.resources || []);
            setSubjects(dashboardRes.data.teacher?.assignedSubjects || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load resources');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = Cookies.get('token');
            const data = new FormData();
            data.append('subjectId', formData.subjectId);
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('type', formData.type);
            data.append('tags', formData.tags);
            data.append('isPublished', formData.isPublished);

            if (file) {
                data.append('file', file);
            }

            await axios.post(
                `${BASE_URL}/api/teacher/${teacherId}/resources`,
                data,
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
            );

            toast.success('Resource added successfully!');
            setShowModal(false);
            setFormData({
                subjectId: '',
                title: '',
                description: '',
                type: 'lecture_note',
                links: '',
                tags: '',
                isPublished: true
            });
            setFile(null);
            fetchData();
        } catch (error) {
            console.error('Error adding resource:', error);
            toast.error(error.response?.data?.msg || 'Failed to add resource');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (resourceId) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) return;

        try {
            const token = Cookies.get('token');
            await axios.delete(`${BASE_URL}/api/teacher/${teacherId}/resources/${resourceId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Resource deleted');
            fetchData();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete resource');
        }
    };

    const filteredResources = resources.filter(r => {
        const matchSubject = filterSubject ? r.subjectId?._id === filterSubject : true;
        const matchType = filterType ? r.type === filterType : true;
        return matchSubject && matchType;
    });

    const getTypeIcon = (type) => {
        const found = RESOURCE_TYPES.find(t => t.value === type);
        const Icon = found ? found.icon : FaFileAlt;
        return <Icon />;
    };

    const getTypeLabel = (type) => {
        const found = RESOURCE_TYPES.find(t => t.value === type);
        return found ? found.label : type;
    };

    if (loading) return <LoadingSpinner message="Loading resources..." />;

    return (
        <div className="min-h-screen bg-background">
            <TeacherHeader currentRole="teacher" />
            <div className="p-6 max-w-7xl mx-auto">
                <BackButton className="mb-6" />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-navy">Learning Resources</h1>
                        <p className="text-text-grey mt-1">Manage notes, videos, syllabus, and more</p>
                    </div>
                    <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
                        <FaPlus /> Add Resource
                    </Button>
                </div>

                {/* Filters */}
                <Card className="mb-8">
                    <CardContent className="p-4 flex flex-col md:flex-row gap-4">
                        <Select
                            label="Filter by Subject"
                            value={filterSubject}
                            onChange={(e) => setFilterSubject(e.target.value)}
                        >
                            <option value="">All Subjects</option>
                            {subjects.map(sub => (
                                <option key={sub._id} value={sub._id}>{sub.subjectName} ({sub.subjectCode})</option>
                            ))}
                        </Select>
                        <Select
                            label="Filter by Type"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            {RESOURCE_TYPES.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </Select>
                    </CardContent>
                </Card>

                {/* Resource Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResources.map(resource => (
                        <Card key={resource._id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${resource.type === 'video' ? 'bg-navy/10 text-navy' :
                                        resource.type === 'syllabus' ? 'bg-sky-blue/10 text-sky-blue' :
                                            'bg-sky-blue/10 text-sky-blue'
                                        }`}>
                                        {getTypeIcon(resource.type)}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDelete(resource._id)}
                                            className="text-soft-grey hover:text-red-500 transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-navy mb-2 line-clamp-1">{resource.title}</h3>
                                <p className="text-sm text-text-grey mb-4 line-clamp-2">{resource.description}</p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="outline">{resource.subjectId?.subjectName}</Badge>
                                    <Badge variant="secondary">{getTypeLabel(resource.type)}</Badge>
                                </div>

                                <div className="pt-4 border-t border-soft-grey flex justify-between items-center">
                                    <span className="text-xs text-text-grey/70">
                                        {new Date(resource.createdAt).toLocaleDateString()}
                                    </span>
                                    {resource.files && resource.files.length > 0 && (
                                        <a
                                            href={resource.files[0].url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sky-blue hover:text-sky-blue/80 text-sm font-semibold flex items-center gap-1"
                                        >
                                            <FaDownload size={12} /> Download
                                        </a>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredResources.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-soft-grey">
                        <p className="text-text-grey">No resources found matching your filters</p>
                    </div>
                )}
            </div>

            {/* Add Resource Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-soft-grey">
                            <h2 className="text-xl font-bold text-navy">Add New Resource</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <Select
                                label="Subject"
                                value={formData.subjectId}
                                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                                required
                            >
                                <option value="">Select Subject</option>
                                {subjects.map(sub => (
                                    <option key={sub._id} value={sub._id}>{sub.subjectName}</option>
                                ))}
                            </Select>

                            <Select
                                label="Resource Type"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                required
                            >
                                {RESOURCE_TYPES.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </Select>

                            <Input
                                label="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="e.g., Chapter 1 Notes"
                            />

                            <div>
                                <label className="block text-sm font-medium text-text-grey mb-1">Description</label>
                                <textarea
                                    className="w-full px-4 py-2 rounded-lg border border-soft-grey focus:ring-2 focus:ring-sky-blue outline-none"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <Input
                                label="Tags (comma separated)"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="e.g., important, exam, week1"
                            />

                            <div>
                                <label className="block text-sm font-medium text-text-grey mb-1">Upload File</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-text-grey file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-blue/10 file:text-sky-blue hover:file:bg-sky-blue/20"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button type="submit" isLoading={submitting} className="flex-1">
                                    Upload Resource
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherResources;
