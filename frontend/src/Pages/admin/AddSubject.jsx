import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../services/api";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import BackButton from "../../components/BackButton";

const AddSubject = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
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

  const token = Cookies.get("token");

  useEffect(() => {
    fetchCourses();
    fetchTeachers();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
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
      toast.error(error.response?.data?.message || "Failed to add subject");
    }
  };

  return (
    <div className="flex flex-col w-full min-h-[100vh] pb-10" style={{ background: 'linear-gradient(135deg, #2d545e 0%, #12343b 100%)' }}>
      <BackButton />

      <div className="text-white flex items-center justify-center py-11">
        <h1 className="font-extrabold text-5xl md:text-8xl text-center overflow-hidden" style={{ color: '#c89666' }}>
          Add Subject
        </h1>
      </div>

      <div className="w-full flex justify-center px-5 lg:px-44">
        <form
          method="post"
          className="bg-white flex flex-col gap-4 justify-evenly py-10 w-full md:w-[50vw] px-10 rounded-xl shadow-xl"
          style={{ borderTop: '4px solid #c89666' }}
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="block font-bold mb-2" style={{ color: '#2d545e' }}>
                Subject Name *
              </label>
              <input
                type="text"
                name="subject_name"
                placeholder="e.g., Data Structures"
                className="shadow border rounded w-full py-2 px-3 leading-tight focus:outline-none"
                style={{ borderColor: '#c89666' }}
                onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                onBlur={(e) => e.target.style.borderColor = '#c89666'}
                value={formData.subject_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="block font-bold mb-2" style={{ color: '#2d545e' }}>
                Subject Code *
              </label>
              <input
                type="text"
                name="subject_code"
                placeholder="e.g., CSE201"
                className="shadow border rounded w-full py-2 px-3 leading-tight focus:outline-none"
                style={{ borderColor: '#c89666' }}
                onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                onBlur={(e) => e.target.style.borderColor = '#c89666'}
                value={formData.subject_code}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="block font-bold mb-2" style={{ color: '#2d545e' }}>
                Subject Type *
              </label>
              <select
                name="subject_type"
                className="shadow border rounded w-full py-2 px-3 leading-tight focus:outline-none"
                style={{ borderColor: '#c89666' }}
                onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                onBlur={(e) => e.target.style.borderColor = '#c89666'}
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
              <label className="block font-bold mb-2" style={{ color: '#2d545e' }}>
                Credits *
              </label>
              <select
                name="credits"
                className="shadow border rounded w-full py-2 px-3 leading-tight focus:outline-none"
                style={{ borderColor: '#c89666' }}
                onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                onBlur={(e) => e.target.style.borderColor = '#c89666'}
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
              <label className="block font-bold mb-2" style={{ color: '#2d545e' }}>
                Semester *
              </label>
              <select
                name="semester"
                className="shadow border rounded w-full py-2 px-3 leading-tight focus:outline-none"
                style={{ borderColor: '#c89666' }}
                onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                onBlur={(e) => e.target.style.borderColor = '#c89666'}
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
              <label className="block font-bold mb-2" style={{ color: '#2d545e' }}>
                Branch *
              </label>
              <select
                name="branch"
                className="shadow border rounded w-full py-2 px-3 leading-tight focus:outline-none"
                style={{ borderColor: '#c89666' }}
                onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                onBlur={(e) => e.target.style.borderColor = '#c89666'}
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
              <label className="block font-bold mb-2" style={{ color: '#2d545e' }}>
                Assign Teacher (Optional)
              </label>
              <select
                name="teacher"
                className="shadow border rounded w-full py-2 px-3 leading-tight focus:outline-none"
                style={{ borderColor: '#c89666' }}
                onFocus={(e) => e.target.style.borderColor = '#2d545e'}
                onBlur={(e) => e.target.style.borderColor = '#c89666'}
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
              className="w-full text-white font-bold py-3 px-4 rounded focus:outline-none transition-colors"
              style={{ backgroundColor: '#2d545e' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#12343b'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2d545e'}
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