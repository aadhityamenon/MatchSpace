const express = require('express');
const { check, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Tutor = require('../models/Tutor');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');
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

// @route   GET /api/reviews/tutor/:tutorId
// @desc    Get all reviews for a tutor
// @access  Public
router.get('/tutor/:tutorId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const tutorId = req.params.tutorId;

    const reviews = await Review.find({ tutor: tutorId })
      .populate('student', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ tutor: tutorId });

    const transformedReviews = reviews.map(review => ({
      id: review._id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      student: {
        name: `${review.student.firstName} ${review.student.lastName}`,
        profilePicture: review.student.profilePicture
      }
    }));

    res.json({
      reviews: transformedReviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalReviews: total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
});

// @route   POST /api/reviews
// @desc    Create a review for a tutor
// @access  Private
router.post('/', auth, [
  check('tutor', 'Tutor ID is required').not().isEmpty(),
  check('booking', 'Booking ID is required').not().isEmpty(),
  check('rating', 'Rating is required and must be between 1-5').isInt({ min: 1, max: 5 }),
  check('comment', 'Comment is required').not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const studentId = req.user.userId;
    const { tutor, booking, rating, comment } = req.body;

    // Verify booking exists and belongs to student
    const existingBooking = await Booking.findById(booking);
    if (!existingBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (existingBooking.student.toString() !== studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (existingBooking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed sessions' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ 
      student: studentId, 
      tutor, 
      booking 
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    // Create review
    const review = new Review({
      student: studentId,
      tutor,
      booking,
      rating,
      comment
    });

    await review.save();

    // Update tutor's average rating
    await updateTutorRating(tutor);

    // Populate the review for response
    await review.populate('student', 'firstName lastName profilePicture');

    res.status(201).json({
      message: 'Review created successfully',
      review: {
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        student: {
          name: `${review.student.firstName} ${review.student.lastName}`,
          profilePicture: review.student.profilePicture
        }
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating review' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', auth, [
  check('rating', 'Rating must be between 1-5').optional().isInt({ min: 1, max: 5 }),
  check('comment', 'Comment cannot be empty').optional().not().isEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const reviewId = req.params.id;
    const studentId = req.user.userId;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.student.toString() !== studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update review
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    // Update tutor's average rating
    await updateTutorRating(review.tutor);

    res.json({
      message: 'Review updated successfully',
      review: {
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating review' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const studentId = req.user.userId;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.student.toString() !== studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const tutorId = review.tutor;
    await Review.findByIdAndDelete(reviewId);

    // Update tutor's average rating
    await updateTutorRating(tutorId);

    res.json({ message: 'Review deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting review' });
  }
});

// Helper function to update tutor's average rating
async function updateTutorRating(tutorId) {
  try {
    const reviews = await Review.find({ tutor: tutorId });
    
    if (reviews.length === 0) {
      await Tutor.findByIdAndUpdate(tutorId, {
        averageRating: 0,
        totalRatings: 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Tutor.findByIdAndUpdate(tutorId, {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      totalRatings: reviews.length
    });

  } catch (error) {
    console.error('Error updating tutor rating:', error);
  }
}

module.exports = router;