// client/src/pages/Register.js
import React, { useState, useContext, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Assuming AuthContext is compatible

// Material UI Imports
import {
  Box,
  Typography, // Replaces Heading and Text
  TextField,  // Replaces Input (and handles FormControl, FormLabel, FormErrorMessage implicitly)
  Button,
  Stack,      // Replaces VStack
  FormControl, // For Select component
  InputLabel,  // For label of Select
  Select,      // Replaces Chakra Select
  MenuItem,    // Options for Select
  Snackbar,    // For toasts
  Alert,       // For toast content
  CircularProgress, // Replaces Spinner
  Link as MuiLink,  // Alias for MUI's Link to avoid conflict with RouterLink
  useTheme,    // To access theme colors/spacing
} from '@mui/material';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' // Default to student
  });
  const [errorMessage, setErrorMessage] = useState(''); // Unified error message state
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar visibility

  const { register, isAuthenticated, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme(); // Access the theme for colors and spacing

  // Redirect if already authenticated (similar to Login.js)
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      // Adjusted paths to be consistent with what's defined in App.js
      if (currentUser.role === 'student') {
        navigate('/student-dashboard'); // Matches App.js route
      } else if (currentUser.role === 'tutor') {
        navigate('/tutor-dashboard'); // Matches App.js route
      } else if (currentUser.role === 'admin') {
        // You might need an /admin-dashboard route if you have one
        navigate('/admin-dashboard'); // Placeholder
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors
    setLoading(true);
    setSnackbarOpen(false); // Close any existing snackbar

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      // Assuming register function takes formData object directly
      await register(formData);
      // Success will trigger useEffect for redirection
    } catch (err) {
      console.error('Registration failed:', err);
      const msg = err.message || "An error occurred during registration. Please try again.";
      setErrorMessage(msg);
      setSnackbarOpen(true); // Open Snackbar to show the error
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.secondary.light, // Using theme's secondary.light (Chakra brand.50 equivalent)
        p: { xs: 2, sm: 3 }, // Responsive padding (Chakra p={base:4, sm:6} equivalent)
      }}
    >
      <Box
        sx={{
          p: 4, // p={8} equivalent in Chakra is 32px, MUI p={4} is 32px
          maxWidth: '448px', // maxWidth="md" approx 48rem = 768px, but your Box uses maxWidth="md" with p={8} within it. Adjust max width here if needed.
          width: '100%',
          bgcolor: 'background.paper', // White background
          borderRadius: '12px', // rounded="xl" in Chakra
          boxShadow: theme.shadows[4], // shadow="2xl" in Chakra. theme.shadows[4] is a good equivalent.
          border: `1px solid ${theme.palette.divider}`, // borderWidth="1px" borderColor="gray.200"
        }}
      >
        <Stack spacing={2} alignItems="center" sx={{ mb: 4 }}> {/* VStack spacing={4} align="center" */}
          <Typography variant="h4" component="h2" sx={{ mt: 1, textAlign: 'center', fontWeight: 'bold' }}> {/* Heading as="h2" size="xl", mt={2} */}
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}> {/* Text fontSize="sm" color="gray.600" */}
            Already have an account?{' '}
            <MuiLink component={RouterLink} to="/login" sx={{
              color: 'primary.main', // brand.500
              '&:hover': { color: 'primary.dark', textDecoration: 'underline' }, // brand.600
              fontWeight: 'medium',
            }}>
              Sign in here
            </MuiLink>
          </Typography>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3} mt={4}> {/* VStack spacing={6} mt={8} - MUI spacing 3 for 24px, 4 for 32px */}
            <TextField
              fullWidth
              id="firstName"
              label="First Name"
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              size="medium" // 'large' in Chakra size="lg", 'medium' is standard in MUI
              variant="filled" // Optional: 'outlined', 'standard'
              // No specific error handling here as it's typically required
            />

            <TextField
              fullWidth
              id="lastName"
              label="Last Name"
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              size="medium"
              variant="filled"
            />

            <TextField
              fullWidth
              id="email"
              label="Email address"
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              size="medium"
              variant="filled"
              error={!!errorMessage && errorMessage.includes('email')} // Example error check for email
              helperText={!!errorMessage && errorMessage.includes('email') ? errorMessage : ''}
            />

            <TextField
              fullWidth
              id="password"
              label="Password"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              size="medium"
              variant="filled"
              error={!!errorMessage && errorMessage.includes('Password')} // Error for general password issues
              helperText={!!errorMessage && errorMessage.includes('Password') ? errorMessage : ''}
            />

            <TextField
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              size="medium"
              variant="filled"
              error={!!errorMessage && errorMessage.includes('match')} // Error for password mismatch
              helperText={!!errorMessage && errorMessage.includes('match') ? errorMessage : ''}
            />

            {/* Role Selection */}
            <FormControl fullWidth variant="filled" size="medium">
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role" // This makes the label appear correctly with the 'filled' variant
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="tutor">Tutor</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              color="primary" // Uses 'primary' color from theme
              variant="contained" // Solid button style
              size="large" // 'lg' in Chakra, 'large' in MUI
              fullWidth // 'full' width
              disabled={loading} // Disable button when loading
              sx={{
                mt: 3, // Add margin top if needed, based on Stack spacing
                py: 1.5, // Adjust vertical padding for button size consistency
                fontSize: '1rem', // Match Chakra's 'lg' font size for buttons
                fontWeight: 'bold',
                position: 'relative',
                '& .MuiButton-startIcon': {
                  marginRight: loading ? '8px' : '0', // Add space when spinner is active
                },
              }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Registering...' : 'Sign Up'}
            </Button>
          </Stack>
        </form>
      </Box>

      {/* Snackbar for error messages (replaces Chakra Toast) */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position "top"
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;