import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="font-sans bg-navy">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-sky-blue">About A.I.T.D.</h3>
            <p className="text-sm leading-relaxed mb-4 text-white">
              Dr. Ambedkar Institute of Technology for Divyangjan (A.I.T.D.) was established in 1997 at Kanpur, U.P., India by Government of Uttar Pradesh under World Bank assisted project.
              A.I.T.D. imparts technical education through B.Tech. and Diploma courses. The entire facility is barrier-free, where normal and disabled students study together.
            </p>
            <div className="w-16 h-1 bg-sky-blue/50"></div>
          </div>

          {/* Quick Resources */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-sky-blue">Quick Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm font-medium transition-colors text-white hover:text-sky-blue">
                  📄 Download Prospectus
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-medium transition-colors text-white hover:text-sky-blue">
                  📅 Academic Calendar
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-medium transition-colors text-white hover:text-sky-blue">
                  ✅ Attendance Portal
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-medium transition-colors text-white hover:text-sky-blue">
                  📊 Exam Results
                </a>
              </li>
              <li>
                <a href="#" className="text-sm font-medium transition-colors text-white hover:text-sky-blue">
                  🎓 Scholarship Info
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-sky-blue">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <FaMapMarkerAlt className="mt-1 text-sky-blue/70" />
                <span className="text-sm font-medium text-white">
                  Awadhpuri, Khyora, Lakhanpur, Kanpur - 208024, Uttar Pradesh, India
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <FaPhone className="text-sky-blue/70" />
                <span className="text-sm font-medium text-white">
                  +91 1234567890
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <FaPhone className="text-sky-blue/70" />
                <span className="text-sm font-medium text-white">
                  +91 8726321083
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope className="text-sky-blue/70" />
                <span className="text-sm font-medium text-white">
                  admin@college.edu
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope className="text-sky-blue/70" />
                <span className="text-sm font-medium text-white">
                  admissions@college.edu
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-sky-blue">Connect With Us</h3>
            <p className="text-sm mb-4 font-medium text-white">
              Follow us on social media for updates and news
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-3 rounded-full transition-all transform hover:scale-110 shadow-lg bg-sky-blue hover:bg-sky-blue/80"
              >
                <FaFacebook className="text-xl text-navy" />
              </a>
              <a
                href="#"
                className="p-3 rounded-full transition-all transform hover:scale-110 shadow-lg bg-sky-blue hover:bg-sky-blue/80"
              >
                <FaInstagram className="text-xl text-navy" />
              </a>
              <a
                href="#"
                className="p-3 rounded-full transition-all transform hover:scale-110 shadow-lg bg-sky-blue hover:bg-sky-blue/80"
              >
                <FaLinkedin className="text-xl text-navy" />
              </a>
              <a
                href="#"
                className="p-3 rounded-full transition-all transform hover:scale-110 shadow-lg bg-sky-blue hover:bg-sky-blue/80"
              >
                <FaYoutube className="text-xl text-navy" />
              </a>
              <a
                href="#"
                className="p-3 rounded-full transition-all transform hover:scale-110 shadow-lg bg-sky-blue hover:bg-sky-blue/80"
              >
                <FaTwitter className="text-xl text-navy" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-sky-blue/30">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm font-semibold mb-4 md:mb-0 text-sky-blue">
              © 2025 College Management System. All Rights Reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm font-medium transition-colors text-white hover:text-sky-blue">
                Privacy Policy
              </a>
              <a href="#" className="text-sm font-medium transition-colors text-white hover:text-sky-blue">
                Terms of Service
              </a>
              <a href="#" className="text-sm font-medium transition-colors text-white hover:text-sky-blue">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
