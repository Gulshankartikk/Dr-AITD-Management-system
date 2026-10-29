import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, Shield, Sparkles, Bot, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import HeroSlider from '../components/HeroSlider';
import Footer from '../components/Footer';

const LandingPage = () => {
  const handleOpenCopilot = () => {
    window.dispatchEvent(new CustomEvent('open-ai-copilot', { detail: { tab: 'chat' } }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-secondary font-heading">Dr AITD</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleOpenCopilot}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold transition-colors"
            >
              <Sparkles size={14} className="text-indigo-600" />
              <span>✨ Ask Campus AI</span>
            </button>
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Slider */}
      <HeroSlider />

      {/* Gemini AI Spotlight Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-900 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
                <Sparkles size={14} className="text-yellow-400" />
                <span>Powered by Google Gemini 2.5 Flash</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
                Next-Generation AI Campus Intelligence
              </h2>
              <p className="text-white/70 text-sm">
                Empowering Students with 24/7 personal tutoring and revision roadmaps, Faculty with automated quiz and assignment rubrics, and Administration with deep executive analytics.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleOpenCopilot}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg transition-all"
              >
                <Bot size={18} />
                <span>Launch Campus Copilot</span>
              </button>
              <Link to="/login">
                <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  <span>Sign In to Experience AI</span>
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary mb-4 font-heading">Everything You Need</h2>
            <p className="text-lg text-text-secondary">Powerful, AI-enhanced features to manage every aspect of your educational institution.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Sparkles,
                title: "Gemini AI Copilot",
                desc: "Real-time AI assistance across student study notes, faculty assignment generation, and official notices."
              },
              {
                icon: Users,
                title: "Student Management",
                desc: "Track admissions, attendance, and academic progress with predictive AI study recommendations."
              },
              {
                icon: BookOpen,
                title: "Course Planning",
                desc: "Manage curriculum, subjects, lecture notes, and automated assignment rubrics seamlessly."
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                desc: "Role-based access control, encrypted data protection, and offline-safe fallback execution."
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3 font-heading">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Institutions", value: "1+" },
              { label: "Students", value: "150+" },
              { label: "Teachers", value: "50+" },
              { label: "AI Acceleration", value: "10x" }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-4xl font-extrabold text-primary mb-2 font-heading">{stat.value}</div>
                <div className="text-text-secondary font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer mode="full" />
    </div>
  );
};

export default LandingPage;
