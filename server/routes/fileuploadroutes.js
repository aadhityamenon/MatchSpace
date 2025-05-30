// MatchSpace/server/routes/fileuploadroutes.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User'); // Path to your User model

// IMPORTANT: Updated path to your new authentication middleware file
const { authenticateToken } = require('../authMiddleware'); // <--- CHECK THIS PATH AGAIN!

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subfolder = '';
    
    // Organize files by type
    if (file.fieldname === 'profilePicture') {
      subfolder = 'profiles';
    } else if (file.fieldname === 'certificate') {
      subfolder = 'certificates';
    } else if (file.fieldname === 'document') {
      subfolder = 'documents';
    }
    
    const fullPath = path.join(uploadDir, subfolder);
    
    // Create subfolder if it doesn't exist
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    // Ensure req.user.userId is available from authenticateToken middleware
    // If authenticateToken correctly sets req.user.userId, this should work.
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + (req.user ? req.user : 'anonymous') + '-' + uniqueSuffix + ext; // Added fallback
    cb(null, name);
  }
});

// File filter for security
const fileFilter = (req, file, cb) => {
  // Define allowed file types for each field
  const allowedTypes = {
    profilePicture: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    certificate: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    document: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'text/plain']
  };

  const fieldAllowedTypes = allowedTypes[file.fieldname];
  
  if (fieldAllowedTypes && fieldAllowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: ${fieldAllowedTypes?.join(', ')}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5 // Maximum 5 files per request
  }
});

// Upload profile picture
router.post('/profile-picture', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Update user's profile picture path
    // req.user.userId should be set by authenticateToken
    const user = await User.findById(req.user.userId); 
    
    // Delete old profile picture if it exists
    if (user.profilePicture && fs.existsSync(user.profilePicture)) {
      fs.unlinkSync(user.profilePicture);
    }
    
    user.profilePicture = req.file.path;
    await user.save();

    res.json({
      message: 'Profile picture uploaded successfully',
      filePath: req.file.path,
      fileName: req.file.filename,
      fileUrl: `/api/files/serve/${req.file.filename}`
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    
    // Clean up uploaded file if database update fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Failed to upload profile picture' });
  }
});

// Upload tutor certificates
router.post('/certificates', authenticateToken, upload.array('certificate', 3), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const user = await User.findById(req.user.userId);
    
    if (user.role !== 'tutor') {
      // Clean up uploaded files
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
      return res.status(403).json({ message: 'Only tutors can upload certificates' });
    }

    // Process uploaded certificates
    const certificates = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      uploadedAt: new Date()
    }));

    // Add to user's certificates array
    if (!user.certificates) {
      user.certificates = [];
    }
    user.certificates.push(...certificates);
    await user.save();

    res.json({
      message: 'Certificates uploaded successfully',
      certificates: certificates.map(cert => ({
        filename: cert.filename,
        originalName: cert.originalName,
        fileUrl: `/api/files/serve/${cert.filename}`,
        uploadedAt: cert.uploadedAt
      }))
    });
  } catch (error) {
    console.error('Certificate upload error:', error);
    
    // Clean up uploaded files if database update fails
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    res.status(500).json({ message: 'Failed to upload certificates' });
  }
});

// Upload general documents
router.post('/documents', authenticateToken, upload.array('document', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const { category = 'general' } = req.body;
    
    const documents = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      category: category,
      uploadedAt: new Date()
    }));

    const user = await User.findById(req.user.userId);
    
    // Add to user's documents array
    if (!user.documents) {
      user.documents = [];
    }
    user.documents.push(...documents);
    await user.save();

    res.json({
      message: 'Documents uploaded successfully',
      documents: documents.map(doc => ({
        filename: doc.filename,
        originalName: doc.originalName,
        category: doc.category,
        fileUrl: `/api/files/serve/${doc.filename}`,
        uploadedAt: doc.uploadedAt
      }))
    });
  } catch (error) {
    console.error('Document upload error:', error);
    
    // Clean up uploaded files if database update fails
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    res.status(500).json({ message: 'Failed to upload documents' });
  }
});

// Serve uploaded files
router.get('/serve/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Security check: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ message: 'Invalid filename' });
    }

    // Search for file in subdirectories
    const subdirs = ['profiles', 'certificates', 'documents'];
    let filePath = null;

    for (const subdir of subdirs) {
      const testPath = path.join(uploadDir, subdir, filename);
      if (fs.existsSync(testPath)) {
        filePath = testPath;
        break;
      }
    }

    if (!filePath) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Set appropriate content type
    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain'
    };

    const contentType = contentTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    // Send file
    res.sendFile(path.resolve(filePath));
  } catch (error) {
    console.error('File serve error:', error);
    res.status(500).json({ message: 'Failed to serve file' });
  }
});

// Get user's uploaded files
router.get('/my-files', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    const files = {
      profilePicture: user.profilePicture ? {
        path: user.profilePicture,
        url: `/api/files/serve/${path.basename(user.profilePicture)}`
      } : null,
      certificates: user.certificates || [],
      documents: user.documents || []
    };

    res.json(files);
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Failed to fetch files' });
  }
});

// Delete a file
router.delete('/:filename', authenticateToken, async (req, res) => {
  try {
    const filename = req.params.filename;
    const user = await User.findById(req.user.userId);

    // Security check
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ message: 'Invalid filename' });
    }

    let fileDeleted = false;
    let filePath = null;

    // Check if it's a profile picture
    if (user.profilePicture && path.basename(user.profilePicture) === filename) {
      filePath = user.profilePicture;
      user.profilePicture = null;
      fileDeleted = true;
    }

    // Check certificates
    if (!fileDeleted && user.certificates) {
      const certIndex = user.certificates.findIndex(cert => cert.filename === filename);
      if (certIndex !== -1) {
        filePath = user.certificates[certIndex].path;
        user.certificates.splice(certIndex, 1);
        fileDeleted = true;
      }
    }

    // Check documents
    if (!fileDeleted && user.documents) {
      const docIndex = user.documents.findIndex(doc => doc.filename === filename);
      if (docIndex !== -1) {
        filePath = user.documents[docIndex].path;
        user.documents.splice(docIndex, 1);
        fileDeleted = true;
      }
    }

    if (!fileDeleted) {
      return res.status(404).json({ message: 'File not found or not owned by user' });
    }

    // Delete physical file
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Save user changes
    await user.save();

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ message: 'Too many files. Maximum is 5 files per request.' });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ message: 'Unexpected file field.' });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({ message: error.message });
  }
  
  res.status(500).json({ message: 'File upload error' });
});

module.exports = router;