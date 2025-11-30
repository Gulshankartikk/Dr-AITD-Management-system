import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../constants/api";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import BackButton from "../../components/BackButton";
import { useNavigate } from "react-router-dom";

const AddSubject = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [formData, setFormData] = useState({
    selectedCourse: "",
    subject_name: "",
    subject_code: "",
    subject_type: "Theory",
    credits: "",
    semester: "",
    branch: "",
    is_elective: false,
    teacher: ""
  });
  const selectedCourses = ["B-TECH", "M-TECH", "PHD", "DIPLOMA", "CERTIFICATE", "OTHER"];
  const branches = ["CSE", "ECE", "MECH", "CIVIL", "EEE", "IT"];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
  const subjectTypes = ["Theory", "Practical", "Lab"];
  const creditOptions = [1, 2, 3, 4, 5, 6];

  const navigate = useNavigate();
  const token = Cookies.get("token");

  useEffect(() => {
    const role = localStorage.getItem('role') || sessionStorage.getItem('role');
    setUserRole(role);

    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) {
      fetchCourses();
      fetchTeachers();
    }
  }, [token]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      }
      setCourses([]);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/teachers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeachers(response.data.teachers || []);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      if (error.response?.status === 401) {
        // Already handled by other calls or useEffect, but good to be safe
      }
      setTeachers([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    if (
      !formData.subject_name ||
      !formData.subject_code ||
      !formData.credits ||
      !formData.semester ||
      !formData.branch
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        subjectName: formData.subject_name,
        subjectCode: formData.subject_code,
        subjectType: formData.subject_type,
        credits: Number(formData.credits),
        semester: Number(formData.semester),
        branch: formData.branch,
        isElective: formData.is_elective,
        teacherId: formData.teacher || null,
        courseId: selectedCourse || null,
      };

      console.log('Submitting payload:', payload);

      await axios.post(`${BASE_URL}/api/admin/subjects`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Subject added successfully");

      setFormData({
        selectedCourse: "",
        subject_name: "",
        subject_code: "",
        subject_type: "Theory",
        credits: "",
        semester: "",
        branch: "",
        is_elective: false,
        teacher: "",
      });

      setSelectedCourse("");

    } catch (error) {
      console.error("Error adding subject:", error);
      if (error.response?.status === 403) {
        toast.error("Access denied. Only admins can add subjects.");
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.msg || error.response?.data?.message || "Failed to add subject");
      }
    }
  };

  if (userRole && userRole !== 'admin') {
    return (
      <div className="flex flex-col w-full min-h-[100vh] pb-10 items-center justify-center bg-background">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-4 text-navy">Access Denied</h2>
          <p className="text-text-grey mb-4">Only administrators can add subjects.</p>
          <p className="text-sm text-text-grey/80">Please login as admin to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-[100vh] pb-10 bg-background">
      <BackButton />

      <div className="text-white flex items-center justify-center py-11">
        <h1 className="font-extrabold text-5xl md:text-8xl text-center overflow-hidden text-navy">
          Add Subject
        </h1>
      </div>

      <div className="w-full flex justify-center px-5 lg:px-44">
        <form
          method="post"
          className="bg-white flex flex-col gap-4 justify-evenly py-10 w-full md:w-[50vw] px-10 rounded-xl shadow-xl border-t-4 border-sky-blue"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="block font-bold mb-2 text-navy">
                Subject Name *
              </label>
              <input
                type="text"
                name="subject_name"
                placeholder="e.g., Data Structures"
                className="shadow border border-soft-grey rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-sky-blue transition-colors"
                value={formData.subject_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="block font-bold mb-2 text-navy">
                Subject Code *
              </label>
              <input
                type="text"
                name="subject_code"
                placeholder="e.g., CSE201"
                className="shadow border border-soft-grey rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-sky-blue transition-colors"
                value={formData.subject_code}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="block font-bold mb-2 text-navy">
                Subject Type *
              </label>
              <select
                name="subject_type"
                className="shadow border border-soft-grey rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-sky-blue transition-colors"
                value={formData.subject_type}
                onChange={handleChange}
                required
              >
                {subjectTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="block font-bold mb-2 text-navy">
                Credits *
              </label>
              <select
                name="credits"
                className="shadow border border-soft-grey rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-sky-blue transition-colors"
                value={formData.credits}
                onChange={handleChange}
                required
              >
                <option value="">Select Credits</option>
                {creditOptions.map(credit => (
                  <option key={credit} value={credit}>{credit}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="block font-bold mb-2 text-navy">
                Semester *
              </label>
              <select
                name="semester"
                className="shadow border border-soft-grey rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-sky-blue transition-colors"
                value={formData.semester}
                onChange={handleChange}
                required
              >
                <option value="">Select Semester</option>
                {semesters.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="block font-bold mb-2 text-navy">
                Branch *
              </label>
              <select
                name="branch"
                className="shadow border border-soft-grey rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-sky-blue transition-colors"
                value={formData.branch}
                onChange={handleChange}
                required
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="block font-bold mb-2 text-navy">
                Assign Teacher (Optional)
              </label>
              <select
                name="teacher"
                className="shadow border border-soft-grey rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-sky-blue transition-colors"
                value={formData.teacher}
                onChange={handleChange}
              >
                <option value="">Select Teacher</option>
                {teachers && teachers.map(teacher => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-center mt-6 w-full">
            <button
              type="submit"
              className="w-full text-white font-bold py-3 px-4 rounded focus:outline-none transition-colors bg-navy hover:bg-navy/90"
            >
              Add Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubject;
