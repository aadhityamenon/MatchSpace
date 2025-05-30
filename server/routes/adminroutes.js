const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Tutor = require('../models/Tutor');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const router = express.Router();

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Get dashboard statistics
router.get('/dashboard/stats', adminAuth, async (req, res) => {
  try {
    // Get current date for monthly stats
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // User statistics
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalTutors = await Tutor.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      role: 'student',
      createdAt: { $gte: firstDayOfMonth }
    });
    const newTutorsThisMonth = await Tutor.countDocuments({
      createdAt: { $gte: firstDayOfMonth }
    });

    // Booking statistics
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const monthlyBookings = await Booking.countDocuments({
      createdAt: { $gte: firstDayOfMonth }
    });

    // Revenue statistics
    const revenueStats = await Booking.aggregate([
      { 
        $match: { 
          status: 'completed',
          paymentStatus: 'paid' 
        } 
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          monthlyRevenue: {
            $sum: {
              $cond: [
                { $gte: ['$createdAt', firstDayOfMonth] },
                '$totalAmount',
                0
              ]
            }
          }
        }
      }
    ]);

    const revenue = revenueStats[0] || { totalRevenue: 0, monthlyRevenue: 0 };

    // Platform statistics
    const averageRating = await Review.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    // Recent activity
    const recentBookings = await Booking.find()
      .populate('student', 'name email')
      .populate('tutor', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find({ role: 'student' })
      .select('name email createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentTutors = await Tutor.find()
      .populate('userId', 'name email')  
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          users: {
            total: totalUsers,
            newThisMonth: newUsersThisMonth
          },
          tutors: {
            total: totalTutors,
            newThisMonth: newTutorsThisMonth
          },
          bookings: {
            total: totalBookings,
            completed: completedBookings,
            pending: pendingBookings,
            thisMonth: monthlyBookings
          },
          revenue: {
            total: revenue.totalRevenue,
            thisMonth: revenue.monthlyRevenue
          },
          platform: {
            averageRating: averageRating[0]?.avgRating || 0
          }
        },
        recentActivity: {
          bookings: recentBookings,
          users: recentUsers,
          tutors: recentTutors
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all users with pagination and filtering
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const role = req.query.role || '';

    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.isActive = status === 'active';
    }
    
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Get all tutors with detailed information
router.get('/tutors', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status || '';
    const search = req.query.search || '';

    let query = {};
    
    if (status) {
      query.approvalStatus = status;
    }

    const tutors = await Tutor.find(query)
      .populate('userId', 'name email isActive createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter by search if provided
    let filteredTutors = tutors;
    if (search) {
      filteredTutors = tutors.filter(tutor => 
        tutor.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        tutor.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
        tutor.subjects.some(subject => 
          subject.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    const total = await Tutor.countDocuments(query);

    res.json({
      success: true,
      data: {
        tutors: filteredTutors,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get tutors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tutors'
    });
  }
});

// Approve/reject tutor application
router.patch('/tutors/:id/approval', adminAuth, [
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('reason').optional().isString().withMessage('Reason must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, reason } = req.body;
    const tutorId = req.params.id;

    const tutor = await Tutor.findById(tutorId).populate('userId');
    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: 'Tutor not found'
      });
    }

    tutor.approvalStatus = status;
    tutor.approvalDate = new Date();
    tutor.approvedBy = req.user._id;
    
    if (reason) {
      tutor.rejectionReason = reason;
    }

    await tutor.save();

    // Update user's isTutor status if approved
    if (status === 'approved') {
      await User.findByIdAndUpdate(tutor.userId._id, { isTutor: true });
    }

    res.json({
      success: true,
      message: `Tutor application ${status} successfully`,
      data: tutor
    });
  } catch (error) {
    console.error('Tutor approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tutor approval status'
    });
  }
});

// Suspend/activate user account
router.patch('/users/:id/status', adminAuth, [
  body('isActive').isBoolean().withMessage('isActive must be a boolean'),
  body('reason').optional().isString().withMessage('Reason must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { isActive, reason } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = isActive;
    user.lastStatusChange = new Date();
    user.statusChangedBy = req.user._id;
    
    if (reason) {
      user.statusChangeReason = reason;
    }

    await user.save();

    res.json({
      success: true,
      message: `User account ${isActive ? 'activated' : 'suspended'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('User status update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status'
    });
  }
});

// Get all bookings with filtering
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status || '';
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;

    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (dateFrom || dateTo) {
      query.sessionDate = {};
      if (dateFrom) query.sessionDate.$gte = new Date(dateFrom);
      if (dateTo) query.sessionDate.$lte = new Date(dateTo);
    }

    const bookings = await Booking.find(query)
      .populate('student', 'name email')
      .populate('tutor', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings'
    });
  }
});

// Get platform analytics
router.get('/analytics', adminAuth, async (req, res) => {
  try {
    const period = req.query.period || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // User growth analytics
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          role: 'student'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Tutor growth analytics
    const tutorGrowth = await Tutor.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          approvalStatus: 'approved'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Revenue analytics
    const revenueAnalytics = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: 'completed',
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Popular subjects
    const popularSubjects = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$subject',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Top performing tutors
    const topTutors = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: '$tutor',
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'tutorInfo'
        }
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: {
        userGrowth,
        tutorGrowth,
        revenueAnalytics,
        popularSubjects,
        topTutors
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data'
    });
  }
});

// Get platform reports
router.get('/reports', adminAuth, async (req, res) => {
  try {
    const reportType = req.query.type || 'summary';
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

    let reportData = {};

    switch (reportType) {
      case 'financial':
        reportData = await generateFinancialReport(startDate, endDate);
        break;
      case 'user':
        reportData = await generateUserReport(startDate, endDate);
        break;
      case 'tutor':
        reportData = await generateTutorReport(startDate, endDate);
        break;
      default:
        reportData = await generateSummaryReport(startDate, endDate);
    }

    res.json({
      success: true,
      data: {
        reportType,
        period: { startDate, endDate },
        ...reportData
      }
    });
  } catch (error) {
    console.error('Reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report'
    });
  }
});

// Handle user disputes
router.post('/disputes', adminAuth, [
  body('userId').isMongoId().withMessage('Valid user ID required'),
  body('tutorId').optional().isMongoId().withMessage('Valid tutor ID required'),
  body('bookingId').optional().isMongoId().withMessage('Valid booking ID required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('priority').isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const dispute = {
      ...req.body,
      status: 'open',
      createdBy: req.user._id,
      createdAt: new Date()
    };

    // In a real app, you'd save this to a Dispute model
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Dispute created successfully',
      data: dispute
    });
  } catch (error) {
    console.error('Create dispute error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create dispute'
    });
  }
});

// Manage platform settings
router.get('/settings', adminAuth, async (req, res) => {
  try {
    // In a real app, you'd fetch from a Settings model
    const settings = {
      platform: {
        maintenanceMode: false,
        allowNewRegistrations: true,
        requireTutorApproval: true
      },
      payments: {
        platformCommission: 15,
        minimumWithdrawal: 50,
        paymentMethods: ['stripe', 'paypal']
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true
      }
    };

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch settings'
    });
  }
});

// Update platform settings
router.patch('/settings', adminAuth, async (req, res) => {
  try {
    const settings = req.body;
    
    // In a real app, you'd save to a Settings model
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings'
    });
  }
});

// Helper functions for reports
async function generateFinancialReport(startDate, endDate) {
  const bookings = await Booking.find({
    createdAt: { $gte: startDate, $lte: endDate },
    status: 'completed',
    paymentStatus: 'paid'
  });

  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const platformCommission = totalRevenue * 0.15; // 15% commission
  const tutorPayouts = totalRevenue - platformCommission;

  return {
    totalRevenue,
    platformCommission,
    tutorPayouts,
    totalBookings: bookings.length,
    averageBookingValue: bookings.length > 0 ? totalRevenue / bookings.length : 0
  };
}

async function generateUserReport(startDate, endDate) {
  const newUsers = await User.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate },
    role: 'student'
  });

  const activeUsers = await User.countDocuments({
    role: 'student',
    isActive: true,
    lastLogin: { $gte: startDate }
  });

  return {
    newUsers,
    activeUsers,
    totalUsers: await User.countDocuments({ role: 'student' })
  };
}

async function generateTutorReport(startDate, endDate) {
  const newTutors = await Tutor.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate }
  });

  const approvedTutors = await Tutor.countDocuments({
    approvalStatus: 'approved',
    approvalDate: { $gte: startDate, $lte: endDate }
  });

  return {
    newTutors,
    approvedTutors,
    totalTutors: await Tutor.countDocuments({ approvalStatus: 'approved' })
  };
}

async function generateSummaryReport(startDate, endDate) {
  const [financial, user, tutor] = await Promise.all([
    generateFinancialReport(startDate, endDate),
    generateUserReport(startDate, endDate),
    generateTutorReport(startDate, endDate)
  ]);

  return { financial, user, tutor };
}

module.exports = router;