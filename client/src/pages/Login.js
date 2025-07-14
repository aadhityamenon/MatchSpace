// client/src/pages/Login.js
import React, { useState, useContext, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Assuming AuthContext is compatible

// Material UI Imports
import {
  Box,
  Typography, // Replaces Heading and Text
  TextField,  // Replaces Input, FormControl, FormLabel, FormErrorMessage
  Button,
  Stack,      // Replaces VStack
  Snackbar,   // For toasts
  Alert,      // For toast content
  CircularProgress, // Replaces Spinner
  Link as MuiLink, // Alias for MUI's Link to avoid conflict with RouterLink
  useTheme,   // To access theme colors/spacing
} from '@mui/material';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState(''); // Changed 'error' to 'errorMessage' to be clearer
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar visibility

  const { login, isAuthenticated, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme(); // Access the theme for colors and spacing

  // Redirect if already authenticated
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

    try {
      await login(formData.email, formData.password);
      // Login successful, useEffect handles redirection
    } catch (err) {
      console.error('Login failed:', err);
      // Set error message for display in Snackbar
      const msg = err.message || "Please check your credentials."; // Assuming error has a message property
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
          maxWidth: '448px', // maxWidth="md" approx 48rem = 768px, but your Box uses maxWidth="md" with p={8} within it. Adjust max width here if needed. 448px is max-w-sm
          width: '100%',
          bgcolor: 'background.paper', // White background
          borderRadius: '12px', // rounded="xl" in Chakra
          boxShadow: theme.shadows[4], // shadow="2xl" in Chakra. theme.shadows[4] is a good equivalent.
          border: `1px solid ${theme.palette.divider}`, // borderWidth="1px" borderColor="gray.200"
          // Spacing between direct children can be managed by Stack
        }}
      >
        <Stack spacing={2} alignItems="center" sx={{ mb: 4 }}> {/* VStack spacing={4} align="center" */}
          <Typography variant="h4" component="h2" sx={{ mt: 1, textAlign: 'center', fontWeight: 'bold' }}> {/* Heading as="h2" size="xl", mt={2} */}
            Sign in to your account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}> {/* Text fontSize="sm" color="gray.600" */}
            Or{' '}
            <MuiLink component={RouterLink} to="/register" sx={{
              color: 'primary.main', // brand.500
              '&:hover': { color: 'primary.dark', textDecoration: 'underline' }, // brand.600
              fontWeight: 'medium',
            }}>
              create a new account
            </MuiLink>
          </Typography>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3} mt={4}> {/* VStack spacing={6} mt={8} - MUI spacing 3 for 24px, 4 for 32px */}
            <TextField
              fullWidth
              id="email"
              label="Email address" // This acts as FormLabel
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              size="medium" // size="lg" in Chakra, 'medium' is default/standard in MUI
              variant="filled" // Optional: 'outlined', 'standard', 'filled'
              error={!!errorMessage && errorMessage.includes('email')} // Check if errorMessage exists and is email-related
              helperText={!!errorMessage && errorMessage.includes('email') ? errorMessage : ''} // FormErrorMessage
              sx={{
                '& .MuiInputBase-input': {
                  paddingTop: '20px', // Adjust padding if 'filled' variant looks too small
                  paddingBottom: '12px',
                },
                '& .MuiInputLabel-filled': {
                  transform: 'translate(12px, 12px) scale(1)',
                },
                '& .MuiInputLabel-filled.MuiInputLabel-shrink': {
                  transform: 'translate(12px, -9px) scale(0.75)',
                },
              }}
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
              error={!!errorMessage && errorMessage.includes('credentials')} // Check if errorMessage exists and is credentials-related
              helperText={!!errorMessage && errorMessage.includes('credentials') ? errorMessage : ''}
              sx={{
                '& .MuiInputBase-input': {
                  paddingTop: '20px',
                  paddingBottom: '12px',
                },
                '& .MuiInputLabel-filled': {
                  transform: 'translate(12px, 12px) scale(1)',
                },
                '& .MuiInputLabel-filled.MuiInputLabel-shrink': {
                  transform: 'translate(12px, -9px) scale(0.75)',
                },
              }}
            />

            <Button
              type="submit"
              color="primary" // Uses the 'primary' color from the theme
              variant="contained" // Solid button
              size="large" // size="lg" in Chakra, 'large' is standard in MUI
              fullWidth // width="full"
              disabled={loading} // Disable button when loading
              sx={{
                mt: 3, // Add margin top if needed, based on Stack spacing
                py: 1.5, // Adjust vertical padding for button size consistency
                fontSize: '1rem', // Match Chakra's 'lg' font size for buttons
                fontWeight: 'bold',
                // Custom spinner handling for Button
                position: 'relative', // Needed for absolute positioning of spinner
                '& .MuiButton-startIcon': {
                  marginRight: loading ? '8px' : '0', // Add space when spinner is active
                },
              }}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Signing In...' : 'Sign In'}
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

export default Login;