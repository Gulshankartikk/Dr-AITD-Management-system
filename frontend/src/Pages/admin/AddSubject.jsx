import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../services/api";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import BackButton from "../../components/back";

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
      const response = await axios.get(`${BASE_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/teachers`, {
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

    const res = await axios.post(`${BASE_URL}/api/subjects/add`, payload, {
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
    <div className="flex flex-col w-full min-h-[100vh] bg-blue-500 pb-10">
      <div className="ms-5 mt-5 xl:mt-0">
        <BackButton targetRoute="/admin/dashboard" />
      </div>

      <div className="text-white flex items-center justify-center py-11">
        <h1 className="font-extrabold text-5xl md:text-8xl text-center overflow-hidden">
          Add Subject
        </h1>
      </div>

      <div className="w-full flex justify-center px-5 lg:px-44">
        <form
          method="post"
          className="bg-white flex flex-col gap-4 justify-evenly py-10 w-full md:w-[50vw] px-10 border-2 border-black rounded-xl"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex justify-center items-center mb-6">
            <div className="flex items-center justify-center w-52">
              <img
                src="/src/assets/dr-ambedkar-institute-of-technology-for-handicapped-kanpur.jpeg.jpg"
                alt="logo"
                className="w-full"
              />
            </div>
          </div>

          {/* Course Selection */}
          <div className="flex flex-col">
            <label className="block text-gray-700 font-bold mb-2">
              Select Course (Optional)
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-2 focus:shadow-outline"
            >
              <option value="">Select Course</option>
              {selectedCourses.map(course => (
                <option key={course} value={course}>
                  {course}
                </option>
              ))}
              {courses && courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="block text-gray-700 font-bold mb-2">
                Subject Name *
              </label>
              <input
                type="text"
                name="subject_name"
                placeholder="e.g., Data Structures"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-2 focus:shadow-outline"
                value={formData.subject_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-gray-700 font-bold mb-2">
                Subject Code *
              </label>
              <input
                type="text"
                name="subject_code"
                placeholder="e.g., CSE201"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-2 focus:shadow-outline"
                value={formData.subject_code}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Subject Type and Credits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="block text-gray-700 font-bold mb-2">
                Subject Type *
              </label>
              <select
                name="subject_type"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-2 focus:shadow-outline"
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
              <label className="block text-gray-700 font-bold mb-2">
                Credits *
              </label>
              <select
                name="credits"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-2 focus:shadow-outline"
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
              <label className="block text-gray-700 font-bold mb-2">
                Elective Subject
              </label>
              <label className="flex items-center mt-2">
                <input
                  type="checkbox"
                  name="is_elective"
                  checked={formData.is_elective}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-gray-700">Is Elective?</span>
              </label>
            </div>
          </div>

          {/* Branch and Semester */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="block text-gray-700 font-bold mb-2">
                Branch *
              </label>
              <select
                name="branch"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-2 focus:shadow-outline"
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
              <label className="block text-gray-700 font-bold mb-2">
                Semester *
              </label>
              <select
                name="semester"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-2 focus:shadow-outline"
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

          {/* Teacher Assignment */}
          <div className="flex flex-col">
            <label className="block text-gray-700 font-bold mb-2">
              Assign Teacher (Optional)
            </label>
            <select
              name="teacher"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-2 focus:shadow-outline"
              value={formData.teacher}
              onChange={handleChange}
            >
              <option value="">Select Teacher</option>
              {teachers && teachers.map(teacher => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name} ({teacher.teacher_Id})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center mt-6 w-full">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
