import axios from 'axios';
import React from 'react';
const axiosSecure = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
})
const useAxiosSecure = () => {
    return axiosSecure;
};

export default useAxiosSecure;