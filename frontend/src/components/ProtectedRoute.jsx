import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = () => {
    const token = localStorage.getItem('access_token');
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const profileCompleted = localStorage.getItem('profile_completed') === 'true';
        
        // Block chatbot access if profile is not completed
        if (decoded.role !== 'Admin' && !profileCompleted && location.pathname === '/chat') {
            return <Navigate to="/settings?tab=profile" replace state={{ message: "Please complete your profile details and upload a document to access the AI Career Bot." }} />;
        }
    } catch {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;