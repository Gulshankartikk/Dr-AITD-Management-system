const Notification = require('../models/Notification');
const { Student, Teacher, Course } = require('../models/CompleteModels');

// Create notification
const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();
    return notification;
  } catch (error) {
    throw error;
  }
};

// Get notifications for user
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {
      isActive: true,
      $or: [
        { 'recipients.type': 'all' },
        { 'recipients.userIds': userId }
      ]
    };

    // Add role-specific filters
    if (role === 'teacher') {
      query.$or.push({ 'recipients.type': 'teachers' });
    } else if (role === 'student') {
      query.$or.push({ 'recipients.type': 'students' });
      
      // Get student's course for course-specific notifications
      const student = await Student.findById(userId);
      if (student && student.courseId) {
        query.$or.push({ 'recipients.courseId': student.courseId });
      }
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('recipients.courseId', 'courseName courseCode')
      .populate('recipients.subjectId', 'subjectName subjectCode');

    // Mark notifications as read
    const notificationIds = notifications.map(n => n._id);
    await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { $addToSet: { readBy: { userId, readAt: new Date() } } }
    );

    // Get unread count
    const unreadCount = await Notification.countDocuments({
      ...query,
      'readBy.userId': { $ne: userId }
    });

    res.json({
      success: true,
      notifications,
      pagination: {
        page,
        limit,
        total: notifications.length,
        unreadCount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.query;

    let query = {
      isActive: true,
      'readBy.userId': { $ne: userId },
      $or: [
        { 'recipients.type': 'all' },
        { 'recipients.userIds': userId }
      ]
    };

    if (role === 'teacher') {
      query.$or.push({ 'recipients.type': 'teachers' });
    } else if (role === 'student') {
      query.$or.push({ 'recipients.type': 'students' });
      
      const student = await Student.findById(userId);
      if (student && student.courseId) {
        query.$or.push({ 'recipients.courseId': student.courseId });
      }
    }

    const unreadCount = await Notification.countDocuments(query);

    res.json({ success: true, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;

    await Notification.findByIdAndUpdate(
      notificationId,
      { $addToSet: { readBy: { userId, readAt: new Date() } } }
    );

    res.json({ success: true, msg: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// Helper function to send notifications
const sendNotification = async (type, data) => {
  try {
    let notificationData = {
      type,
      sender: data.sender,
      isActive: true
    };

    switch (type) {
      case 'notice':
        notificationData = {
          ...notificationData,
          title: 'New Notice Posted',
          message: `${data.sender.name} posted a new notice: ${data.title}`,
          recipients: {
            type: 'course',
            courseId: data.courseId
          },
          relatedData: {
            entityType: 'notice',
            entityId: data.entityId
          }
        };
        break;

      case 'assignment':
        notificationData = {
          ...notificationData,
          title: 'New Assignment Added',
          message: `${data.sender.name} added a new assignment: ${data.title}`,
          recipients: {
            type: 'course',
            courseId: data.courseId,
            subjectId: data.subjectId
          },
          relatedData: {
            entityType: 'assignment',
            entityId: data.entityId
          }
        };
        break;

      case 'material':
        notificationData = {
          ...notificationData,
          title: 'New Study Material',
          message: `${data.sender.name} uploaded new study material: ${data.title}`,
          recipients: {
            type: 'course',
            courseId: data.courseId,
            subjectId: data.subjectId
          },
          relatedData: {
            entityType: 'material',
            entityId: data.entityId
          }
        };
        break;

      case 'attendance':
        notificationData = {
          ...notificationData,
          title: 'Attendance Marked',
          message: `${data.sender.name} marked attendance for ${data.subjectName}`,
          recipients: {
            type: 'course',
            courseId: data.courseId,
            subjectId: data.subjectId
          },
          relatedData: {
            entityType: 'attendance',
            entityId: data.entityId
          }
        };
        break;

      case 'marks':
        notificationData = {
          ...notificationData,
          title: 'Marks Updated',
          message: `${data.sender.name} updated marks for ${data.subjectName}`,
          recipients: {
            type: 'specific',
            userIds: [data.studentId]
          },
          relatedData: {
            entityType: 'marks',
            entityId: data.entityId
          }
        };
        break;
    }

    return await createNotification(notificationData);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  sendNotification
};