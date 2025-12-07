import React, { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from "framer-motion";
import ThemeToggle from '../../../components/ThemeToggle';
import { Link, NavLink } from 'react-router';
import Container from '../../../components/Shared/Container';
import { IoMenuSharp, IoClose } from "react-icons/io5";
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2'

const Navbar = () => {
    const { user, logOut } = useAuth();
    const [menutoggle, setMenuToggle] = useState(false);
    const [profileToggle, setProfileToggle] = useState(false);

    const handleProfileToggle = () => setProfileToggle(!profileToggle);
    const handleMenuToggle = () => setMenuToggle(!menutoggle);

    const handleLogOut = async () => {
        try {

            await logOut();

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "You have successfully logged out",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Close menu when screen becomes large
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMenuToggle(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const links = (
        <>
            <NavLink to='/' className="px-4 py-3 hover:text-yellow-500 transition">Home</NavLink>
            <NavLink to='/meals' className="px-4 py-3 hover:text-yellow-500 transition">Meals</NavLink>
            {user && <NavLink to='/dashboard' className="px-4 py-3 hover:text-yellow-500 transition">Dashboard</NavLink>
            }        </>
    );

    return (
        <div className="fixed w-full z-20 backdrop-blur-xl bg-white/60 dark:bg-black/40 border-b border-white/20 dark:border-white/10 shadow-sm">
            <div className="py-3">
                <Container>
                    <nav className="w-full flex items-center justify-between relative">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <img
                                width="45"
                                height="45"
                                src="/Local-Chef's-bazaar.png"
                                alt=""
                                className="rounded-full shadow-sm"
                            />
                            <span className="hidden md:block font-bold text-xl text-gray-800 dark:text-white">
                                Local Chef's Bazaar
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-7 text-gray-800 dark:text-gray-200 font-medium">
                            {links}
                        </div>

                        {/* Right Section */}
                        <div className="flex items-center gap-4">

                            {/* Profile */}
                            {user ? (
                                <div className="relative">
                                    <img
                                        onClick={handleProfileToggle}
                                        className="h-10 w-10 rounded-full cursor-pointer border border-white/30 shadow-md hover:scale-105 transition"
                                        src={user.photoURL}
                                        alt=""
                                    />

                                    {/* Animated Profile Dropdown */}
                                    <AnimatePresence>
                                        {profileToggle && (
                                            <Motion.div
                                                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-0 mt-3 w-56 bg-white dark:bg-neutral-900 shadow-xl rounded-xl p-4 border border-gray-200/50 dark:border-neutral-700"
                                            >
                                                <h1 className="font-semibold">{user.displayName}</h1>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {user.email}
                                                </p>

                                                <button
                                                    onClick={handleLogOut}
                                                    className="mt-3 w-full py-2 bg-yellow-400 text-black rounded-md font-semibold hover:bg-yellow-500 transition"
                                                >
                                                    Logout
                                                </button>
                                            </Motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <>
                                    <NavLink
                                        to="/login"
                                        className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-lg font-semibold transition"
                                    >
                                        Login
                                    </NavLink>
                                    <NavLink
                                        to="/register"
                                        className="bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-lg font-semibold transition"
                                    >
                                        Register
                                    </NavLink>
                                </>
                            )}

                            {/* Theme Toggle */}
                            <ThemeToggle />

                            {/* Mobile Menu Icon */}
                            <div className="block md:hidden text-3xl dark:text-white cursor-pointer">
                                <Motion.div
                                    key={menutoggle ? "close" : "open"}
                                    initial={{ rotate: menutoggle ? -90 : 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {menutoggle ? (
                                        <IoClose onClick={handleMenuToggle} />
                                    ) : (
                                        <IoMenuSharp onClick={handleMenuToggle} />
                                    )}
                                </Motion.div>
                            </div>
                        </div>

                        {/* Animated Mobile Menu */}
                        <AnimatePresence>
                            {menutoggle && (
                                <Motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-20 left-0 w-full bg-white dark:bg-neutral-900 shadow-lg flex flex-col text-gray-700 dark:text-gray-200 py-5 px-6 space-y-3 md:hidden"
                                >
                                    {links}
                                </Motion.div>
                            )}
                        </AnimatePresence>

                    </nav>
                </Container>
            </div>
        </div>
    );
};

export default Navbar;
