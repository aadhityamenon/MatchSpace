// server/routes/authroutes.js

const express = require('express');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
// Import your authentication middleware
const { authenticateToken, authorizeRoles } = require('../authMiddleware'); // Correct path relative to authroutes.js
const router = express.Router();

// Generate JWT token (existing)
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Generate refresh token (existing)
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  check('firstName', 'First name is required').not().isEmpty(),
  check('lastName', 'Last name is required').not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, role = 'student' } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role
    });

    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user (consider if you always need to save it here for initial register)
    user.refreshToken = refreshToken; // This will trigger pre('save') hash again if password was changed
    // IMPORTANT: If you hash on pre('save') AND you modify user.refreshToken, you need to ensure password isn't re-hashed if it hasn't changed.
    // Your current pre('save') hook handles this: `if (!user.isModified('password')) return next();` which is good.
    await user.save(); // Save again to store the refreshToken

    res.status(201).json({
      message: 'User registered successfully',
      token,
      refreshToken,
      user: user.getProfile()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: user.getProfile()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   POST /api/auth/refresh-token
// @desc    Refresh JWT token
// @access  Public
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new tokens
    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Update refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      token: newToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    // console.error(error); // Log error for debugging
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private (now using middleware)
router.get('/me', authenticateToken, async (req, res) => { // <-- MODIFIED LINE
  try {
    // req.user.userId is now available thanks to authenticateToken middleware
    const user = await User.findById(req.user.userId).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user: user.getProfile() });

  } catch (error) {
    console.error(error); // Log the actual error for debugging
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private (now using middleware)
router.put('/profile', authenticateToken, async (req, res) => { // <-- MODIFIED LINE
  try {
    // req.user.userId is now available thanks to authenticateToken middleware
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { firstName, lastName, bio, phone, profilePicture } = req.body;

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    // Check for explicit 'undefined' to allow clearing fields if client sends empty string
    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;
    if (profilePicture !== undefined) user.profilePicture = profilePicture;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.getProfile()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private (now using middleware)
router.post('/logout', authenticateToken, async (req, res) => { // <-- MODIFIED LINE
  try {
    // req.user.userId is now available
    const user = await User.findById(req.user.userId);

    if (user) {
      user.refreshToken = null; // Clear refresh token to invalidate session
      await user.save();
    }

    res.json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error(error); // Log the actual error for debugging
    res.status(500).json({ message: 'Server error during logout' });
  }
});

module.exports = router;