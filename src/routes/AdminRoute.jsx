import React from 'react';
import useAuth from '../hooks/useAuth';

const AdminRoute = ({ children }) => {
    const { role, roleLoading, loading } = useAuth();
    if (loading || roleLoading) {
        return <p>Loading</p>
    }
    if (role !== 'admin') {
        return <p>Access Forbidden</p>;
    }
    return children;
};

export default AdminRoute;