import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">TutorMatch</Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/search" className="hover:text-blue-200">Find Tutors</Link>
          
          {currentUser ? (
            <>
              {currentUser.role === 'tutor' ? (
                <Link to="/tutor-dashboard" className="hover:text-blue-200">Dashboard</Link>
              ) : (
                <Link to="/student-dashboard" className="hover:text-blue-200">Dashboard</Link>
              )}
              
              {currentUser.role === 'student' && (
                <Link to="/apply" className="hover:text-blue-200">Become a Tutor</Link>
              )}
              
              <button 
                onClick={logout}
                className="bg-blue-700 hover:bg-blue-800 py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="hover:text-blue-200"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="bg-blue-700 hover:bg-blue-800 py-2 px-4 rounded"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
