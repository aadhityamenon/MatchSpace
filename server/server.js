// server.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
// const jwt = require('jsonwebtoken'); // No longer needed here, handled by authMiddleware

// Load environment variables from .env file
dotenv.config();

// --- Import Route Handlers ---
const userRoutes = require('./routes/userroutes');
const tutorRoutes = require('./routes/tutorsroutes');
const bookingRoutes = require('./routes/bookingroute');
const messageRoutes = require('./routes/chatroutes'); // Assuming chatroutes handles messages
const chatRoutes = require('./routes/chatroutes'); // Explicitly for chat endpoints
const adminRoutes = require('./routes/adminroutes');
const apiRoutes = require('./routes/api');
const fileuploadRoutes = require('./routes/fileuploadroutes');
const notificationRoutes = require('./routes/notificationroutes');
const paymentRoutes = require('./routes/paymentroutes');
const reviewsRoutes = require('./routes/reviewsroutes');

// --- Import your shared authentication middleware ---
// IMPORTANT: This path assumes you created server/middleware/authMiddleware.js
const { authenticateToken } = require('./authMiddleware'); 

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tutorMatch', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// --- API Routes ---
// Use the imported authenticateToken middleware for protected routes

app.use('/api/users', userRoutes);
app.use('/api/tutors', tutorRoutes);

// Protected routes using the shared authenticateToken middleware
app.use('/api/students', authenticateToken, userRoutes); // Using userRoutes for student actions, protected by auth
app.use('/api/bookings', authenticateToken, bookingRoutes);
app.use('/api/messages', authenticateToken, messageRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);
app.use('/api/upload', authenticateToken, fileuploadRoutes); // This is the line we're focusing on!
app.use('/api/notifications', authenticateToken, notificationRoutes);
app.use('/api/payments', authenticateToken, paymentRoutes);

app.use('/api/reviews', reviewsRoutes); // Reviews might or might not be protected (e.g., viewing reviews)
app.use('/api', apiRoutes); // General API route, adjust path if api.js serves specific endpoints


// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;