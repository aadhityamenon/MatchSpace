// client/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import your main App component

// Material UI Imports for Theme Setup
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // For consistent styling across browsers

// --- Material UI Theme Definition ---
// This theme defines your application's colors, typography, and component default styles.
// You can adjust these values to match your design preferences.
const theme = createTheme({
  palette: {
    mode: 'light', // Default to light mode. Set to 'dark' if you want dark mode by default.
    primary: {
      main: '#7C3AED', // A vibrant purple for main actions/branding (Chakra purple.600)
      light: '#9F7AEA', // Lighter shade for subtle elements
      dark: '#6B46C1',  // Darker shade for contrast
      contrastText: '#fff', // White text on primary background
    },
    secondary: {
      main: '#667eea', // A blueish color for secondary actions/accents
      light: '#EDE9FE', // Lighter for backgrounds/subtle elements (Chakra purple.50)
      dark: '#4C51BF',
      contrastText: '#fff',
    },
    error: {
      main: '#DC2626', // Red for errors (Chakra red.600)
      light: '#FEE2E2', // Lighter red for backgrounds (Chakra red.50/100)
      dark: '#B91C1C',
    },
    warning: {
      main: '#EA580C', // Orange for warnings/earnings (Chakra orange.700)
      light: '#FFF7ED', // Lighter orange
      dark: '#C2410C',
    },
    info: {
      main: '#3B82F6', // Blue for info messages/another accent color
      light: '#DBEAFE',
      dark: '#2563EB',
    },
    success: {
      main: '#10B981', // Green for success/online status
      light: '#D1FAE5', // Lighter green
      dark: '#059669',
    },
    text: {
      primary: '#2D3748',   // Dark grey for primary text (Chakra gray.700/800)
      secondary: '#718096', // Medium grey for secondary text (Chakra gray.500/600)
      disabled: '#A0AEC0',
    },
    background: {
      default: '#F7FAFC', // Light background for the overall page (Chakra gray.50)
      paper: '#FFFFFF',   // White background for cards, modals etc.
    },
    divider: '#E2E8F0', // Light grey for dividers/borders (Chakra gray.200/300)
    action: {
      hover: 'rgba(128, 90, 213, 0.05)', // Subtle hover for interactive elements (similar to Chakra purple.50)
      selected: 'rgba(128, 90, 213, 0.1)',
      active: 'rgba(128, 90, 213, 0.1)',
    }
  },

  typography: {
    fontFamily: [
      'Inter', // Recommended: Link 'Inter' font in public/index.html or import via CSS
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: { fontSize: '3.5rem', fontWeight: 700 },
    h2: { fontSize: '2.5rem', fontWeight: 700 },
    h3: { fontSize: '2rem',   fontWeight: 700 }, // Matches Chakra 'lg' Heading fontWeight 'bold'
    h4: { fontSize: '1.5rem', fontWeight: 600 }, // Matches Chakra 'md' Heading fontWeight 'semibold'
    h5: { fontSize: '1.25rem', fontWeight: 600 },
    h6: { fontSize: '1rem',   fontWeight: 600 },
    body1: { fontSize: '1rem' }, // Default body text
    body2: { fontSize: '0.875rem' }, // Matches Chakra 'sm' Text
    caption: { fontSize: '0.75rem' }, // Matches Chakra 'xs' Text
    button: {
      fontWeight: 600, // Default button text to semibold
    }
  },

  components: {
    // Custom overrides for specific Material UI components
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevent default uppercase for buttons
          borderRadius: '12px', // Apply a default border radius (similar to Chakra 'xl' for buttons)
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none', // Default AppBar to no shadow, as your Navbar handles it based on scroll
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          padding: '12px 0', // py={3} equivalent for menu items list
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          paddingLeft: '24px', // px={6} equivalent
          paddingRight: '24px',
          paddingTop: '12px', // py={3} equivalent
          paddingBottom: '12px',
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'none', // Default all MUI Links to no underline
      },
      styleOverrides: {
        root: {
          // You can add a hover effect here if you want it for ALL links
          '&:hover': {
             // textDecoration: 'underline', // Uncomment if you want underline on hover
          },
        },
      },
    },
  },
});

// Get the root element from public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render your App component wrapped with ThemeProvider and CssBaseline
root.render(
  <React.StrictMode>
    {/* ThemeProvider makes the defined theme available to all MUI components in the app */}
    <ThemeProvider theme={theme}>
      {/* CssBaseline applies a CSS reset to ensure consistent styling across different browsers */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);