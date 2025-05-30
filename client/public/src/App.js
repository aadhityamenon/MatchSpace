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
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<TutorSearch />} />
              <Route path="/tutors/:id" element={<TutorProfile />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <StudentDashboard />
                </PrivateRoute>
              } />
              <Route path="/apply" element={
                <PrivateRoute>
                  <TutorApplication />
                </PrivateRoute>
              } />
              <Route path="/tutor-dashboard" element={
                <PrivateRoute>
                  <TutorDashboard />
                </PrivateRoute>
              } />
              <Route path="/student-dashboard" element={
                <PrivateRoute>
                  <StudentDashboard />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;