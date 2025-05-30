const express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Tutor = require('../models/Tutor');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Auth middleware
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profilePicture: user.profilePicture,
      bio: user.bio,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  check('firstName', 'First name is required').optional().not().isEmpty(),
  check('lastName', 'Last name is required').optional().not().isEmpty(),
  check('email', 'Please include a valid email').optional().isEmail(),
  check('phone', 'Phone number is required').optional().not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { firstName, lastName, email, phone, bio } = req.body;

    // Check if email is already taken by another user
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;  
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePicture: user.profilePicture,
        bio: user.bio
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, [
  check('currentPassword', 'Current password is required').not().isEmpty(),
  check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error changing password' });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let dashboardData = {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    };

    if (user.role === 'student') {
      // Get student bookings
      const bookings = await Booking.find({ student: userId })
        .populate('tutor')
        .populate({
          path: 'tutor',
          populate: {
            path: 'user',
            select: 'firstName lastName profilePicture'
          }
        })
        .sort({ createdAt: -1 })
        .limit(5);

      dashboardData.recentBookings = bookings.map(booking => ({
        id: booking._id,
        tutorName: `${booking.tutor.user.firstName} ${booking.tutor.user.lastName}`,
        subject: booking.subject,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status,
        totalAmount: booking.totalAmount
      }));

      dashboardData.totalBookings = await Booking.countDocuments({ student: userId });
      dashboardData.completedSessions = await Booking.countDocuments({ 
        student: userId, 
        status: 'completed' 
      });

    } else if (user.role === 'tutor') {
      // Get tutor profile
      const tutorProfile = await Tutor.findOne({ user: userId });
      
      if (tutorProfile) {
        // Get tutor bookings
        const bookings = await Booking.find({ tutor: tutorProfile._id })
          .populate('student', 'firstName lastName profilePicture')
          .sort({ createdAt: -1 })
          .limit(5);

        dashboardData.tutorProfile = {
          id: tutorProfile._id,
          subjects: tutorProfile.subjects,
          hourlyRate: tutorProfile.hourlyRate,
          averageRating: tutorProfile.averageRating,
          totalRatings: tutorProfile.totalRatings,
          isApproved: tutorProfile.isApproved,
          isActive: tutorProfile.isActive
        };

        dashboardData.recentBookings = bookings.map(booking => ({
          id: booking._id,
          studentName: `${booking.student.firstName} ${booking.student.lastName}`,
          subject: booking.subject,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          status: booking.status,
          totalAmount: booking.totalAmount
        }));

        dashboardData.totalBookings = await Booking.countDocuments({ tutor: tutorProfile._id });
        dashboardData.completedSessions = await Booking.countDocuments({ 
          tutor: tutorProfile._id, 
          status: 'completed' 
        });

        // Calculate total earnings
        const completedBookings = await Booking.find({ 
          tutor: tutorProfile._id, 
          status: 'completed' 
        });
        dashboardData.totalEarnings = completedBookings.reduce((sum, booking) => 
          sum + booking.totalAmount, 0
        );
      }
    }

    res.json(dashboardData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching dashboard data' });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', auth, [
  check('password', 'Password is required for account deletion').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;
    const { password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    // Check for active bookings
    const activeBookings = await Booking.countDocuments({
      $or: [
        { student: userId, status: { $in: ['pending', 'confirmed'] } },
        { tutor: userId, status: { $in: ['pending', 'confirmed'] } }
      ]
    });

    if (activeBookings > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete account with active bookings. Please complete or cancel them first.' 
      });
    }

    // Delete associated data
    if (user.role === 'tutor') {
      const tutorProfile = await Tutor.findOne({ user: userId });
      if (tutorProfile) {
        await Tutor.findByIdAndDelete(tutorProfile._id);
      }
    }

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting account' });
  }
});

module.exports = router;