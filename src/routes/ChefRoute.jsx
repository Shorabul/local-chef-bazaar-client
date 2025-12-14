import React from 'react';
import useAuth from '../hooks/useAuth';
import { Navigate } from "react-router";
const ChefRoute = ({ children }) => {
    const { backendData, loading, backendLoading } = useAuth();

    if (loading || backendLoading) {
        return null;
    }

    if (backendData?.role !== "chef") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ChefRoute;
