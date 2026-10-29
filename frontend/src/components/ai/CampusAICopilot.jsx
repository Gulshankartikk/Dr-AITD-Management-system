import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  BookOpen, 
  FileText, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Copy, 
  Check, 
  Bot, 
  User, 
  Trash2,
  RefreshCw,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import aiService from '../../services/aiService';
import { toast } from 'react-toastify';

const CampusAICopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'explain' | 'notice'
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Topic explainer state
  const [topicInput, setTopicInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [explanationOutput, setExplanationOutput] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);

  // Notice generator state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeAudience, setNoticeAudience] = useState('All Students & Faculty');
  const [noticeKeyPoints, setNoticeKeyPoints] = useState('');
  const [noticeOutput, setNoticeOutput] = useState('');
  const [isGeneratingNotice, setIsGeneratingNotice] = useState(false);

  const messagesEndRef = useRef(null);

  // Retrieve user role from storage
  const userRole = localStorage.getItem('userRole') || 'guest';
  const userId = localStorage.getItem('userId') || '';

  // Initial welcome message based on role
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMap = {
        student: "Hi there! I'm your **Dr. AITD Student Copilot** powered by Google Gemini. Need help understanding a concept, preparing for exams, or writing a leave application? Ask me anything!",
        teacher: "Greetings, Professor! I'm your **Dr. AITD Faculty Copilot** powered by Google Gemini. I can help generate quiz questions, draft notices, outline assignments, and suggest teaching rubrics.",
        admin: "Welcome, Administrator! I'm your **Dr. AITD Campus Copilot** powered by Google Gemini. I can draft institutional circulars, summarize reports, and help formulate college policies.",
        guest: "Welcome to Dr. AITD Kanpur! I'm your **Campus AI Assistant** powered by Google Gemini. How can I help you today?"
      };
      setMessages([
        {
          id: 1,
          sender: 'ai',
          text: welcomeMap[userRole] || welcomeMap.guest,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [userRole]);

  useEffect(() => {
    const handleOpenCopilot = (e) => {
      setIsOpen(true);
      if (e.detail?.tab) setActiveTab(e.detail.tab);
    };
    window.addEventListener('open-ai-copilot', handleOpenCopilot);
    return () => window.removeEventListener('open-ai-copilot', handleOpenCopilot);
  }, []);

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-6).map(m => ({
        sender: m.sender === 'user' ? 'User' : 'Assistant',
        text: m.text
      }));

      const res = await aiService.chat(textToSend.trim(), historyPayload);
      
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI chat error:', err);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "I'm having a little trouble connecting right now. If you haven't yet, ensure `GEMINI_API_KEY` is added to your backend `.env` file for live generation.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainTopic = async () => {
    if (!topicInput.trim()) {
      toast.warning('Please enter a topic to explain');
      return;
    }
    setIsExplaining(true);
    try {
      const res = await aiService.explainTopic(topicInput, subjectInput);
      setExplanationOutput(res.explanation);
    } catch (err) {
      toast.error('Failed to generate explanation');
    } finally {
      setIsExplaining(false);
    }
  };

  const handleGenerateNotice = async () => {
    if (!noticeTitle.trim()) {
      toast.warning('Please enter a notice topic or title');
      return;
    }
    setIsGeneratingNotice(true);
    try {
      const res = await aiService.generateNotice({
        title: noticeTitle,
        audience: noticeAudience,
        keyPoints: noticeKeyPoints
      });
      setNoticeOutput(res.noticeText);
    } catch (err) {
      toast.error('Failed to generate notice');
    } finally {
      setIsGeneratingNotice(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: `Chat cleared. How can I assist you further, ${userRole}?`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // Quick suggestion prompts based on role
  const suggestions = {
    student: [
      "Explain Binary Search Trees with an example",
      "Draft a 2-day sick leave application for HOD",
      "What are the best study habits for engineering exams?",
      "Explain ACID properties in DBMS"
    ],
    teacher: [
      "Generate 5 quiz questions on Operating Systems",
      "Draft an internal assessment schedule notice",
      "What are effective laboratory grading rubrics?",
      "How to design an engaging coding assignment?"
    ],
    admin: [
      "Draft an official notice for semester break",
      "Write an attendance reminder circular for students",
      "Suggest fee payment installment policy guidelines",
      "Draft a campus safety and lab protocol circular"
    ],
    guest: [
      "What engineering courses are offered at Dr. AITD?",
      "How does the Dr. AITD management portal work?",
      "What is the college attendance requirement?"
    ]
  };

  const currentSuggestions = suggestions[userRole] || suggestions.guest;

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Copilot"
            className="group relative flex items-center space-x-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none ring-4 ring-blue-500/20"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <span className="font-semibold text-sm tracking-wide">AITD AI Copilot</span>
          </button>
        )}
      </div>

      {/* Main Drawer / Modal */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-300 overflow-hidden ${
            isExpanded 
              ? 'w-[95vw] sm:w-[650px] h-[85vh] max-w-4xl' 
              : 'w-[92vw] sm:w-[420px] h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white px-4 py-3.5 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-yellow-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm leading-tight">AITD Campus Copilot</h3>
                  <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    Gemini AI
                  </span>
                </div>
                <p className="text-[11px] text-blue-100 capitalize">Role: {userRole}</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title={isExpanded ? 'Shrink' : 'Expand'}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50/80 px-2 pt-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-1.5 py-2 px-3 border-b-2 transition-all ${
                activeTab === 'chat'
                  ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg shadow-xs'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <MessageSquare size={14} />
              <span>Ask AI</span>
            </button>
            <button
              onClick={() => setActiveTab('explain')}
              className={`flex items-center space-x-1.5 py-2 px-3 border-b-2 transition-all ${
                activeTab === 'explain'
                  ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg shadow-xs'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <BookOpen size={14} />
              <span>Topic Explainer</span>
            </button>
            <button
              onClick={() => setActiveTab('notice')}
              className={`flex items-center space-x-1.5 py-2 px-3 border-b-2 transition-all ${
                activeTab === 'notice'
                  ? 'border-indigo-600 text-indigo-700 bg-white rounded-t-lg shadow-xs'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <FileText size={14} />
              <span>Draft Notice</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col bg-slate-50/50">
            {/* TAB 1: CONVERSATIONAL CHAT */}
            {activeTab === 'chat' && (
              <>
                {/* Messages stream */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm">
                  {messages.map((m, idx) => (
                    <div
                      key={m.id || idx}
                      className={`flex items-start space-x-2 ${
                        m.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {m.sender === 'ai' && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5">
                          <Bot size={15} />
                        </div>
                      )}
                      
                      <div
                        className={`group relative max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs ${
                          m.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                        }`}
                      >
                        <div className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                          {m.text}
                        </div>
                        <div
                          className={`flex items-center justify-between text-[10px] mt-1.5 ${
                            m.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                          }`}
                        >
                          <span>{m.time}</span>
                          {m.sender === 'ai' && (
                            <button
                              onClick={() => copyToClipboard(m.text, idx)}
                              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:text-gray-700"
                              title="Copy"
                            >
                              {copiedIndex === idx ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            </button>
                          )}
                        </div>
                      </div>

                      {m.sender === 'user' && (
                        <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                          <User size={15} />
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0">
                        <Bot size={15} />
                      </div>
                      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 text-xs text-gray-500 flex items-center space-x-1.5 shadow-xs">
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        <span className="ml-1 text-[11px]">Gemini is thinking...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick suggestions pills */}
                {messages.length < 5 && (
                  <div className="px-3 py-1.5 bg-gray-100/70 border-t border-gray-200 overflow-x-auto">
                    <div className="flex items-center space-x-1.5 text-[11px] text-gray-500 mb-1">
                      <Lightbulb size={12} className="text-amber-500" />
                      <span>Suggested prompts:</span>
                    </div>
                    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {currentSuggestions.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(prompt)}
                          className="shrink-0 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-gray-600 border border-gray-200 rounded-lg px-2 py-1 text-[11px] transition-colors shadow-2xs"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input box */}
                <div className="p-3 bg-white border-t border-gray-200 shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={`Ask anything as a ${userRole}...`}
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !inputMessage.trim()}
                      className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors shrink-0"
                    >
                      <Send size={15} />
                    </button>
                    {messages.length > 1 && (
                      <button
                        type="button"
                        onClick={clearChat}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                        title="Clear conversation"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </form>
                </div>
              </>
            )}

            {/* TAB 2: TOPIC EXPLAINER */}
            {activeTab === 'explain' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs sm:text-sm">
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 text-indigo-900 text-xs">
                  <p className="font-semibold flex items-center">
                    <BookOpen size={14} className="mr-1.5 text-indigo-600" />
                    AI Academic Tutor
                  </p>
                  <p className="text-indigo-700 text-[11px] mt-0.5">
                    Enter any engineering topic and get structured explanations, analogies, and key takeaways.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-xs">Subject (Optional)</label>
                  <input
                    type="text"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    placeholder="e.g. Data Structures, DBMS, Operating Systems"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-xs">Topic to Explain *</label>
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    placeholder="e.g. B-Trees, Normalization, Deadlocks, Dijkstra Algorithm"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleExplainTopic}
                  disabled={isExplaining || !topicInput.trim()}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 text-xs"
                >
                  {isExplaining ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>{isExplaining ? 'Generating Explanation...' : 'Explain with Gemini AI'}</span>
                </button>

                {explanationOutput && (
                  <div className="mt-3 bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs relative group">
                    <button
                      onClick={() => copyToClipboard(explanationOutput, 999)}
                      className="absolute top-2.5 right-2.5 p-1 text-gray-400 hover:text-indigo-600 rounded bg-gray-50 border border-gray-200 transition-colors"
                      title="Copy"
                    >
                      {copiedIndex === 999 ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    </button>
                    <div className="whitespace-pre-wrap leading-relaxed text-xs text-gray-800">
                      {explanationOutput}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: NOTICE & CIRCULAR DRAFTER */}
            {activeTab === 'notice' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs sm:text-sm">
                <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3 text-purple-900 text-xs">
                  <p className="font-semibold flex items-center">
                    <FileText size={14} className="mr-1.5 text-purple-600" />
                    AI Notice & Circular Drafter
                  </p>
                  <p className="text-purple-700 text-[11px] mt-0.5">
                    Quickly compose formal institutional circulars and class announcements for Dr. AITD.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-xs">Notice Subject / Title *</label>
                  <input
                    type="text"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    placeholder="e.g. Schedule for Mid-Term Sessional Examination"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-xs">Target Audience</label>
                  <select
                    value={noticeAudience}
                    onChange={(e) => setNoticeAudience(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="All Students & Faculty">All Students & Faculty</option>
                    <option value="B.Tech Computer Science Students">B.Tech Computer Science Students</option>
                    <option value="Final Year Students">Final Year Students</option>
                    <option value="All Faculty Members">All Faculty Members</option>
                    <option value="Hostel Residents">Hostel Residents</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-xs">Key Points / Details</label>
                  <textarea
                    rows={2}
                    value={noticeKeyPoints}
                    onChange={(e) => setNoticeKeyPoints(e.target.value)}
                    placeholder="e.g. Tests begin Nov 10, admit cards mandatory, reporting time 9:30 AM"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleGenerateNotice}
                  disabled={isGeneratingNotice || !noticeTitle.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-xs transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 text-xs"
                >
                  {isGeneratingNotice ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>{isGeneratingNotice ? 'Drafting Official Notice...' : 'Draft Notice with Gemini'}</span>
                </button>

                {noticeOutput && (
                  <div className="mt-3 bg-white border border-gray-200 rounded-xl p-3.5 shadow-xs relative group">
                    <button
                      onClick={() => copyToClipboard(noticeOutput, 998)}
                      className="absolute top-2.5 right-2.5 p-1 text-gray-400 hover:text-purple-600 rounded bg-gray-50 border border-gray-200 transition-colors"
                      title="Copy"
                    >
                      {copiedIndex === 998 ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    </button>
                    <div className="whitespace-pre-wrap leading-relaxed text-xs text-gray-800">
                      {noticeOutput}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CampusAICopilot;
