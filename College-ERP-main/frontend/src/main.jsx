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
import AddSubject from "./Pages/admin/AddSubject";
import AddCourse from "./Pages/admin/AddCourse";
import CreateTeacher from "./Pages/admin/CreateTeacher";
import CreateStudent from "./Pages/admin/CreateStudent";
import AdminDashboard from "./Pages/admin/AdminDashboard";
import NotificationSummary from "./Pages/admin/NotificationSummary";
import TeacherSummary from "./Pages/Teacher/TeacherSummary";
import StudentDashboard from "./Pages/Student/StudentDashboard";
import TeacherDashboard from "./Pages/Teacher/TeacherDashboard";
import UpdatePass from "./Pages/Common/UpdatePass";
import ForgetPass from "./Pages/Common/ForgetPassword/ForgetPass";
import VerifyOtp from "./Pages/Common/ForgetPassword/VerifyOtp";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* home route */}
      <Route index element={<Login />} />
      {/* student routes */}
      <Route path="student/:id">
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="updatePassword" element={<UpdatePass />} />
        <Route path="forgetPassword" element={<ForgetPass />} />
        <Route path="forgetPassword/verifyotp" element={<VerifyOtp />} />
      </Route>
      {/* teacher routes */}
      <Route path="teacher/:id">
        <Route path="dashboard" element={<TeacherDashboard />} />
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
        <Route path="notifications" element={<NotificationSummary />} />
      </Route>
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
