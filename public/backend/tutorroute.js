const express = require('express');
const { check, validationResult } = require('express-validator');
const Tutor = require('../models/Tutor');
const User = require('../models/User');
const Availability = require('../models/Availability');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Auth middleware for tutor routes
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

// @route   GET /api/tutors
// @desc    Get all tutors with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { subject, minRating, maxRate, area, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = { isApproved: true, isActive: true };
    
    if (subject) {
      query.subjects = { $in: [new RegExp(subject, 'i')] };
    }
    
    if (minRating) {
      query.averageRating = { $gte: parseFloat(minRating) };
    }
    
    if (maxRate) {
      query.hourlyRate = { $lte: parseFloat(maxRate) };
    }
    
    if (area) {
      query.areas = { $in: [new RegExp(area, 'i')] };
    }

    const tutors = await Tutor.find(query)
      .populate('user', 'firstName lastName profilePicture bio')
      .sort({ averageRating: -1, totalRatings: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Tutor.countDocuments(query);

    // Transform data for frontend
    const transformedTutors = tutors.map(tutor => ({
      id: tutor._id,
      name: `${tutor.user.firstName} ${tutor.user.lastName}`,
      subjects: tutor.subjects,
      hourlyRate: tutor.hourlyRate,
      averageRating: tutor.averageRating,
      totalRatings: tutor.totalRatings,
      description: tutor.description,
      educationLevel: tutor.educationLevel,
      yearsOfExperience: tutor.yearsOfExperience,
      areas: tutor.areas,
      profilePicture: tutor.user.profilePicture,
      bio: tutor.user.bio,
      tags: tutor.tags
    }));

    res.json({
      tutors: transformedTutors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalTutors: total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching tutors' });
  }
});

// @route   GET /api/tutors/:id
// @desc    Get single tutor by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id)
      .populate('user', 'firstName lastName profilePicture bio phone email');

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Transform data for frontend
    const transformedTutor = {
      id: tutor._id,
      name: `${tutor.user.firstName} ${tutor.user.lastName}`,
      email: tutor.user.email,
      phone: tutor.user.phone,
      profilePicture: tutor.user.profilePicture,
      bio: tutor.user.bio,
      subjects: tutor.subjects,
      hourlyRate: tutor.hourlyRate,
      averageRating: tutor.averageRating,
      totalRatings: tutor.totalRatings,
      description: tutor.description,
      educationLevel: tutor.educationLevel,
      yearsOfExperience: tutor.yearsOfExperience,
      areas: tutor.areas,
      certifications: tutor.certifications,
      education: tutor.education,
      tags: tutor.tags,
      isApproved: tutor.isApproved,
      isActive: tutor.isActive
    };

    res.json(transformedTutor);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching tutor' });
  }
});

// @route   POST /api/tutors/apply
// @desc    Apply to become a tutor
// @access  Private
router.post('/apply', auth, [
  check('subjects', 'At least one subject is required').isArray({ min: 1 }),
  check('educationLevel', 'Education level is required').not().isEmpty(),
  check('hourlyRate', 'Hourly rate is required').isNumeric(),
  check('description', 'Description is required').not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.userId;

    // Check if user already has a tutor profile
    const existingTutor = await Tutor.findOne({ user: userId });
    if (existingTutor) {
      return res.status(400).json({ message: 'You already have a tutor profile' });
    }

    const {
      subjects,
      educationLevel,
      yearsOfExperience,
      hourlyRate,
      areas,
      description,
      certifications,
      education,
      tags
    } = req.body;

    // Create new tutor profile
    const tutor = new Tutor({
      user: userId,
      subjects,
      educationLevel,
      yearsOfExperience: yearsOfExperience || 0,
      hourlyRate,
      areas,
      description,
      certifications,
      education,
      tags
    });

    await tutor.save();

    // Update user role to tutor
    await User.findByIdAndUpdate(userId, { role: 'tutor' });

    res.status(201).json({
      message: 'Tutor application submitted successfully',
      tutor: tutor.getProfile()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating tutor profile' });
  }
});

// @route   PUT /api/tutors/:id
// @desc    Update tutor profile
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const tutorId = req.params.id;
    const userId = req.user.userId;

    // Find tutor and verify ownership
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }

    if (tutor.user.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const {
      subjects,
      educationLevel,
      yearsOfExperience,
      hourlyRate,
      areas,
      description,
      certifications,
      education,
      tags
    } = req.body;

    // Update tutor profile
    if (subjects) tutor.subjects = subjects;
    if (educationLevel) tutor.educationLevel = educationLevel;
    if (yearsOfExperience !== undefined) tutor.yearsOfExperience = yearsOfExperience;
    if (hourlyRate) tutor.hourlyRate = hourlyRate;
    if (areas) tutor.areas = areas;
    if (description) tutor.description = description;
    if (certifications) tutor.certifications = certifications;
    if (education) tutor.education = education;
    if (tags) tutor.tags = tags;

    await tutor.save();

    res.json({
      message: 'Tutor profile updated successfully',
      tutor: tutor.getProfile()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating tutor profile' });
  }
});

// @route   GET /api/tutors/:id/availabilities
// @desc    Get tutor availabilities
// @access  Public
router.get('/:id/availabilities', async (req, res) => {
  try {
    const tutorId = req.params.id;
    const { startDate, endDate } = req.query;

    let query = { tutor: tutorId, isBooked: false };
    
    // Filter by date range if provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const availabilities = await Availability.find(query)
      .sort({ date: 1, startTime: 1 });

    res.json(availabilities);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching availabilities' });
  }
});

// @route   POST /api/tutors/:id/availabilities
// @desc    Create tutor availability
// @access  Private
router.post('/:id/availabilities', auth, [
  check('date', 'Date is required').isISO8601(),
  check('startTime', 'Start time is required').not().isEmpty(),
  check('endTime', 'End time is required').not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tutorId = req.params.id;
    const userId = req.user.userId;

    // Verify tutor ownership
    const tutor = await Tutor.findById(tutorId);
    if (!tutor || tutor.user.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { date, startTime, endTime } = req.body;

    // Check for overlapping availability
    const existingAvailability = await Availability.findOne({
      tutor: tutorId,
      date: new Date(date),
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (existingAvailability) {
      return res.status(400).json({ message: 'Overlapping availability exists' });
    }

    const availability = new Availability({
      tutor: tutorId,
      date: new Date(date),
      startTime,
      endTime
    });

    await availability.save();

    res.status(201).json({
      message: 'Availability created successfully',
      availability
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating availability' });
  }
});

// @route   PUT /api/tutors/:id/availabilities/:availId
// @desc    Update tutor availability
// @access  Private
router.put('/:id/availabilities/:availId', auth, async (req, res) => {
  try {
    const tutorId = req.params.id;
    const availId = req.params.availId;
    const userId = req.user.userId;

    // Verify tutor ownership
    const tutor = await Tutor.findById(tutorId);
    if (!tutor || tutor.user.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const availability = await Availability.findById(availId);
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    if (availability.isBooked) {
      return res.status(400).json({ message: 'Cannot update booked availability' });
    }

    const { date, startTime, endTime } = req.body;

    if (date) availability.date = new Date(date);
    if (startTime) availability.startTime = startTime;
    if (endTime) availability.endTime = endTime;

    await availability.save();

    res.json({
      message: 'Availability updated successfully',
      availability
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating availability' });
  }
});

// @route   DELETE /api/tutors/:id/availabilities/:availId
// @desc    Delete tutor availability
// @access  Private
router.delete('/:id/availabilities/:availId', auth, async (req, res) => {
  try {
    const tutorId = req.params.id;
    const availId = req.params.availId;
    const userId = req.user.userId;

    // Verify tutor ownership
    const tutor = await Tutor.findById(tutorId);
    if (!tutor || tutor.user.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const availability = await Availability.findById(availId);
    if (!availability) {
      return res.status(404).json({ message: 'Availability not found' });
    }

    if (availability.isBooked) {
      return res.status(400).json({ message: 'Cannot delete booked availability' });
    }

    await Availability.findByIdAndDelete(availId);

    res.json({ message: 'Availability deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting availability' });
  }
});

// @route   GET /api/tutors/profile/me
// @desc    Get current tutor's profile
// @access  Private
router.get('/profile/me', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const tutor = await Tutor.findOne({ user: userId })
      .populate('user', 'firstName lastName email phone profilePicture bio');

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor profile not found' });
    }

    res.json({
      id: tutor._id,
      name: `${tutor.user.firstName} ${tutor.user.lastName}`,
      email: tutor.user.email,
      phone: tutor.user.phone,
      profilePicture: tutor.user.profilePicture,
      bio: tutor.user.bio,
      subjects: tutor.subjects,
      hourlyRate: tutor.hourlyRate,
      averageRating: tutor.averageRating,
      totalRatings: tutor.totalRatings,
      description: tutor.description,
      educationLevel: tutor.educationLevel,
      yearsOfExperience: tutor.yearsOfExperience,
      areas: tutor.areas,
      certifications: tutor.certifications,
      education: tutor.education,
      tags: tutor.tags,
      isApproved: tutor.isApproved,
      isActive: tutor.isActive,
      createdAt: tutor.createdAt
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching tutor profile' });
  }
});

module.exports = router;