import React from 'react';
import useAuth from '../hooks/useAuth';

const ChefRoute = ({ children }) => {
    const { role, roleLoading, loading } = useAuth();
    if (loading || roleLoading) {
        return <p>Loading</p>
    }
    if (role !== 'chef') {
        return <p>Access Forbidden</p>;
    }
    return children;
};

export default ChefRoute;