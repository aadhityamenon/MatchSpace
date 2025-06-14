// server/authMiddleware.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('./models/User'); // Import the User model

dotenv.config();

const authenticateToken = (req, res, next) => {
    // Get token from header
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Expects "Bearer TOKEN"

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user (userId and potentially other info from token payload)
        // This makes req.user available in your routes
        req.user = decoded; // Now req.user will have properties from your token, e.g., req.user.userId
        next();
    } catch (err) {
        // Token is not valid (e.g., expired, malformed)
        console.error('Token verification error:', err.message); // Log the error for debugging
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Middleware to authorize user based on roles
const authorizeRoles = (roles) => { // 'roles' will be an array, e.g., ['admin', 'tutor']
    return async (req, res, next) => {
        // Ensure authenticateToken has run and attached req.user
        if (!req.user || !req.user.userId) { // Check for both req.user and req.user.userId
            return res.status(403).json({ msg: 'Access denied: User not authenticated' });
        }

        try {
            const user = await User.findById(req.user.userId).select('role'); // Fetch user to get their role
            if (!user) {
                return res.status(404).json({ msg: 'Access denied: User not found' });
            }

            // Check if the user's role is included in the allowed roles
            if (!roles.includes(user.role)) {
                return res.status(403).json({ msg: `Access denied: You do not have the required role (${roles.join(', ')})` });
            }

            // If authorized, proceed
            next();
        } catch (error) {
            console.error('Authorization error:', error);
            res.status(500).json({ msg: 'Server error during authorization' });
        }
    };
};

module.exports = { authenticateToken, authorizeRoles };