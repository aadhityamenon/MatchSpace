const express = require('express');
const { check, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Availability = require('../models/Availability');
const Tutor = require('../models/Tutor');
const User = require('../models/User');
const router = express.Router();

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', [
  check('availabilityId', 'Availability ID is required').not().isEmpty(),
  check('tutorId', 'Tutor ID is required').not().isEmpty(),
  check('subject', 'Subject is required').not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { availabilityId, tutorId, subject, description } = req.body;
    const studentId = req.user.userId;

    // Check if availability exists and is not booked
    const availability = await Availability.findById(availabilityId);
    if (!availability) {
      return res.status(404).json({ message: 'Availability slot not found' });
    }

    if (availability.isBooked) {
      return res.status(400).json({ message: 'This time slot has already been booked' });
    }

    // Get tutor to calculate amount
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Calculate session duration and amount
    const startTime = availability.startTime;
    const endTime = availability.endTime;
    const durationHours = (endTime - startTime) / (1000 * 60 * 60);
    const amount = durationHours * tutor.hourlyRate;

    // Create new booking
    const booking = new Booking({
      student: studentId,
      tutor: tutorId,
      availability: availabilityId,
      startTime,
      endTime,
      subject,
      description,
      amount,
      status: 'confirmed'
    });

    await booking.save();

    // Populate booking with related data
    const populatedBooking = await Booking.findById(booking._id)
      .populate('student', 'firstName lastName email')
      .populate({
        path: 'tutor',
        populate: {
          path: 'user',
          select: 'firstName lastName email'
        }
      });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: populatedBooking
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
});

// @route   GET /api/bookings
// @desc    Get bookings for current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const userId = req.user.userId;
    const { studentId, tutorId, status } = req.query;

    // Build query
    let query = {};
    
    if (studentId) {
      query.student = studentId;
    } else if (tutorId) {
      // Find tutor profile for this user
      const tutorProfile = await Tutor.findOne({ user: userId });
      if (tutorProfile) {
        query.tutor = tutorProfile._id;
      }
    } else {
      // Get bookings for current user (as student or tutor)
      const user = await User.findById(userId);
      const tutorProfile = await Tutor.findOne({ user: userId });
      
      if (user.role === 'student') {
        query.student = userId;
      } else if (tutorProfile) {
        query.tutor = tutorProfile._id;
      }
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('student', 'firstName lastName email')
      .populate({
        path: 'tutor',
        populate: {
          path: 'user',
          select: 'firstName lastName email'
        }
      })
      .sort({ createdAt: -1 });

    // Transform bookings for frontend
    const transformedBookings = bookings.map(booking => ({
      id: booking._id,
      studentName: `${booking.student.firstName} ${booking.student.lastName}`,
      tutorName: booking.tutor.user ? `${booking.tutor.user.firstName} ${booking.tutor.user.lastName}` : 'Unknown',
      subject: booking.subject,
      description: booking.description,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      amount: booking.amount,
      paymentStatus: booking.paymentStatus,
      rating: booking.rating,
      createdAt: booking.createdAt
    }));

    res.json(transformedBookings);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('student', 'firstName lastName email')
      .populate({
        path: 'tutor',
        populate: {
          path: 'user',
          select: 'firstName lastName email'
        }
      });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has access to this booking
    const userId = req.user.userId;
    const tutorProfile = await Tutor.findOne({ user: userId });
    
    const hasAccess = booking.student._id.toString() === userId || 
                     (tutorProfile && booking.tutor._id.toString() === tutorProfile._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching booking' });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking status
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { status, meetingLink } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has permission to update this booking
    const userId = req.user.userId;
    const tutorProfile = await Tutor.findOne({ user: userId });
    
    const hasAccess = booking.student.toString() === userId || 
                     (tutorProfile && booking.tutor.toString() === tutorProfile._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update booking
    if (status) booking.status = status;
    if (meetingLink) booking.meetingLink = meetingLink;

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('student', 'firstName lastName email')
      .populate({
        path: 'tutor',
        populate: {
          path: 'user',
          select: 'firstName lastName email'
        }
      });

    res.json({
      message: 'Booking updated successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating booking' });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel booking
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has permission to cancel this booking
    const userId = req.user.userId;
    const tutorProfile = await Tutor.findOne({ user: userId });
    
    const hasAccess = booking.student.toString() === userId || 
                     (tutorProfile && booking.tutor.toString() === tutorProfile._id.toString());

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Cancel the booking
    await booking.cancel(reason || 'Cancelled by user');

    res.json({ message: 'Booking cancelled successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error cancelling booking' });
  }
});

// @route   POST /api/bookings/:id/ratings
// @desc    Add rating to booking
// @access  Private
router.post('/:id/ratings', [
  check('score', 'Rating score is required and must be between 1 and 5').isInt({ min: 1, max: 5 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { score, comment } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only students can rate bookings
    const userId = req.user.userId;
    if (booking.student.toString() !== userId) {
      return res.status(403).json({ message: 'Only the student can rate this booking' });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed sessions' });
    }

    // Add rating to booking
    await booking.addRating(score, comment);

    // Update tutor's average rating
    const tutor = await Tutor.findById(booking.tutor);
    if (tutor) {
      await tutor.updateRating(score);
    }

    res.json({ message: 'Rating added successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding rating' });
  }
});

module.exports = router;