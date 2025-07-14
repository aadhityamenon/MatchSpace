// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your AuthProvider from the context directory
import { AuthProvider } from './context/AuthContext'; // Path based on your file structure

// Import your converted Material UI components
import Navbar from './components/Navbar'; // Your converted Navbar component
import Footer from './components/Footer'; // Your converted Footer component

// Import your page components from the pages directory
// IMPORTANT: You MUST create these files (e.g., src/pages/Home.js, etc.)
// and convert their content to Material UI for your application to render them.
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TutorDashboard from './pages/TutorDashboard';

// You also have these pages/components mentioned in Navbar or your file structure
// Make sure to create these files in src/pages/ or src/components/ as appropriate.
import Search from './components/Search'; // Assuming Search is a component, not a full page
import TutorApplication from './components/TutorApplication'; // Assuming this is a component
import ProfileSettings from './components/ProflieSettings'; // Check for typo: 'ProfilieSettings' vs 'ProfileSettings'
import PrivateRoute from './components/PrivateRoute'; // Assuming this is a route guard component
import AdminTutorReview from './components/AdminTutorReview'; // Component
import BookingSystem from './components/BookingSystem'; // Component
import Chat from './components/Chat'; // Component
import TutorProfile from './components/TutorProfile'; // Component
import TutorSearch from './components/TutorSearch'; // Component
import TutorVerification from './components/TutorVerification'; // Component

// Material UI Box for flexible layout containers
import { Box } from '@mui/material';

function App() {
  return (
    // AuthProvider should wrap your entire application so that all components can access auth state
    <AuthProvider>
      <Router>
        {/* Navbar is placed outside <Routes> so it's always visible on every page */}
        <Navbar />

        {/*
          The <Box component="main"> is used here to contain your page content.
          The 'Spacer' in the Navbar (a Toolbar) ensures that content doesn't
          get hidden behind the fixed Navbar.
        */}
        <Box component="main" sx={{ flexGrow: 1 }}> {/* flexGrow ensures it takes available space */}
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* If 'Search' is a full page, move it to pages/ and adjust import */}
            <Route path="/search" element={<Search />} />
            {/* Assuming /apply uses the TutorApplication component */}
            <Route path="/apply" element={<TutorApplication />} />


            {/* Protected Routes (using your PrivateRoute component) */}
            {/* Wrap routes that require authentication with your PrivateRoute */}
            <Route element={<PrivateRoute />}>
                {/* User Dashboards */}
                <Route path="/student-dashboard" element={<StudentDashboard />} />
                <Route path="/tutor-dashboard" element={<TutorDashboard />} />

                {/* Profile & Settings */}
                <Route path="/profile" element={<ProfileSettings />} /> {/* Corrected typo based on Navbar's use of /profile */}
                <Route path="/settings" element={<ProfileSettings />} /> {/* Assuming settings also uses ProfileSettings component */}

                {/* Assuming these are full pages or can be displayed directly */}
                {/* If these are components used *within* pages, adjust their routes */}
                <Route path="/chat" element={<Chat />} />
                <Route path="/tutor/:tutorId" element={<TutorProfile />} /> {/* Example: Route for individual tutor profiles */}
                <Route path="/tutor-search" element={<TutorSearch />} /> {/* If different from /search */}
                {/* Routes that might be nested or have specific access roles: */}
                {/* <Route path="/admin/tutor-reviews" element={<AdminTutorReview />} /> */}
                {/* <Route path="/bookings" element={<BookingSystem />} /> */}
                {/* <Route path="/tutor-verification" element={<TutorVerification />} /> */}
                {/* <Route path="/earnings" element={<EarningsPage />} /> */} {/* This was in Navbar dropdown */}
            </Route>

            {/* Add more routes as needed based on your application's navigation */}
          </Routes>
        </Box>

        {/* Footer is placed outside <Routes> so it's always visible on every page */}
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;