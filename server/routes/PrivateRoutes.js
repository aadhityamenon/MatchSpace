// client/src/components/PrivateRoutes.js

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Ensure path is correct

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, loading, currentUser } = useContext(AuthContext);

  // While authentication status is being determined
  if (loading) {
    // You can render a loading spinner or null here
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  // If authenticated
  if (isAuthenticated) {
    // If roles are specified, check if the current user's role is allowed
    if (allowedRoles && allowedRoles.length > 0) {
      if (currentUser && allowedRoles.includes(currentUser.role)) {
        return <Outlet />; // User is authenticated and has allowed role, render child routes
      } else {
        // Authenticated but not authorized for this specific route
        // You might want a dedicated "Access Denied" page or redirect to their main dashboard
        console.warn(`Access Denied: User role '${currentUser?.role}' not in allowed roles: ${allowedRoles.join(', ')}`);
        // Redirect to a general dashboard based on their role, or to home if no dashboard
        if (currentUser.role === 'student') {
            return <Navigate to="/student/dashboard" replace />;
        } else if (currentUser.role === 'tutor') {
            return <Navigate to="/tutor/dashboard" replace />;
        } else if (currentUser.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/" replace />; // Fallback
      }
    } else {
      // Authenticated, and no specific roles are required for this route
      return <Outlet />; // Render child routes
    }
  }

  // If not authenticated, redirect to login page
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;