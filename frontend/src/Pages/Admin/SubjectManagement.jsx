import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBook, FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import BackButton from '../../components/BackButton';
import Button from '../../components/ui/Button';
import adminService from '../../services/adminService';

const SubjectManagement = () => {
    const [subjects, setSubjects] = useState([]);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        try {
            const res = await adminService.getSubjects();
            if (res.success) {
                setSubjects(res.subjects);
            }
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <AdminHeader />
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <BackButton className="mb-4" />
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-secondary font-heading">Subject Management</h1>
                            <p className="text-text-secondary">Manage all subjects and curriculum</p>
                        </div>
                        <Link to="/admin/add-subject">
                            <Button className="flex items-center space-x-2">
                                <FaPlus />
                                <span>Add Subject</span>
                            </Button>
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Subject Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Credits</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Semester</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {subjects.map((subject) => (
                                        <tr key={subject._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <FaBook className="text-primary mr-3" />
                                                    <span className="font-medium text-secondary">{subject.subjectName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-secondary">{subject.subjectCode}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-secondary">{subject.subjectType}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-secondary">{subject.credits}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-secondary">{subject.semester}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                <button className="text-primary hover:text-primary/80"><FaEye /></button>
                                                <button className="text-primary hover:text-primary/80"><FaEdit /></button>
                                                <button className="text-danger hover:text-red-700"><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {subjects.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-text-secondary">
                                                No subjects found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubjectManagement;
