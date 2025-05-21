import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TutorSearch from './pages/TutorSearch';
import TutorProfile from './pages/TutorProfile';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TutorApplication from './pages/TutorApplication';
import TutorDashboard from './pages/TutorDashboard';
import StudentDashboard from './pages/StudentDashboard';
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
                  <Dashboard />
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