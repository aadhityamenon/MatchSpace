const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const Notification = require('../models/Notification');
const User = require('../models/User');

const router = express.Router();

// Get user notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const skip = (page - 1) * limit;

    const query = { recipient: req.user.userId };
    if (unreadOnly === 'true') {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      recipient: req.user.userId,
      read: false
    });

    res.json({
      notifications,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalNotifications: total,
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.patch('/:notificationId/read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.notificationId,
      recipient: req.user.userId
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Failed to mark notification as read' });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.userId, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ message: 'Failed to mark all notifications as read' });
  }
});

// Delete notification
router.delete('/:notificationId', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.notificationId,
      recipient: req.user.userId
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Failed to delete notification' });
  }
});

// Get notification settings
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    const settings = user.notificationSettings || {
      email: {
        bookingConfirmation: true,
        bookingReminder: true,
        paymentConfirmation: true,
        messageReceived: true,
        profileUpdates: false
      },
      push: {
        bookingConfirmation: true,
        bookingReminder: true,
        paymentConfirmation: true,
        messageReceived: true,
        profileUpdates: false
      }
    };

    res.json(settings);
  } catch (error) {
    console.error('Get notification settings error:', error);
    res.status(500).json({ message: 'Failed to fetch notification settings' });
  }
});

// Update notification settings
router.put('/settings', authenticateToken, async (req, res) => {
  try {
    const { email, push } = req.body;
    
    const user = await User.findById(req.user.userId);
    user.notificationSettings = {
      email: email || {},
      push: push || {}
    };
    
    await user.save();

    res.json({ 
      message: 'Notification settings updated successfully',
      settings: user.notificationSettings
    });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({ message: 'Failed to update notification settings' });
  }
});

// Create notification (internal use)
const createNotification = async (data) => {
  try {
    const notification = new Notification(data);
    await notification.save();
    
    // You could add real-time notification here using WebSocket
    // io.to(data.recipient).emit('newNotification', notification);
    
    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

// Notification helper functions
const NotificationHelpers = {
  // Booking related notifications
  async sendBookingConfirmation(studentId, tutorId, booking) {
    await Promise.all([
      createNotification({
        type: 'booking_confirmed',
        title: 'Booking Confirmed',
        message: `Your tutoring session has been confirmed for ${new Date(booking.dateTime).toLocaleDateString()}`,
        recipient: studentId,
        sender: tutorId,
        relatedId: booking._id,
        relatedModel: 'Booking'
      }),
      createNotification({
        type: 'new_booking',
        title: 'New Booking Request',
        message: `You have a new tutoring session scheduled for ${new Date(booking.dateTime).toLocaleDateString()}`,
        recipient: tutorId,
        sender: studentId,
        relatedId: booking._id,
        relatedModel: 'Booking'
      })
    ]);
  },

  async sendBookingReminder(userId, booking) {
    await createNotification({
      type: 'booking_reminder',
      title: 'Session Reminder',
      message: `Your tutoring session is scheduled for ${new Date(booking.dateTime).toLocaleString()}`,
      recipient: userId,
      relatedId: booking._id,
      relatedModel: 'Booking',
      priority: 'high'
    });
  },

  async sendPaymentConfirmation(studentId, tutorId, payment) {
    await Promise.all([
      createNotification({
        type: 'payment_received',
        title: 'Payment Received',
        message: `Payment of $${payment.amount} has been processed successfully`,
        recipient: studentId,
        relatedId: payment._id,
        relatedModel: 'Payment'
      }),
      createNotification({
        type: 'earning_received',
        title: 'Payment Received',
        message: `You've received payment of ${payment.tutorEarnings} for your tutoring session`,
        recipient: tutorId,
        relatedId: payment._id,
        relatedModel: 'Payment'
      })
    ]);
  },

  async sendMessageNotification(senderId, recipientId, message) {
    await createNotification({
      type: 'message_received',
      title: 'New Message',
      message: `You have a new message: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`,
      recipient: recipientId,
      sender: senderId,
      relatedId: null, // You might want to relate this to a message ID
      relatedModel: 'Message'
    });
  },

  async sendProfileApprovalNotification(userId, approved) {
    await createNotification({
      type: approved ? 'profile_approved' : 'profile_rejected',
      title: approved ? 'Profile Approved' : 'Profile Needs Updates',
      message: approved 
        ? 'Your tutor profile has been approved! You can now receive bookings.'
        : 'Your tutor profile needs some updates before approval. Please check your profile.',
      recipient: userId,
      priority: 'high'
    });
  },

  async sendSessionCancellation(studentId, tutorId, booking) {
    await Promise.all([
      createNotification({
        type: 'session_cancelled',
        title: 'Session Cancelled',
        message: `Your tutoring session scheduled for ${new Date(booking.dateTime).toLocaleDateString()} has been cancelled`,
        recipient: studentId,
        sender: tutorId,
        relatedId: booking._id,
        relatedModel: 'Booking',
        priority: 'high'
      }),
      createNotification({
        type: 'session_cancelled',
        title: 'Session Cancelled',
        message: `Your tutoring session scheduled for ${new Date(booking.dateTime).toLocaleDateString()} has been cancelled`,
        recipient: tutorId,
        sender: studentId,
        relatedId: booking._id,
        relatedModel: 'Booking',
        priority: 'high'
      })
    ]);
  },

  async sendSystemNotification(userId, title, message, priority = 'normal') {
    await createNotification({
      type: 'system',
      title,
      message,
      recipient: userId,
      priority
    });
  }
};

// Bulk send notifications (admin only)
router.post('/bulk-send', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { recipients, title, message, type = 'system', priority = 'normal' } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ message: 'Recipients array is required' });
    }

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    const notifications = recipients.map(recipientId => ({
      type,
      title,
      message,
      recipient: recipientId,
      sender: req.user.userId,
      priority
    }));

    await Notification.insertMany(notifications);

    res.json({ 
      message: `Notifications sent to ${recipients.length} users successfully`,
      count: recipients.length
    });
  } catch (error) {
    console.error('Bulk send notifications error:', error);
    res.status(500).json({ message: 'Failed to send bulk notifications' });
  }
});

// Get notification statistics (admin only)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const stats = await Notification.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          unreadCount: {
            $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] }
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalNotifications = await Notification.countDocuments();
    const totalUnread = await Notification.countDocuments({ read: false });

    res.json({
      totalNotifications,
      totalUnread,
      byType: stats
    });
  } catch (error) {
    console.error('Notification stats error:', error);
    res.status(500).json({ message: 'Failed to fetch notification statistics' });
  }
});

// Test notification endpoint (development only)
if (process.env.NODE_ENV === 'development') {
  router.post('/test', authenticateToken, async (req, res) => {
    try {
      const { type, title, message, priority } = req.body;
      
      const notification = await createNotification({
        type: type || 'test',
        title: title || 'Test Notification',
        message: message || 'This is a test notification',
        recipient: req.user.userId,
        priority: priority || 'normal'
      });

      res.json({ 
        message: 'Test notification created',
        notification 
      });
    } catch (error) {
      console.error('Test notification error:', error);
      res.status(500).json({ message: 'Failed to create test notification' });
    }
  });
}

module.exports = { router, NotificationHelpers };