import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../constants/baseUrl";
import {
  FaBell,
  FaClipboardList,
  FaStickyNote,
  FaDownload
} from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import Cookies from "js-cookie";
import TeacherHeader from "../../components/TeacherHeader";

const TeacherSummary = () => {
  const { id: teacherId } = useParams();

  const [data, setData] = useState({
    assignments: [],
    notices: [],
    materials: [],
    attendance: []
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("assignments");

  useEffect(() => {
    fetchTeacherData();
  }, [teacherId]);

  const fetchTeacherData = async () => {
    try {
      const token = Cookies.get("token");
      const headers = { Authorization: `Bearer ${token}` };

      // If your backend is ready, uncomment:
      // const res = await axios.get(
      //   `${BASE_URL}/api/teacher/${teacherId}/summary`,
      //   { headers }
      // );
      // setData(res.data);

      // Sample Data (safe, fixed, no duplicate IDs)
      setData({
        assignments: [
          {
            _id: "a1",
            title: "Data Structures Assignment 1",
            subjectId: { subjectName: "Data Structures", subjectCode: "CSE201" },
            deadline: "2025-02-15",
            submittedCount: 2,
            totalStudents: 3,
            createdAt: "2025-01-15"
          },
          {
            _id: "a2",
            title: "Database Project",
            subjectId: { subjectName: "Database Systems", subjectCode: "CSE301" },
            deadline: "2025-03-01",
            submittedCount: 0,
            totalStudents: 3,
            createdAt: "2025-01-20"
          },
          {
            _id: "a3",
            title: "Math Assignment",
            subjectId: { subjectName: "Mathematics", subjectCode: "MTH101" },
            deadline: "2025-03-05",
            submittedCount: 0,
            totalStudents: 3,
            createdAt: "2025-01-20"
          }
        ],
        notices: [
          {
            _id: "n1",
            title: "Important Notice for B.Tech CSE",
            description:
              "All students must attend the special lecture on advanced topics.",
            courseId: { courseName: "B.Tech CSE" },
            createdAt: "2025-01-10",
            studentCount: 3
          }
        ],
        materials: [
          {
            _id: "m1",
            title: "Data Structures Notes - Chapter 1",
            subjectId: { subjectName: "Data Structures", subjectCode: "CSE201" },
            fileUrl: "https://example.com/notes.pdf",
            createdAt: "2025-01-12"
          },
          {
            _id: "m2",
            title: "Database Quick Reference",
            subjectId: { subjectName: "Database Systems", subjectCode: "CSE301" },
            fileUrl: "https://example.com/db-reference.pdf",
            createdAt: "2025-01-14"
          }
        ],
        attendance: [
          {
            _id: "att1",
            date: "2025-01-15",
            subjectId: { subjectName: "Data Structures" },
            totalStudents: 3,
            presentCount: 2,
            absentCount: 1
          },
          {
            _id: "att2",
            date: "2025-01-16",
            subjectId: { subjectName: "Database Systems" },
            totalStudents: 3,
            presentCount: 3,
            absentCount: 0
          }
        ]
      });
    } catch (err) {
      console.error("Error fetching teacher summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label, icon, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id
          ? "bg-green-500 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
      <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
        {count}
      </span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TeacherHeader currentRole="teacher" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherHeader currentRole="teacher" />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            My Activity Summary
          </h1>
          <p className="text-gray-600 mb-8">
            Track your teaching activities and student engagement
          </p>

          {/* ========================= STATS OVERVIEW ========================= */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

            <SummaryCard
              color="blue"
              value={data.assignments.length}
              title="My Assignments"
              icon={<MdAssignment className="text-blue-500 text-3xl" />}
            />

            <SummaryCard
              color="purple"
              value={data.notices.length}
              title="My Notices"
              icon={<FaBell className="text-purple-500 text-3xl" />}
            />

            <SummaryCard
              color="orange"
              value={data.materials.length}
              title="Materials Uploaded"
              icon={<FaStickyNote className="text-orange-500 text-3xl" />}
            />

            <SummaryCard
              color="green"
              value={data.attendance.length}
              title="Classes Conducted"
              icon={<FaClipboardList className="text-green-500 text-3xl" />}
            />
          </div>

          {/* ========================= NAVIGATION TABS ========================= */}
          <div className="flex flex-wrap gap-4 mb-6">
            <TabButton
              id="assignments"
              label="My Assignments"
              icon={<MdAssignment />}
              count={data.assignments.length}
            />
            <TabButton
              id="notices"
              label="My Notices"
              icon={<FaBell />}
              count={data.notices.length}
            />
            <TabButton
              id="materials"
              label="My Materials"
              icon={<FaStickyNote />}
              count={data.materials.length}
            />
            <TabButton
              id="attendance"
              label="Attendance Summary"
              icon={<FaClipboardList />}
              count={data.attendance.length}
            />
          </div>

          {/* ========================= MAIN CONTENT ========================= */}
          <div className="bg-white rounded-lg shadow-md p-6">

            {/* -------- ASSIGNMENTS TAB -------- */}
            {activeTab === "assignments" && (
              <AssignmentsTab data={data.assignments} />
            )}

            {/* -------- NOTICES TAB -------- */}
            {activeTab === "notices" && <NoticesTab data={data.notices} />}

            {/* -------- MATERIALS TAB -------- */}
            {activeTab === "materials" && <MaterialsTab data={data.materials} />}

            {/* -------- ATTENDANCE TAB -------- */}
            {activeTab === "attendance" && (
              <AttendanceTab data={data.attendance} />
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSummary;

/* =====================================================================
    REUSABLE COMPONENTS BELOW
===================================================================== */

const SummaryCard = ({ title, value, color, icon }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

/* ---------------- TAB CONTENT COMPONENTS ---------------- */

const AssignmentsTab = ({ data }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">My Assignments</h2>

    {data.length === 0 ? (
      <p className="text-gray-500 text-center py-4">No assignments yet.</p>
    ) : (
      <div className="space-y-4">
        {data.map((a) => (
          <div key={a._id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{a.title}</h3>
                <p className="text-gray-600">
                  {a.subjectId.subjectName} ({a.subjectId.subjectCode})
                </p>
                <p className="text-sm text-gray-500">
                  Due: {new Date(a.deadline).toLocaleDateString()} | Created:{" "}
                  {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  {a.submittedCount}/{a.totalStudents}
                </p>
                <p className="text-xs text-gray-500">Submitted</p>

                <button className="text-blue-500 hover:text-blue-700 text-sm mt-2">
                  View Submissions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const NoticesTab = ({ data }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">My Notices</h2>

    {data.length === 0 ? (
      <p className="text-gray-500 text-center py-4">No notices posted.</p>
    ) : (
      data.map((n) => (
        <div key={n._id} className="border rounded-lg p-4 hover:bg-gray-50">
          <h3 className="text-lg font-semibold">{n.title}</h3>
          <p className="text-gray-600 mt-1">{n.description}</p>

          <p className="text-sm text-gray-500 mt-2">
            Course: {n.courseId.courseName} | Posted:{" "}
            {new Date(n.createdAt).toLocaleDateString()}
          </p>

          <p className="text-purple-600 font-bold mt-2">
            {n.studentCount} Students Reached
          </p>
        </div>
      ))
    )}
  </div>
);

const MaterialsTab = ({ data }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">My Study Materials</h2>

    {data.length === 0 ? (
      <p className="text-gray-500 text-center py-4">No materials uploaded yet.</p>
    ) : (
      data.map((m) => (
        <div key={m._id} className="border rounded-lg p-4 hover:bg-gray-50">
          <h3 className="text-lg font-semibold">{m.title}</h3>
          <p className="text-gray-600">
            {m.subjectId.subjectName} ({m.subjectId.subjectCode})
          </p>
          <p className="text-sm text-gray-500">
            Uploaded: {new Date(m.createdAt).toLocaleDateString()}
          </p>

          <div className="mt-2 flex items-center space-x-2">
            <a
              href={m.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 hover:text-orange-700"
            >
              <FaDownload size={20} />
            </a>
          </div>
        </div>
      ))
    )}
  </div>
);

const AttendanceTab = ({ data }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4">Attendance Summary</h2>

    {data.length === 0 ? (
      <p className="text-gray-500 text-center py-4">No attendance records yet.</p>
    ) : (
      data.map((rec) => {
        const percent =
          rec.totalStudents > 0
            ? Math.round((rec.presentCount / rec.totalStudents) * 100)
            : 0;

        return (
          <div key={rec._id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {rec.subjectId.subjectName}
                </h3>
                <p className="text-gray-600">
                  Date: {new Date(rec.date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">
                    {rec.presentCount}
                  </p>
                  <p className="text-xs text-gray-500">Present</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-red-600">
                    {rec.absentCount}
                  </p>
                  <p className="text-xs text-gray-500">Absent</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{percent}%</p>
                  <p className="text-xs text-gray-500">Attendance</p>
                </div>
              </div>
            </div>
          </div>
        );
      })
    )}
  </div>
);
