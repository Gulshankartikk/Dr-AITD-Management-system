import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrophy, FaStar, FaArrowLeft, FaUserGraduate } from 'react-icons/fa';
import Card, { CardContent } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Footer from '../../components/Footer';

const StudentAchievers = () => {
  const navigate = useNavigate();

  const [achievers] = useState([
    {
      id: 1,
      name: "Aditya Kumar",
      course: "B.Tech Computer Science & Engineering",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya",
      achievements: [
        "1st Place in National College Hackathon 2024",
        "Published research paper on AI in Assistive Technologies",
        "Overall Academic CGPA: 9.8 / 10"
      ],
      badge: "Gold Medalist"
    },
    {
      id: 2,
      name: "Ankita Maurya",
      course: "B.Tech Information Technology",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ankita",
      achievements: [
        "Best Speaker Award - Inter-University Debate",
        "Lead Coordinator, Dr. AITD Technical Fest",
        "Academic CGPA: 9.5 / 10"
      ],
      badge: "Star Performer"
    },
    {
      id: 3,
      name: "Alice Johnson",
      course: "B.Tech Computer Science & Engineering",
      photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      achievements: [
        "Consistent Department Rank 1 across all semesters",
        "Full-Stack Web & Mobile App Developer",
        "Academic CGPA: 9.6 / 10"
      ],
      badge: "Academic Topper"
    }
  ]);

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col justify-between">
      <div>
        {/* Navbar for Public Page */}
        <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="flex items-center gap-2.5">
                <div className="bg-primary text-white p-2 rounded-xl shadow-xs">
                  <FaUserGraduate className="text-lg" />
                </div>
                <div>
                  <span className="text-lg font-bold text-secondary font-heading tracking-tight block leading-tight">
                    Dr. AITD Kanpur
                  </span>
                  <span className="text-[10px] text-text-muted block">Hall of Fame</span>
                </div>
              </Link>

              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => navigate(-1)}
                >
                  <FaArrowLeft size={12} /> Back
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="bg-secondary text-white py-16 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <Badge variant="warning" className="mb-4 px-4 py-1.5 text-xs uppercase tracking-wider font-bold">
              Academic Excellence & Recognition
            </Badge>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 font-heading">
              Student Hall of Fame
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Celebrating outstanding scholastic achievements, competitive programming awards, and research contributions by Dr. AITD students.
            </p>
          </div>
        </div>

        {/* Achievers Grid */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievers.map((student) => (
              <div key={student.id} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-15 group-hover:opacity-40 transition duration-300"></div>
                <Card className="relative h-full border border-gray-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <img
                        src={student.photo}
                        alt={student.name}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-gray-100"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-2 rounded-full shadow-md">
                        <FaTrophy size={14} />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-secondary mb-1 font-heading">{student.name}</h3>
                    <p className="text-xs text-primary font-semibold mb-4">{student.course}</p>

                    <Badge variant="warning" className="mb-6 px-4 py-1 text-xs font-bold">
                      {student.badge}
                    </Badge>

                    <div className="w-full text-left space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs">
                      <h4 className="font-bold text-text-muted uppercase tracking-wider mb-2">Track Record</h4>
                      {student.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-text-secondary leading-relaxed">
                          <FaStar className="text-amber-500 mt-0.5 flex-shrink-0" size={12} />
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer mode="full" />
    </div>
  );
};

export default StudentAchievers;
