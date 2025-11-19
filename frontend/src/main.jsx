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
import Register from "./Pages/Common/Register";
import TeacherRegister from "./Pages/Common/TeacherRegister";
import AdminRegister from "./Pages/Common/AdminRegister";
import StudentManagement from "./Pages/admin/StudentManagement";
import AddSubject from "./Pages/admin/AddSubject";
import AddCourse from "./Pages/admin/AddCourse";
import CreateTeacher from "./Pages/admin/CreateTeacher";
import CreateStudent from "./Pages/admin/CreateStudent";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import NotificationSummary from "./Pages/admin/NotificationSummary";
import TeacherSummary from "./Pages/Teacher/TeacherSummary";
import StudentDashboard from "./Pages/Student/StudentDashboard";
import StudentNotes from "./Pages/Student/StudentNotes";
import StudentMaterials from "./Pages/Student/StudentMaterials";
import StudentAssignments from "./Pages/Student/StudentAssignments";
import StudentAttendance from "./Pages/Student/StudentAttendance";
import TeacherDashboard from "./Pages/Teacher/TeacherDashboard";
import StudentList from "./Pages/Teacher/StudentList";
import StudentProfile from "./Pages/Student/StudentProfile";
import TeacherProfile from "./Pages/Teacher/TeacherProfile";
import UpdatePass from "./Pages/Common/UpdatePass";
import ForgetPass from "./Pages/Common/ForgetPassword/ForgetPass";
import VerifyOtp from "./Pages/Common/ForgetPassword/VerifyOtp";
import NotFound from "./Pages/Common/NotFound";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* home route */}
      <Route index element={<Login />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="teacher-register" element={<TeacherRegister />} />
      {/* student routes */}
      <Route path="student/:studentId">
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="notes" element={<StudentNotes />} />
        <Route path="materials" element={<StudentMaterials />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="updatePassword" element={<UpdatePass />} />
        <Route path="forgetPassword" element={<ForgetPass />} />
        <Route path="forgetPassword/verifyotp" element={<VerifyOtp />} />
      </Route>
      {/* teacher routes */}
      <Route path="teacher/:id">
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="students" element={<StudentList />} />
        <Route path="summary" element={<TeacherSummary />} />
        <Route path="updatePassword" element={<UpdatePass />} />
        <Route path="forgetPassword" element={<ForgetPass />} />
        <Route path="forgetPassword/verifyotp" element={<VerifyOtp />} />
      </Route>
      {/* admin routes */}
      <Route path="admin">
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="add-course" element={<AddCourse />} />
        <Route path="create-teacher" element={<CreateTeacher />} />
        <Route path="create-student" element={<CreateStudent />} />
        <Route path="add-subject" element={<AddSubject />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="notifications" element={<NotificationSummary />} />
      </Route>
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
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
