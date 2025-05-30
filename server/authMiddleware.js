// This file contains the authenticateToken middleware function.

const jwt = require('jsonwebtoken'); // To verify JWTs
const dotenv = require('dotenv'); // To load JWT_SECRET from .env

dotenv.config(); // Load environment variables from .env file

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
        // Use your secret key from process.env.JWT_SECRET
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // IMPORTANT: Attach user ID to req.user for use in subsequent middleware/handlers
        // This makes req.user.userId available in your routes
        req.user = { userId: decoded.userId }; // Ensure it's decoded.userId or whatever your token structure is
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        // Token is not valid (e.g., expired, malformed)
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Export the middleware function using CommonJS syntax
module.exports = { authenticateToken };