import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import Cookies from 'js-cookie';
import { FaChartBar, FaFilter, FaTrophy } from 'react-icons/fa';
import Card, { CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Table, { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Select from '../../components/ui/Select';

const StudentMarks = () => {
    const { studentId } = useParams();
    const [marks, setMarks] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        subjectId: '',
        examType: ''
    });

    const examTypes = ['Mid Term', 'Final', 'Quiz', 'Assignment', 'Project'];

    useEffect(() => {
        fetchSubjects();
        fetchMarks();
    }, [studentId]);

    useEffect(() => {
        fetchMarks();
    }, [filters]);

    const fetchSubjects = async () => {
        try {
            const token = Cookies.get('token');
            const response = await axios.get(`${BASE_URL}/api/student/${studentId}/subjects`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSubjects(response.data.subjects || []);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    const fetchMarks = async () => {
        setLoading(true);
        try {
            const token = Cookies.get('token');
            const params = {};
            if (filters.subjectId) params.subjectId = filters.subjectId;
            if (filters.examType) params.examType = filters.examType;

            const response = await axios.get(`${BASE_URL}/api/student/${studentId}/marks`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setMarks(response.data.marks || []);
        } catch (error) {
            console.error('Error fetching marks:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculatePercentage = (obtained, total) => {
        return total > 0 ? ((obtained / total) * 100).toFixed(2) : '0.00';
    };

    const getGrade = (percentage) => {
        const p = parseFloat(percentage);
        if (p >= 90) return { grade: 'A+', color: 'success' };
        if (p >= 80) return { grade: 'A', color: 'success' };
        if (p >= 70) return { grade: 'B', color: 'primary' };
        if (p >= 60) return { grade: 'C', color: 'warning' };
        if (p >= 50) return { grade: 'D', color: 'warning' };
        return { grade: 'F', color: 'danger' };
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
                    <p className="text-gray-500">View your academic performance and grades</p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-1/3">
                            <Select
                                label="Filter by Subject"
                                value={filters.subjectId}
                                onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}
                            >
                                <option value="">All Subjects</option>
                                {subjects.map(sub => (
                                    <option key={sub._id} value={sub._id}>{sub.subjectName}</option>
                                ))}
                            </Select>
                        </div>
                        <div className="w-full md:w-1/3">
                            <Select
                                label="Filter by Exam Type"
                                value={filters.examType}
                                onChange={(e) => setFilters({ ...filters, examType: e.target.value })}
                            >
                                <option value="">All Exams</option>
                                {examTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Marks Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FaTrophy className="text-yellow-500" />
                        Performance Report
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <tr>
                                <TableHead>Subject</TableHead>
                                <TableHead>Exam Type</TableHead>
                                <TableHead>Marks Obtained</TableHead>
                                <TableHead>Total Marks</TableHead>
                                <TableHead>Percentage</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Date</TableHead>
                            </tr>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan="7" className="text-center py-8">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : marks.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan="7" className="text-center py-8 text-gray-500">
                                        No marks records found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                marks.map((record) => {
                                    const percentage = calculatePercentage(record.marks, record.totalMarks);
                                    const { grade, color } = getGrade(percentage);
                                    return (
                                        <TableRow key={record._id}>
                                            <TableCell className="font-medium text-gray-900">
                                                {record.subjectId?.subjectName || 'Unknown Subject'}
                                                <div className="text-xs text-gray-500">{record.subjectId?.subjectCode}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="info">{record.examType}</Badge>
                                            </TableCell>
                                            <TableCell className="font-bold text-gray-900">{record.marks}</TableCell>
                                            <TableCell className="text-gray-600">{record.totalMarks}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className={`h-1.5 rounded-full ${parseFloat(percentage) >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm font-medium">{percentage}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={color}>{grade}</Badge>
                                            </TableCell>
                                            <TableCell className="text-gray-500 text-sm">
                                                {new Date(record.createdAt).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentMarks;
