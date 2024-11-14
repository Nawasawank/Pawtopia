import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requiredRole = "user" }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const { exp, role } = jwtDecode(token);

        if (Date.now() > exp * 1000) {
            localStorage.removeItem('token'); 
            return <Navigate to="/login" />;
        }

        if (role !== requiredRole) {
            return <Navigate to={role === "admin" ? "/AdminHome" : "/"} />;
        }
    } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
