import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        // If not logged in, redirect to the login page
        return <Navigate to="/login" replace />;
    }

    // If logged in, show the component
    return <Outlet />;
};

export default ProtectedRoute;