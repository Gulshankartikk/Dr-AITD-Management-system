import React, { useState, useEffect, useRef } from "react";
import api from "../../api/axiosInstance";
import aiService from "../../services/aiService";
import { toast } from "react-toastify";
import { FaUpload, FaFileAlt, FaMagic, FaSpinner } from "react-icons/fa";
import Card, { CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select, { SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/Select";

const TeacherUpload = ({ teacherId }) => {
  const [activeTab, setActiveTab] = useState("assignment");
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [aiGenerating, setAiGenerating] = useState(false);

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
      const [subjectsRes, coursesRes] = await Promise.all([
        api.get(`/api/teacher/${teacherId}/subjects`),
        api.get(`/api/teacher/${teacherId}/courses`),
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

  // Gemini AI Assistant for Description & Objectives
  const handleAIAssist = async () => {
    if (!formData.title.trim()) {
      toast.warning("Please enter a title first so Gemini AI knows what to draft!");
      return;
    }

    setAiGenerating(true);
    try {
      const selectedSubject = subjects.find((s) => s._id === formData.subjectId)?.subjectName || "Computer Science";

      if (activeTab === "assignment") {
        const res = await aiService.generateAssignment({
          topic: formData.title,
          subject: selectedSubject,
          difficulty: "Intermediate",
          maxMarks: 50,
        });
        if (res.success && res.assignment) {
          setFormData((p) => ({ ...p, description: res.assignment }));
          toast.success("✨ Assignment description & rubric generated!");
        }
      } else if (activeTab === "notice") {
        const res = await aiService.generateNotice({
          title: formData.title,
          audience: "Class Students",
          keyPoints: formData.description || "Class updates and academic schedule",
          tone: "Formal",
        });
        if (res.success && res.noticeText) {
          setFormData((p) => ({ ...p, description: res.noticeText }));
          toast.success("✨ Notice circular generated!");
        }
      } else {
        // Notes / Materials
        const res = await aiService.explainTopic(formData.title, selectedSubject, "standard");
        if (res.success && res.explanation) {
          setFormData((p) => ({
            ...p,
            description: `Learning Objectives & Concept Breakdown:\n\n${res.explanation}`,
          }));
          toast.success("✨ Study note overview generated!");
        }
      }
    } catch (err) {
      console.error("AI Assistance failed:", err);
      toast.error("AI assistance failed. Please try again.");
    } finally {
      setAiGenerating(false);
    }
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

      await api.post(endpoints[activeTab], uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`${activeTab.toUpperCase()} uploaded successfully!`);

      // Reset form
      setFormData({
        title: "",
        description: "",
        subjectId: "",
        courseId: "",
        deadline: "",
        file: null,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.msg || `Failed to upload ${activeTab}`);
    } finally {
      setUploading(false);
    }
  };

  // ============================= UI =============================
  const TabButton = ({ id, label }) => (
    <Button
      variant={activeTab === id ? "primary" : "outline"}
      onClick={() => setActiveTab(id)}
      className="flex-1 md:flex-none"
    >
      {label}
    </Button>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-secondary font-heading">Upload Content</h1>
          <p className="text-text-secondary text-sm">Upload learning resources with optional Gemini AI assistance</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-4 mb-6">
        <TabButton id="assignment" label="Assignment" />
        <TabButton id="note" label="Notes" />
        <TabButton id="material" label="Study Material" />
        <TabButton id="notice" label="Notice" />
      </div>

      {/* FORM */}
      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* TITLE */}
            <Input
              label="Title *"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder={`e.g. ${activeTab === 'assignment' ? 'Lab Exercise 4: Graph Traversals' : activeTab === 'notice' ? 'Mid-term Lab Evaluation Schedule' : 'Unit 2: Dynamic Memory Allocation'}`}
            />

            {/* SUBJECT SELECT (not for notice) */}
            {activeTab !== "notice" && (
              <Select
                label="Subject *"
                name="subjectId"
                value={formData.subjectId}
                onValueChange={(value) => handleInputChange({ target: { name: 'subjectId', value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Select Subject</SelectItem>
                  {subjects.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.subjectName} ({s.subjectCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* COURSE SELECT (for notice only) */}
            {activeTab === "notice" && (
              <Select
                label="Course *"
                name="courseId"
                value={formData.courseId}
                onValueChange={(value) => handleInputChange({ target: { name: 'courseId', value } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Select Course</SelectItem>
                  {courses.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.courseName} ({c.courseCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* DESCRIPTION WITH AI ASSIST BUTTON */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-text-secondary">
                  Description / Instructions / Learning Outcomes
                </label>
                <button
                  type="button"
                  disabled={aiGenerating}
                  onClick={handleAIAssist}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors disabled:opacity-50"
                >
                  {aiGenerating ? (
                    <>
                      <FaSpinner className="animate-spin text-indigo-500" />
                      <span>Gemini Drafting...</span>
                    </>
                  ) : (
                    <>
                      <FaMagic className="text-indigo-500" />
                      <span>✨ AI Auto-Draft</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description or click ✨ AI Auto-Draft to generate based on title..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-mono text-xs leading-relaxed"
              />
            </div>

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
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Upload File {activeTab !== "notice" && "*"}
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors bg-gray-50">
                <FaFileAlt className="mx-auto text-text-muted text-3xl mb-2" />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  required={activeTab !== "notice"}
                />

                <label htmlFor="file-upload" className="cursor-pointer text-primary hover:text-primary/80 font-medium">
                  Click to upload a file
                </label>

                <p className="text-sm text-text-secondary mt-1">
                  PDF, DOC, DOCX, PPT, PPTX (Max 10MB)
                </p>

                {formData.file && (
                  <p className="text-sm text-primary mt-2 font-medium">Selected: {formData.file.name}</p>
                )}
              </div>
            </div>

            {/* SUBMIT BTN */}
            <Button
              type="submit"
              disabled={uploading}
              className="w-full flex items-center justify-center"
              isLoading={uploading}
            >
              {!uploading && <FaUpload className="mr-2" />}
              {uploading ? "Uploading..." : `Upload ${activeTab}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherUpload;
