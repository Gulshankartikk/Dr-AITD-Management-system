import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaGraduationCap } from 'react-icons/fa';

const Footer = ({ mode = 'compact' }) => {
  const currentYear = new Date().getFullYear();

  if (mode === 'compact') {
    return (
      <footer className="py-4 px-6 border-t border-gray-200 bg-white text-xs text-text-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <FaGraduationCap className="text-primary" />
            <span>
              © {currentYear} Dr. Ambedkar Institute of Technology for Divyangjan (AITD), Kanpur.
            </span>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <Link to="/achievers" className="hover:text-primary transition-colors">Hall of Fame</Link>
            <span className="text-gray-300">|</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ERP Online v2.5
            </span>
          </div>
        </div>
      </footer>
    );
  }

  // Full Footer for Public Landing Page
  return (
    <footer className="font-sans bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* About Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-lg font-heading">
              <FaGraduationCap className="text-2xl" />
              <span>Dr. AITD, Kanpur</span>
            </div>
            <p className="text-xs leading-relaxed text-gray-300">
              Dr. Ambedkar Institute of Technology for Divyangjan (A.I.T.D.) was established in 1997 at Kanpur, Uttar Pradesh, India by Government of Uttar Pradesh under a World Bank assisted project.
              Imparting technical education through B.Tech and Diploma programs in a dedicated barrier-free academic environment.
            </p>
          </div>

          {/* Quick ERP Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-primary font-heading">
              ERP Portals
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <span>→</span> Student Portal Login
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <span>→</span> Faculty Portal Login
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <span>→</span> Administrative Portal Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <span>→</span> Student Online Registration
                </Link>
              </li>
              <li>
                <Link to="/achievers" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <span>→</span> Student Achievers (Hall of Fame)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-primary font-heading">
              Campus Location
            </h3>
            <ul className="space-y-3 text-xs text-gray-300">
              <li className="flex items-start space-x-2.5">
                <FaMapMarkerAlt className="mt-1 text-primary flex-shrink-0" />
                <span>
                  Awadhpuri, Khyora, Lakhanpur, Kanpur - 208024, Uttar Pradesh, India
                </span>
              </li>
              <li className="flex items-center space-x-2.5">
                <FaPhone className="text-primary flex-shrink-0" />
                <span>Office: +91 512 258 0122</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <FaEnvelope className="text-primary flex-shrink-0" />
                <span>info@draitd.edu</span>
              </li>
            </ul>
          </div>

          {/* Academic Wings */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-primary font-heading">
              Academic Divisions
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-3">
              Approved by AICTE New Delhi and affiliated with Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow.
            </p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300">
              <span className="font-semibold text-white block mb-1">Barrier-Free Campus</span>
              Empowering diverse learners with assistive technologies and modern engineering laboratories.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 mt-6 border-t border-gray-700/60 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <p>© {currentYear} Dr. Ambedkar Institute of Technology for Divyangjan. All Rights Reserved.</p>
          <div className="flex gap-4">
            <Link to="/achievers" className="hover:text-white transition-colors">Hall of Fame</Link>
            <Link to="/login" className="hover:text-white transition-colors">ERP Sign In</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
