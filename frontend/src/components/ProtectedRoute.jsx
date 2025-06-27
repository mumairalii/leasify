import React from 'react';
import { useSelector } from 'react-redux';

// --- THIS LINE IS THE MOST LIKELY SOURCE OF THE ERROR ---
// Make sure you have imported `Maps` and `useLocation` from 'react-router-dom'.
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user } = useSelector((state) => state.auth);
    
    // This hook must be called to get the 'location' object.
    const location = useLocation();

    if (!user) {
        // This line will cause an error if `Maps` or `location` are not defined above.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;