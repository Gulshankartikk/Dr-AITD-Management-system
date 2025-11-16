const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/Auth');
const {
  getUserNotifications,
  getUnreadCount,
  markAsRead
} = require('../controller/notificationController');

// Get user notifications
router.get('/:userId', verifyToken, getUserNotifications);

// Get unread count
router.get('/:userId/unread-count', verifyToken, getUnreadCount);

// Mark notification as read
router.put('/:notificationId/read', verifyToken, markAsRead);

module.exports = router;