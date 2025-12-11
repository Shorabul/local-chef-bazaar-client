import React, { useEffect, useState } from 'react';
import { Outlet, useNavigation, useLocation } from 'react-router';
import Navbar from '../pages/Shared/Navbar/Navbar';
import Footer from '../pages/Shared/Footer/Footer';
import PageLoader from '../pages/PageLoader/PageLoader';

const RootLayout = () => {
    const navigation = useNavigation();
    const location = useLocation();
    const [delayedLoader, setDelayedLoader] = useState(false);

    useEffect(() => {
        setDelayedLoader(true);

        const timer = setTimeout(() => {
            setDelayedLoader(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    const showLoader = navigation.state === "loading" || delayedLoader;

    return (
        <div className='flex flex-col min-h-screen'>
            {showLoader && <PageLoader />}
            <Navbar />
            <div className='flex-1 mt-30'>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default RootLayout;