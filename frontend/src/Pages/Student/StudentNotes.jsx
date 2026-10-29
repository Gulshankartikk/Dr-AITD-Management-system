import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import aiService from '../../services/aiService';
import {
  FaDownload,
  FaEye,
  FaUser,
  FaClock,
  FaStickyNote,
  FaMagic,
  FaTimes,
  FaSpinner,
  FaPaperPlane,
  FaRobot
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import Card, { CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentNotes = () => {
  const { studentId } = useParams();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gemini AI Tutor Modal State
  const [activeModal, setActiveModal] = useState({
    open: false,
    note: null,
    loading: false,
    summary: '',
    chatInput: '',
    chatHistory: [],
    sendingChat: false
  });

  useEffect(() => {
    fetchNotes();
  }, [studentId]);

  const fetchNotes = async () => {
    try {
      const response = await api.get(`/api/student/${studentId}/notes`);
      setNotes(response.data.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  // Open Gemini AI Study Guide
  const handleOpenAITutor = async (note) => {
    setActiveModal({
      open: true,
      note,
      loading: true,
      summary: '',
      chatInput: '',
      chatHistory: [],
      sendingChat: false
    });

    try {
      const res = await aiService.summarizeResource({
        title: note.title,
        description: note.description,
        subject: note.subjectId?.subjectName || ''
      });

      setActiveModal(prev => ({
        ...prev,
        loading: false,
        summary: res.summary || 'Summary generated.'
      }));
    } catch (err) {
      console.error('Error fetching AI study guide:', err);
      setActiveModal(prev => ({
        ...prev,
        loading: false,
        summary: 'Unable to load AI summary. Please check your network connection.'
      }));
    }
  };

  // Handle follow-up question to Gemini
  const handleAskFollowUp = async (e) => {
    e.preventDefault();
    if (!activeModal.chatInput.trim() || activeModal.sendingChat) return;

    const userMsg = activeModal.chatInput.trim();
    const updatedHistory = [...activeModal.chatHistory, { sender: 'You', text: userMsg }];

    setActiveModal(prev => ({
      ...prev,
      chatHistory: updatedHistory,
      chatInput: '',
      sendingChat: true
    }));

    try {
      const prompt = `Context: This question is regarding the college lecture note titled "${activeModal.note?.title}" for subject "${activeModal.note?.subjectId?.subjectName || 'Engineering'}".
Student Question: ${userMsg}`;

      const res = await aiService.chat(prompt, updatedHistory);
      const aiReply = res.reply || 'Here is what you need to know about that concept.';

      setActiveModal(prev => ({
        ...prev,
        chatHistory: [...prev.chatHistory, { sender: 'Gemini AI', text: aiReply }],
        sendingChat: false
      }));
    } catch (err) {
      console.error('AI chat error:', err);
      setActiveModal(prev => ({
        ...prev,
        chatHistory: [...prev.chatHistory, { sender: 'Gemini AI', text: 'Sorry, I encountered an issue answering. Please try again!' }],
        sendingChat: false
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner message="Loading notes..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-6">
          <FaStickyNote className="text-3xl text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-secondary font-heading">My Notes</h1>
            <p className="text-text-secondary">Access lecture notes and study with Gemini AI Tutor</p>
          </div>
        </div>

        {notes.length === 0 ? (
          <Card className="border border-gray-200">
            <CardContent className="p-8 text-center">
              <FaStickyNote className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-text-secondary text-lg">No notes available yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {notes.map((note) => (
              <Card key={note._id} className="border border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                          {note.subjectId?.subjectName || 'Course Material'}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-secondary mb-2 font-heading">{note.title}</h3>
                      {note.description && (
                        <p className="text-text-secondary mb-4 text-sm whitespace-pre-line line-clamp-3">{note.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                        <div className="flex items-center space-x-1">
                          <FaUser />
                          <span>By: {note.teacherId?.name || 'Faculty'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaClock />
                          <span>Updated: {new Date(note.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                      {/* AI Explain Button */}
                      <button
                        onClick={() => handleOpenAITutor(note)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold shadow-sm transition-all"
                      >
                        <FaMagic />
                        <span>✨ AI Study Tutor</span>
                      </button>

                      {note.fileUrl && (
                        <>
                          <Button
                            onClick={() => window.open(note.fileUrl, '_blank')}
                            variant="primary"
                            className="flex items-center gap-2"
                            title="View"
                          >
                            <FaEye /> View
                          </Button>
                          <Button
                            onClick={() => handleDownload(note.fileUrl, `${note.title}.pdf`)}
                            variant="success"
                            className="flex items-center gap-2"
                            title="Download"
                          >
                            <FaDownload /> Download
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Gemini AI Tutor Modal */}
      {activeModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-gray-200">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-2xl">
              <div className="flex items-center gap-2">
                <FaRobot className="text-xl" />
                <div>
                  <h3 className="font-bold text-base font-heading">Gemini AI Tutor: {activeModal.note?.title}</h3>
                  <p className="text-xs text-white/80">{activeModal.note?.subjectId?.subjectName || 'Study Guide'}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal({ open: false, note: null, loading: false, summary: '', chatInput: '', chatHistory: [], sendingChat: false })}
                className="text-white/80 hover:text-white p-1"
              >
                <FaTimes />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
              {activeModal.loading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3">
                  <FaSpinner className="animate-spin text-3xl text-indigo-600" />
                  <p className="text-sm font-medium text-gray-500">Gemini is analyzing the lecture notes and preparing your study guide...</p>
                </div>
              ) : (
                <>
                  {/* Summary Block */}
                  <div className="prose prose-sm max-w-none whitespace-pre-line leading-relaxed text-gray-800 bg-indigo-50/50 p-5 rounded-xl border border-indigo-100">
                    {activeModal.summary}
                  </div>

                  {/* Interactive Q&A history */}
                  {activeModal.chatHistory.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tutor Discussion</h4>
                      {activeModal.chatHistory.map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl text-xs ${
                            item.sender === 'You'
                              ? 'bg-blue-50 border border-blue-200 text-blue-900 ml-8'
                              : 'bg-gray-100 border border-gray-200 text-gray-800 mr-8 whitespace-pre-line'
                          }`}
                        >
                          <div className="font-semibold mb-1">{item.sender}</div>
                          <div>{item.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Chat Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <form onSubmit={handleAskFollowUp} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask Gemini a specific question about this topic..."
                  value={activeModal.chatInput}
                  onChange={(e) => setActiveModal(p => ({ ...p, chatInput: e.target.value }))}
                  className="flex-1 px-4 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  disabled={activeModal.loading || activeModal.sendingChat}
                />
                <button
                  type="submit"
                  disabled={activeModal.loading || activeModal.sendingChat || !activeModal.chatInput.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                >
                  {activeModal.sendingChat ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                  <span>Ask</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentNotes;
