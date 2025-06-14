import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TutorSearch from './components/TutorSearch';
import TutorProfile from './components/TutorProfile';
import Register from './pages/Register';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TutorApplication from './components/TutorApplication';
import TutorDashboard from './pages/TutorDashboard';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute'; // Ensure correct import name

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<TutorSearch />} />
              <Route path="/tutors/:id" element={<TutorProfile />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              {/* Private Routes - Student */}
              <Route 
                path="/student/dashboard" // Changed path for clarity
                element={<PrivateRoute allowedRoles={['student']} />} // Pass allowedRoles prop
              >
                <Route index element={<StudentDashboard />} /> {/* Nested route for StudentDashboard */}
              </Route>

              {/* Private Routes - Tutor */}
              <Route 
                path="/tutor/dashboard" // Changed path for clarity
                element={<PrivateRoute allowedRoles={['tutor']} />} // Pass allowedRoles prop
              >
                <Route index element={<TutorDashboard />} /> {/* Nested route for TutorDashboard */}
              </Route>
              
              {/* Private Route - Tutor Application (can be accessed by any logged-in user or specifically by students looking to become tutors) */}
              {/* You might want to adjust allowedRoles based on who should apply */}
              <Route 
                path="/apply" 
                element={<PrivateRoute allowedRoles={['student', 'tutor']} />} // Example: Allow students to apply, and maybe tutors to review/update their application (less common)
              >
                <Route index element={<TutorApplication />} />
              </Route>

              {/* Catch-all route for 404 (optional) */}
              <Route path="*" element={<p className="text-center mt-20 text-xl">404: Page Not Found</p>} />

            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;