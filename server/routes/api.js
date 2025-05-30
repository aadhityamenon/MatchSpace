// MatchSpace/server/routes/api.js
// This file is for your Node.js BACKEND. It defines API routes for your server.

const express = require('express'); // Use 'require' for Node.js backend
const router = express.Router();

// A simple health check endpoint.
// Your frontend can call this at http://localhost:5000/api/health (if your server runs on port 5000)
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend API is running healthy!' });
});

// You can add other general-purpose API routes here if needed for your backend.
// For example:
// router.get('/server-info', (req, res) => {
//     res.json({ name: 'MatchSpace Backend', version: '1.0' });
// });

module.exports = router; // Use 'module.exports' to expose this router in Node.js