// client/src/pages/Register.js

import React, { useState, useContext, useEffect } from 'react'; // Added useContext and useEffect
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '', // Changed 'name' to 'firstName' to match backend User model
    lastName: '',  // Added lastName as per backend User model
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' // Changed 'userType' to 'role' to match backend User model
  });
  const [error, setError] = useState(''); // State for displaying registration errors
  const [loading, setLoading] = useState(false); // State for registration button loading

  const { register, isAuthenticated, currentUser } = useContext(AuthContext); // Get register function, isAuthenticated, and currentUser from context
  const navigate = useNavigate(); // Hook for navigation

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role === 'student') {
        navigate('/student/dashboard');
      } else if (currentUser.role === 'tutor') {
        navigate('/tutor/dashboard');
      } else if (currentUser.role === 'admin') {
        navigate('/admin/dashboard'); // Assuming you'll have an admin dashboard
      } else {
        navigate('/'); // Fallback if role is not recognized
      }
    }
  }, [isAuthenticated, currentUser, navigate]); // Dependencies for useEffect

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true); // Set loading state

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Destructure formData to match backend's expected properties (firstName, lastName, email, password, role)
      const { firstName, lastName, email, password, role } = formData;
      const userData = await register({ firstName, lastName, email, password, role });
      // Registration successful, AuthContext will handle state update and useEffect will redirect
      console.log('Registration successful:', userData);
    } catch (err) {
      console.error('Registration failed:', err);
      // 'err' here will be the message thrown from AuthContext (e.g., 'User already exists')
      setError(err || 'Registration failed. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md"> {/* Added padding, bg, rounded, shadow */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && ( // Display error message if present
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div>
            <input
              type="text"
              name="firstName" // Changed to firstName
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="First Name" // Updated placeholder
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="text"
              name="lastName" // Added lastName input
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <div>
            <select
              name="role" // Changed to 'role'
              value={formData.role}
              onChange={handleChange}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Registering...' : 'Sign Up'} {/* Change button text based on loading state */}
            </button>
          </div>
          <div className="text-center">
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;