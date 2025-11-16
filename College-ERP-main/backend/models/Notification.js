const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['notice', 'attendance', 'assignment', 'marks', 'material', 'general'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  sender: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'teacher'],
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  recipients: {
    type: {
      type: String,
      enum: ['all', 'teachers', 'students', 'course', 'specific'],
      required: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    userIds: [{
      type: mongoose.Schema.Types.ObjectId
    }]
  },
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  relatedData: {
    entityType: {
      type: String,
      enum: ['assignment', 'notice', 'material', 'attendance', 'marks']
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better performance
NotificationSchema.index({ 'recipients.type': 1, 'recipients.courseId': 1 });
NotificationSchema.index({ 'sender.id': 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ isActive: 1 });

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;