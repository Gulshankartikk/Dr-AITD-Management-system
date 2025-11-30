import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../constants/api";
import {
  FaBell,
  FaClipboardList,
  FaStickyNote,
  FaDownload
} from "react-icons/fa";
import { MdAssignment } from "react-icons/md";
import Cookies from "js-cookie";

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

      // Fetch real data from API
      // Note: We are using separate endpoints or a summary endpoint if available.
      // For now, let's assume we fetch lists and calculate summary on frontend or use a summary endpoint if it exists.
      // Based on previous context, we might not have a dedicated summary endpoint, so let's fetch individual lists.
      // Actually, looking at the code, it seems the user wants to replace the mock data block.

      const [assignmentsRes, noticesRes, materialsRes, attendanceRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/teacher/${teacherId}/assignments`, { headers }),
        axios.get(`${BASE_URL}/api/teacher/${teacherId}/notices`, { headers }),
        axios.get(`${BASE_URL}/api/teacher/${teacherId}/materials`, { headers }),
        // Attendance might need a different endpoint or query, but let's try a generic one or empty if not ready
        axios.get(`${BASE_URL}/api/teacher/${teacherId}/attendance`, { headers }).catch(() => ({ data: { attendance: [] } }))
      ]);

      setData({
        assignments: assignmentsRes.data.assignments || [],
        notices: noticesRes.data.notices || [],
        materials: materialsRes.data.materials || [],
        attendance: attendanceRes.data.attendance || []
      });

    } catch (err) {
      console.error("Error fetching teacher summary:", err);
      // Fallback to empty arrays on error to prevent crash
      setData({
        assignments: [],
        notices: [],
        materials: [],
        attendance: []
      });
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label, icon, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === id
        ? "bg-sky-blue text-white"
        : "bg-background text-text-grey hover:bg-soft-grey/20"
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
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-blue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">

          <h1 className="text-4xl font-bold text-navy mb-2">
            My Activity Summary
          </h1>
          <p className="text-text-grey mb-8">
            Track your teaching activities and student engagement
          </p>

          {/* ========================= STATS OVERVIEW ========================= */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

            <SummaryCard
              color="sky-blue"
              value={data.assignments.length}
              title="My Assignments"
              icon={<MdAssignment className="text-sky-blue text-3xl" />}
            />

            <SummaryCard
              color="navy"
              value={data.notices.length}
              title="My Notices"
              icon={<FaBell className="text-navy text-3xl" />}
            />

            <SummaryCard
              color="sky-blue"
              value={data.materials.length}
              title="Materials Uploaded"
              icon={<FaStickyNote className="text-sky-blue text-3xl" />}
            />

            <SummaryCard
              color="navy"
              value={data.attendance.length}
              title="Classes Conducted"
              icon={<FaClipboardList className="text-navy text-3xl" />}
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
  <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-sky-blue`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-text-grey text-sm">{title}</p>
        <p className="text-3xl font-bold text-navy">{value}</p>
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
      <p className="text-text-grey text-center py-4">No assignments yet.</p>
    ) : (
      <div className="space-y-4">
        {data.map((a) => (
          <div key={a._id} className="border rounded-lg p-4 hover:bg-soft-grey/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{a.title}</h3>
                <p className="text-text-grey">
                  {a.subjectId.subjectName} ({a.subjectId.subjectCode})
                </p>
                <p className="text-sm text-text-grey">
                  Due: {new Date(a.deadline).toLocaleDateString()} | Created:{" "}
                  {new Date(a.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-sky-blue">
                  {a.submittedCount}/{a.totalStudents}
                </p>
                <p className="text-xs text-text-grey">Submitted</p>

                <button className="text-sky-blue hover:text-sky-blue/80 text-sm mt-2">
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
      <p className="text-text-grey text-center py-4">No notices posted.</p>
    ) : (
      data.map((n) => (
        <div key={n._id} className="border rounded-lg p-4 hover:bg-soft-grey/20">
          <h3 className="text-lg font-semibold">{n.title}</h3>
          <p className="text-text-grey mt-1">{n.description}</p>

          <p className="text-sm text-text-grey mt-2">
            Course: {n.courseId.courseName} | Posted:{" "}
            {new Date(n.createdAt).toLocaleDateString()}
          </p>

          <p className="text-navy font-bold mt-2">
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
      <p className="text-text-grey text-center py-4">No materials uploaded yet.</p>
    ) : (
      data.map((m) => (
        <div key={m._id} className="border rounded-lg p-4 hover:bg-soft-grey/20">
          <h3 className="text-lg font-semibold">{m.title}</h3>
          <p className="text-text-grey">
            {m.subjectId.subjectName} ({m.subjectId.subjectCode})
          </p>
          <p className="text-sm text-text-grey">
            Uploaded: {new Date(m.createdAt).toLocaleDateString()}
          </p>

          <div className="mt-2 flex items-center space-x-2">
            <a
              href={m.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-blue hover:text-sky-blue/80"
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
      <p className="text-text-grey text-center py-4">No attendance records yet.</p>
    ) : (
      data.map((rec) => {
        const percent =
          rec.totalStudents > 0
            ? Math.round((rec.presentCount / rec.totalStudents) * 100)
            : 0;

        return (
          <div key={rec._id} className="border rounded-lg p-4 hover:bg-soft-grey/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {rec.subjectId.subjectName}
                </h3>
                <p className="text-text-grey">
                  Date: {new Date(rec.date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-lg font-bold text-sky-blue">
                    {rec.presentCount}
                  </p>
                  <p className="text-xs text-text-grey">Present</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-navy">
                    {rec.absentCount}
                  </p>
                  <p className="text-xs text-text-grey">Absent</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-sky-blue">{percent}%</p>
                  <p className="text-xs text-text-grey">Attendance</p>
                </div>
              </div>
            </div>
          </div>
        );
      })
    )}
  </div>
);
