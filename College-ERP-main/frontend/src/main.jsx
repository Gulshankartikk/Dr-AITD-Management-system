import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Provider } from "react-redux";
import Store from "./app/Store";
import Layout from "./Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from "./Pages/Common/Login";
import Attendance from "./Pages/Student/Attendance";
import Courses from "./Pages/Teacher/Courses";
import AdminPanel from "./Pages/admin/AdminPanel";
import Unauth from "./Pages/admin/Unauth";
import AddStudent from "./Pages/admin/AddStudent";
import AddTeacher from "./Pages/admin/AddTeacher";
import AddSubject from "./Pages/admin/AddSubject";
import AddCourse from "./Pages/admin/AddCourse";
import AssignTeacher from "./Pages/admin/AssignTeacher";
import DeleteTeacherFromCourse from "./Pages/admin/DeleteTeacherFromCourse";
import RemoveStudentFormCourse from "./Pages/admin/RemoveStudentFormCourse";
import DeleteCourse from "./Pages/admin/DeleteCourse";
import DeleteTeacher from "./Pages/admin/DeleteTeacher";
import DeleteStudent from "./Pages/admin/DeleteStudent";
import CreateTeacher from "./Pages/admin/CreateTeacher";
import CreateStudent from "./Pages/admin/CreateStudent";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import AdminAttendanceReport from "./Pages/admin/AttendanceReport";
import AdminManagement from "./Pages/admin/AdminManagement";

import SimpleDashboard from "./Pages/Student/SimpleDashboard";
import StudentDetails from "./Pages/Student/StudentDetails";
import UpdateStudentdDetails from "./Pages/Student/UpdateStudentdDetails";
import UpdatePass from "./Pages/Common/UpdatePass";
import Subjects from "./Pages/Teacher/Subjects";
import MarkAttendance from "./Pages/Teacher/MarkAttendance";
import TeacherDetails from "./Pages/Teacher/TeacherDetails";
import AttendanceReport from "./Pages/Teacher/AttendanceReport";
import MarksManagement from "./Pages/Teacher/MarksManagement";
import StudentNotes from "./Pages/Teacher/StudentNotes";
import NoticesManagement from "./Pages/Teacher/NoticesManagement";
import StudyMaterials from "./Pages/Teacher/StudyMaterials";
import Communication from "./Pages/Teacher/Communication";
import StudentManagement from "./Pages/Teacher/StudentManagement";
import StudentDetailsView from "./Pages/Teacher/StudentDetailsView";
import AssignmentManagement from "./Pages/Teacher/AssignmentManagement";
import CoursesList from "./Pages/Teacher/CoursesList";
import SimpleTeacherDashboard from "./Pages/Teacher/SimpleTeacherDashboard";
import ForgetPass from "./Pages/Common/ForgetPassword/ForgetPass";
import VerifyOtp from "./Pages/Common/ForgetPassword/VerifyOtp";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* home route */}
      <Route index element={<Login />} />
      {/* student routes */}
      <Route path="student/:id">
        <Route path="dashboard" element={<SimpleDashboard />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="details" element={<StudentDetails />} />
        <Route path="updateDetails" element={<UpdateStudentdDetails />} />
        <Route path="updatePassword" element={<UpdatePass />} />
        <Route path="forgetPassword" element={<ForgetPass />} />
        <Route path="forgetPassword/verifyotp" element={<VerifyOtp />} />
      </Route>
      {/* teacher routes */}
      <Route path="teacher/:id">
        <Route path="dashboard" element={<SimpleTeacherDashboard />} />
        <Route path="courses-list" element={<CoursesList />} />
        <Route path="courses" element={<Courses />} />
        <Route
          path="courses/course/:courseId/subjects"
          element={<Subjects />}
        />
        <Route
          path="courses/course/:courseId/subjects/subject/:subId/markAttendance"
          element={<MarkAttendance />}
        />
        <Route path="attendance-report" element={<AttendanceReport />} />
        <Route path="marks" element={<MarksManagement />} />
        <Route path="student-notes" element={<StudentNotes />} />
        <Route path="notices" element={<NoticesManagement />} />
        <Route path="materials" element={<StudyMaterials />} />
        <Route path="communication" element={<Communication />} />
        <Route path="student-management" element={<StudentManagement />} />
        <Route path="student-details/:studentId" element={<StudentDetailsView />} />
        <Route path="assignments" element={<AssignmentManagement />} />
        <Route path="details" element={<TeacherDetails />} />
        <Route path="updatePassword" element={<UpdatePass />} />
        <Route path="forgetPassword" element={<ForgetPass />} />
        <Route path="forgetPassword/verifyotp" element={<VerifyOtp />} />
      </Route>
      {/* admin routes */}
      <Route path="admin">
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="create-teacher" element={<CreateTeacher />} />
        <Route path="create-student" element={<CreateStudent />} />
        <Route path="adminPanel" element={<AdminPanel />} />
        <Route path="adminPanel/addStudent" element={<AddStudent />} />
        <Route path="adminPanel/addTeacher" element={<AddTeacher />} />
        <Route path="adminPanel/addSubject" element={<AddSubject />} />
        <Route path="adminPanel/addCourse" element={<AddCourse />} />
        <Route path="adminPanel/assignTeacher" element={<AssignTeacher />} />
        <Route
          path="adminPanel/removeTeacherFromCourse"
          element={<DeleteTeacherFromCourse />}
        />
        <Route
          path="adminPanel/removeStudentFromCourse"
          element={<RemoveStudentFormCourse />}
        />
        <Route path="adminPanel/deleteCourse" element={<DeleteCourse />} />
        <Route path="adminPanel/deleteTeacher" element={<DeleteTeacher />} />
        <Route path="adminPanel/deleteStudent" element={<DeleteStudent />} />
        <Route path="adminPanel/attendanceReport" element={<AdminAttendanceReport />} />
        <Route path="management" element={<AdminManagement />} />
      </Route>
      {/* unauthorized */}
      <Route path="/unauthorized" element={<Unauth />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <Provider store={Store}>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        bodyClassName="toastBody"
      />
    </Provider>
  </ErrorBoundary>
);
