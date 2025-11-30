import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants/api";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FaUpload, FaFileAlt } from "react-icons/fa";

const TeacherUpload = ({ teacherId }) => {
  const [activeTab, setActiveTab] = useState("assignment");
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectId: "",
    courseId: "",
    deadline: "",
    file: null,
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSubjectsAndCourses();
  }, [teacherId]);

  // ============================= FETCH SUBJECTS & COURSES =============================
  const fetchSubjectsAndCourses = async () => {
    try {
      const token = Cookies.get("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [subjectsRes, coursesRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/teacher/${teacherId}/subjects`, { headers }),
        axios.get(`${BASE_URL}/api/teacher/${teacherId}/courses`, { headers }),
      ]);

      setSubjects(subjectsRes.data.subjects || []);
      setCourses(coursesRes.data.courses || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load subjects and courses");
    }
  };

  // ============================= HANDLERS =============================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((p) => ({ ...p, file: e.target.files[0] }));
  };

  // ============================= VALIDATION PER TAB =============================
  const validateForm = () => {
    if (!formData.title.trim()) return "Title is required";

    if (activeTab !== "notice" && !formData.subjectId)
      return "Please select a subject";

    if (activeTab === "notice" && !formData.courseId)
      return "Please select a course";

    if (activeTab === "assignment" && !formData.deadline)
      return "Deadline required";

    if (activeTab !== "notice" && !formData.file)
      return "File is required";

    return null;
  };

  // ============================= SUBMIT =============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) return toast.error(error);

    setUploading(true);

    try {
      const token = Cookies.get("token");
      const uploadData = new FormData();

      uploadData.append("title", formData.title);
      uploadData.append("description", formData.description);

      if (activeTab !== "notice") uploadData.append("subjectId", formData.subjectId);
      if (activeTab === "notice") uploadData.append("courseId", formData.courseId);
      if (activeTab === "assignment") uploadData.append("deadline", formData.deadline);
      if (formData.file) uploadData.append("file", formData.file);

      // Correct endpoints
      const endpoints = {
        assignment: `/api/teacher/${teacherId}/assignments`,
        note: `/api/teacher/${teacherId}/notes`,
        material: `/api/teacher/${teacherId}/materials`,
        notice: `/api/teacher/${teacherId}/notices`,
      };

      await axios.post(`${BASE_URL}${endpoints[activeTab]}`, uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(`${activeTab} uploaded successfully!`);

      // Reset Form
      setFormData({
        title: "",
        description: "",
        subjectId: "",
        courseId: "",
        deadline: "",
        file: null,
      });

      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  // ============================= UI =============================
  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === id
        ? "bg-sky-blue text-white"
        : "bg-background text-text-grey hover:bg-soft-grey/20"
        }`}
    >
      {label}
    </button>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Upload Content</h1>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        <TabButton id="assignment" label="Assignment" />
        <TabButton id="note" label="Notes" />
        <TabButton id="material" label="Study Material" />
        <TabButton id="notice" label="Notice" />
      </div>

      {/* FORM */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TITLE */}
          <Input label="Title *" name="title" value={formData.title} onChange={handleInputChange} />

          {/* DESCRIPTION */}
          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />

          {/* SUBJECT SELECT (not for notice) */}
          {activeTab !== "notice" && (
            <Select
              label="Subject *"
              name="subjectId"
              value={formData.subjectId}
              options={subjects}
              onChange={handleInputChange}
              display={(s) => `${s.subjectName} (${s.subjectCode})`}
            />
          )}

          {/* COURSE SELECT (for notice only) */}
          {activeTab === "notice" && (
            <Select
              label="Course *"
              name="courseId"
              value={formData.courseId}
              options={courses}
              onChange={handleInputChange}
              display={(c) => `${c.courseName} (${c.courseCode})`}
            />
          )}

          {/* DEADLINE (assignment only) */}
          {activeTab === "assignment" && (
            <Input
              type="datetime-local"
              label="Deadline *"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
            />
          )}

          {/* FILE UPLOAD */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload File {activeTab !== "notice" && "*"}
            </label>

            <div className="border-2 border-dashed border-soft-grey rounded-lg p-6 text-center">
              <FaFileAlt className="mx-auto text-text-grey/50 text-3xl mb-2" />

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                required={activeTab !== "notice"}
              />

              <label htmlFor="file-upload" className="cursor-pointer text-sky-blue hover:text-sky-blue/80">
                Click to upload a file
              </label>

              <p className="text-sm text-text-grey mt-1">
                PDF, DOC, DOCX, PPT, PPTX (Max 10MB)
              </p>

              {formData.file && (
                <p className="text-sm text-sky-blue mt-2">Selected: {formData.file.name}</p>
              )}
            </div>
          </div>

          {/* SUBMIT BTN */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-sky-blue text-white py-3 px-6 rounded-lg hover:bg-sky-blue/80 disabled:opacity-50 flex items-center justify-center"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <FaUpload className="mr-2" />
                Upload {activeTab}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherUpload;

/* ============================= REUSABLE COMPONENTS ============================= */

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <input
      {...props}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
    />
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <textarea
      rows="3"
      {...props}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
    />
  </div>
);

const Select = ({ label, name, value, options, onChange, display }) => (
  <div>
    <label className="block text-sm font-medium mb-2">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt._id} value={opt._id}>
          {display(opt)}
        </option>
      ))}
    </select>
  </div>
);
