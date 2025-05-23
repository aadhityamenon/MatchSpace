const express = require('express');
const { check, validationResult } = require('express-validator');
const Tutor = require('../models/Tutor');
const User = require('../models/User');
const Availability = require('../models/Availability');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Multer setup for verification document uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/verificationDocs/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

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

// ======================
// TUTOR VERIFICATION ROUTES
// ======================

// @route   POST /api/tutors/upload-doc/:tutorId
// @desc    Tutor uploads a verification document
// @access  Private (tutor)
router.post('/upload-doc/:tutorId', auth, upload.single('doc'), async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.tutorId);
    if (!tutor) return res.status(404).json({ error: 'Tutor not found' });
    // Only allow the tutor themselves to upload
    if (tutor.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    tutor.verificationDocs.push(req.file.path);
    tutor.verified = false; // Set to false until admin reviews
    await tutor.save();
    res.json({ message: 'Document uploaded, pending admin review.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/tutors/verify/:tutorId
// @desc    Admin approves tutor verification
// @access  Private (admin) - you should add admin auth in production
router.post('/verify/:tutorId', auth, async (req, res) => {
  try {
    // TODO: Add admin check here
    const tutor = await Tutor.findById(req.params.tutorId);
    if (!tutor) return res.status(404).json({ error: 'Tutor not found' });
    tutor.verified = true;
    await tutor.save();
    res.json({ message: 'Tutor verified successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/tutors/reject/:tutorId
// @desc    Admin rejects tutor verification
// @access  Private (admin) - you should add admin auth in production
router.post('/reject/:tutorId', auth, async (req, res) => {
  try {
    // TODO: Add admin check here
    const tutor = await Tutor.findById(req.params.tutorId);
    if (!tutor) return res.status(404).json({ error: 'Tutor not found' });
    tutor.verified = false;
    await tutor.save();
    res.json({ message: 'Tutor verification rejected.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ======================
// EXISTING ROUTES BELOW
// ======================

// @route   GET /api/tutors
// @desc    Get all tutors with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { subject, minRating, maxRate, area, page = 1, limit = 10 } = req.query;
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
      isActive: tutor.isActive,
      verified: tutor.verified,
      verificationDocs: tutor.verificationDocs
    };
    res.json(transformedTutor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching tutor' });
  }
});

// ... (rest of your existing routes remain unchanged)

module.exports = router;
