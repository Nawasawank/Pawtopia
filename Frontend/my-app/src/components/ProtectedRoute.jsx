import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const { exp, role } = jwtDecode(token);
        console.log(role)
        
        if (Date.now() > exp * 1000) {
            localStorage.removeItem('token');
            return <Navigate to="/login" />;
        }

        if (requiredRole && role !== requiredRole) {
            return <Navigate to="/unauthorized" />; 
        }
    } catch (error) {
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
