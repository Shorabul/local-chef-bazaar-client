import { Outlet, NavLink } from "react-router";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { IoMenuSharp, IoClose } from "react-icons/io5";
import ThemeToggle from "../components/ThemeToggle";
import ProfileDropdown from "../components/ProfileDropdown";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import Container from "../components/Shared/Container";
import {
    User,
    Users,
    PlusCircle,
    Utensils,
    ClipboardList,
    Settings,
    Star,
} from "lucide-react";
import Logo from "../components/Logo/Logo";

export default function DashboardLayout() {
    const isDark = document.documentElement.classList.contains("dark");
    const { user, backendData, logOut } = useAuth();
    const [open, setOpen] = useState(false);
    const [profileToggle, setProfileToggle] = useState(false);

    const handleMenuToggle = () => setOpen(!open);
    const handleProfileToggle = () => setProfileToggle(!profileToggle);

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

    const menuItems = {
        user: [
            { to: "/dashboard/profile", label: "Profile", icon: User },
            { to: "/dashboard/orders", label: "My Orders", icon: ClipboardList },
            { to: "/dashboard/review", label: "My Reviews", icon: Star },
            { to: "/dashboard/favorites", label: "Favorite Meals", icon: Utensils },
        ],
        chef: [
            { to: "/dashboard/profile", label: "Profile", icon: User },
            { to: "/dashboard/create-meal", label: "Create Meal", icon: PlusCircle },
            { to: "/dashboard/my-meals", label: "My Meals", icon: Utensils },
            { to: "/dashboard/order-requests", label: "Order Requests", icon: ClipboardList },
        ],
        admin: [
            { to: "/dashboard/profile", label: "Profile", icon: User },
            { to: "/dashboard/manage-users", label: "Manage Users", icon: Users },
            { to: "/dashboard/manage-requests", label: "Manage Requests", icon: ClipboardList },
            { to: "/dashboard/statistics", label: "Platform Statistics", icon: Settings },
        ],
    };

    const activeMenu = menuItems[backendData?.role] || [];

    return (
        <div className="flex min-h-screen w-full">
            {/* Top Navbar */}
            <nav className={`fixed backdrop-blur-xl top-0 left-0 w-full z-50 bg-neutral-50 dark:bg-neutral-700 border-b border-neutral-100 dark:border-neutral-600 transition-all duration-300`}>
                <Container>
                    <div className="w-full flex justify-between items-center py-3">
                        <div className="flex items-center gap-4">
                            {/* Menu Toggle Button */}
                            <div className="block text-3xl cursor-pointer">
                                <Motion.div
                                    key={open ? "close" : "open"}
                                    initial={{ rotate: open ? -90 : 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {open ? (
                                        <IoClose onClick={handleMenuToggle} />
                                    ) : (
                                        <IoMenuSharp onClick={handleMenuToggle} />
                                    )}
                                </Motion.div>
                            </div>
                            <Logo className={'block'} />
                        </div>

                        <div className="flex items-center gap-2">
                            <ProfileDropdown
                                handleProfileToggle={handleProfileToggle}
                                user={user}
                                profileToggle={profileToggle}
                                handleLogOut={handleLogOut}
                            />
                            <ThemeToggle />
                        </div>
                    </div>
                </Container>
            </nav>

            {/* Sidebar Desktop*/}
            <div
                className={` hidden lg:block
                    fixed top-0 left-0 min-h-screen z-40
                    transition-[width] duration-300 pt-20 overflow-x-hidden
                    bg-neutral-50 dark:bg-neutral-700 border-neutral-100 dark:border-neutral-600 border-r
                    ${open ? "w-64" : "w-0 lg:w-20"}
                `}
            >
                <ul className="space-y-2 p-3">
                    {activeMenu.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `flex items-center py-2 px-3  rounded-lg transition-all 
                                        hover:bg-neutral-300 dark:hover:bg-neutral-500
                                        whitespace-nowrap
                                        ${isActive ? "font-semibold bg-neutral-200 dark:bg-neutral-600" : ""}`
                                    }
                                >
                                    {/* Icon: Centered when closed (desktop), left-margin when open */}
                                    <Icon className={`w-6 h-6 min-w-[24px] ${open ? 'mr-3' : 'mx-auto'}`} />

                                    {/* Text: Visible only when open */}
                                    <span
                                        className={`
                                            transition-opacity duration-300
                                            ${open ? "block opacity-100" : "hidden opacity-0"}
                                        `}
                                    >
                                        {item.label}
                                    </span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </div>
            {/* Sidebar Mobile and tab  */}
            <div
                className={`
                    block
                    lg:hidden
                    fixed top-0 left-0 min-h-screen z-40
                    transition-all duration-300 pt-20
                    ${open ? "w-64 bg-neutral-50 dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600 border-r" : "w-0"}
                `}
            >
                {/* Sidebar content */}
                <div
                    className={`${!open ? 'hidden' : 'block'}`}>
                    <ul className="space-y-2 p-3">
                        {activeMenu.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.to}>
                                    <NavLink
                                        to={item.to}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 py-2 px-3 rounded-lg transition-all hover:bg-neutral-300 dark:hover:bg-neutral-500 ${isActive ? "font-semibold bg-neutral-200 dark:bg-neutral-600" : ""
                                            }`
                                        }
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </div >
            </div >


            {/* Main Content */}
            <div
                className={`
                    flex-1 mt-25 transition-all duration-300 overflow-x-hidden
                    /* Mobile: Content always has 0 margin (sidebar is overlay) */
                    ml-0 
                    /* Desktop: Content pushed by sidebar width */
                    ${open ? "lg:ml-64" : "lg:ml-20"}
                `}
            >
                <Container>
                    <Outlet />
                </Container>
            </div>
        </div>
    );
}