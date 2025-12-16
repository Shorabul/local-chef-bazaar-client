import React, { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from "framer-motion";
import ThemeToggle from '../../../components/ThemeToggle';
import { Link, NavLink } from 'react-router';
import Container from '../../../components/Shared/Container';
import { IoMenuSharp, IoClose } from "react-icons/io5";
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2'
import ProfileDropdown from '../../../components/ProfileDropdown';
import Logo from '../../../components/Logo/Logo';

const Navbar = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const { user, logOut } = useAuth();
    const [menutoggle, setMenuToggle] = useState(false);
    const [profileToggle, setProfileToggle] = useState(false);

    const handleProfileToggle = () => setProfileToggle(!profileToggle);
    const handleMenuToggle = () => setMenuToggle(!menutoggle);

    const handleLogOut = async () => {
        try {

            await logOut();

            Swal.fire({
                position: 'top',
                icon: "success",
                title: `You have successfully logged out`,
                timer: 1500,
                showConfirmButton: false,
                background: isDark ? "#262626" : "#ffffff",
                color: isDark ? "#ffffff" : "#262626",
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
            <NavLink
                to="/"
                className={({ isActive }) =>
                    `px-4 py-3 hover:text-yellow-500 transition ${isActive ? 'text-[#ffde59] font-semibold' : ''}`
                }
            >
                Home
            </NavLink>

            <NavLink
                to="/meals"
                className={({ isActive }) =>
                    `px-4 py-3 hover:text-yellow-500 transition ${isActive ? 'text-[#ffde59] font-semibold' : ''}`
                }
            >
                Meals
            </NavLink>

            {user && (
                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `px-4 py-3 hover:text-yellow-500 transition ${isActive ? 'text-[#ffde59] font-semibold' : ''}`
                    }
                >
                    Dashboard
                </NavLink>
            )}
        </>
    );


    return (
        <div className="fixed w-full z-20 backdrop-blur-xl shadow-sm text-neutral-700 dark:text-neutral-50">

            <Container>
                <nav className="w-full flex items-center justify-between relative py-3">

                    {/* Logo */}
                    <Logo className='hidden md:block' />

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-7 font-medium">
                        {links}
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-4">

                        {/* Profile */}
                        {user ? (
                            <ProfileDropdown
                                handleProfileToggle={handleProfileToggle}
                                user={user}
                                profileToggle={profileToggle}
                                handleLogOut={handleLogOut}
                            ></ProfileDropdown>
                        ) : (
                            <>
                                <NavLink
                                    to="/login"
                                    className="bg-[#ffde59] hover:bg-yellow-400 text-black py-2 px-4 rounded-lg font-semibold transition"
                                >
                                    Login
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className="bg-[#ffde59] hover:bg-yellow-500 text-black py-2 px-4 rounded-lg font-semibold transition"
                                >
                                    Register
                                </NavLink>
                            </>
                        )}

                        {/* Theme Toggle */}
                        <ThemeToggle />

                        {/* Mobile Menu Icon */}
                        <div className="block md:hidden text-3xl text-neutral-700 dark:text-neutral-50 cursor-pointer">
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

                    {/* Mobile Menu */}
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
    );
};

export default Navbar;
