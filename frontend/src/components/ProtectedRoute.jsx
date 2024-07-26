import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAuthenticated, isAdmin }) => {
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" />;
    }

    if (!isAdmin) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;