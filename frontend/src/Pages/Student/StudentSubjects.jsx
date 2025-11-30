import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../constants/api';
import { FaBook, FaChalkboardTeacher, FaFileAlt, FaClipboardList, FaArrowRight } from 'react-icons/fa';
import Cookies from 'js-cookie';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const StudentSubjects = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const token = Cookies.get('token');
                const response = await axios.get(`${BASE_URL}/api/student/${studentId}/subjects`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.success) {
                    setSubjects(response.data.subjects);
                }
            } catch (error) {
                console.error('Error fetching subjects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, [studentId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-navy">My Subjects</h1>
                    <p className="text-text-grey">View and manage your enrolled subjects</p>
                </div>
            </div>

            {subjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject) => (
                        <Card key={subject._id} className="hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-sky-blue">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="p-3 bg-sky-blue/10 rounded-lg text-sky-blue">
                                        <FaBook size={24} />
                                    </div>
                                    <Badge variant="primary">{subject.subjectCode}</Badge>
                                </div>
                                <CardTitle className="mt-4 text-xl">{subject.subjectName}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 text-sm text-text-grey">
                                    <div className="flex items-center gap-2">
                                        <FaChalkboardTeacher className="text-text-grey" />
                                        <span>Sessions: {subject.sessions || 'N/A'}</span>
                                    </div>
                                    {/* Add more subject details here if available */}
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col gap-2 pt-4 border-t border-soft-grey">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between text-text-grey hover:text-sky-blue hover:bg-sky-blue/10"
                                    onClick={() => navigate(`/student/${studentId}/materials?subjectId=${subject._id}`)}
                                >
                                    <span className="flex items-center gap-2"><FaFileAlt /> Study Materials</span>
                                    <FaArrowRight size={12} />
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between text-text-grey hover:text-sky-blue hover:bg-sky-blue/10"
                                    onClick={() => navigate(`/student/${studentId}/assignments?subjectId=${subject._id}`)}
                                >
                                    <span className="flex items-center gap-2"><FaClipboardList /> Assignments</span>
                                    <FaArrowRight size={12} />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-soft-grey">
                    <div className="bg-soft-grey/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center text-soft-grey">
                        <FaBook size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-navy">No Subjects Found</h3>
                    <p className="text-text-grey mt-2">You haven't been enrolled in any subjects yet.</p>
                </div>
            )}
        </div>
    );
};

export default StudentSubjects;
