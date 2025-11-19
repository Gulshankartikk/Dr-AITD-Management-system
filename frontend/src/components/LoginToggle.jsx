import React, { useState } from 'react';
import '../styles/LoginToggle.css';

const LoginToggle = () => {
  const [isTeacher, setIsTeacher] = useState(false);

  const handleToggle = () => {
    setIsTeacher(!isTeacher);
  };

  return (
    <div className="login-container">
      {/* Toggle Switch */}
      <div className="toggle-wrapper">
        <span className={`toggle-label ${!isTeacher ? 'active' : ''}`}>Student</span>
        <div className="toggle-switch" onClick={handleToggle}>
          <div className={`toggle-slider ${isTeacher ? 'teacher' : 'student'}`}></div>
        </div>
        <span className={`toggle-label ${isTeacher ? 'active' : ''}`}>Teacher</span>
      </div>

      {/* Login Forms */}
      <div className="forms-container">
        <div className={`form-wrapper ${!isTeacher ? 'active' : ''}`}>
          <h2>Student Login</h2>
          <form className="login-form">
            <input type="text" placeholder="Roll Number" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login as Student</button>
          </form>
        </div>

        <div className={`form-wrapper ${isTeacher ? 'active' : ''}`}>
          <h2>Teacher Login</h2>
          <form className="login-form">
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login as Teacher</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginToggle;
