import React from 'react';
import Navbar from '../../Shared/Navbar/Navbar';
import Banner from '../Banner/Banner';
import { useEffect } from 'react';

const Home = () => {
    useEffect(() => {
        document.title = "Locchef";
    }, []);
    return (
        <div>
            <Banner></Banner>
        </div>
    );
};

export default Home;