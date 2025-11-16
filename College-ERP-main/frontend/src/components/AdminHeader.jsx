import React from 'react';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import NotificationBell from './NotificationBell';
import './AdminHeader.css';

const AdminHeader = () => {
  const token = Cookies.get('token');
  let userId = null;
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  return (
    <div className="admin-header">
      <div className="header-left">
        <h1>College ERP Admin Panel</h1>
      </div>
      <div className="header-right">
        <div className="header-actions">
          {userId && <NotificationBell userId={userId} userRole="admin" />}
        </div>
        <div className="creation-details">
          <div className="detail-item">
            <span className="label">Created by:</span>
            <span className="value">System Administrator</span>
          </div>
          <div className="detail-item">
            <span className="label">Version:</span>
            <span className="value">v1.0.0</span>
          </div>
          <div className="detail-item">
            <span className="label">Created:</span>
            <span className="value">2024-01-01</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;