import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from "react-router";

const AdminRoute = ({ children }) => {
    const { backendData, loading, backendLoading } = useAuth();

    if (loading || backendLoading) {
        return null;
    }

    if (backendData?.role !== "admin") {
        return <Navigate to="/" replace />;

    };
    return children;
};

export default AdminRoute;