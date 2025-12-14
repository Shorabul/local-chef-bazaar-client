import {
    Outlet, NavLink, Link,
    // useNavigation, useLocation,
} from "react-router";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { IoMenuSharp, IoClose } from "react-icons/io5";
import ThemeToggle from "../components/ThemeToggle";
import ProfileDropdown from "../components/ProfileDropdown";
import Swal from "sweetalert2";
import { motion as Motion, AnimatePresence } from "framer-motion";
import Container from "../components/Shared/Container";
import PageLoader from "../pages/PageLoader/PageLoader";
// import { useEffect } from "react";
import {
    User,
    Users,
    PlusCircle,
    Utensils,
    ClipboardList,
    Settings,
    Star,
} from "lucide-react";

export default function DashboardLayout() {
    const { user, backendData, logOut } = useAuth();
    const [open, setOpen] = useState(false);
    const [profileToggle, setProfileToggle] = useState(false);
    const handleMenuToggle = () => setOpen(!open);
    // const navigation = useNavigation();
    // const location = useLocation();
    // const [delayedLoader, setDelayedLoader] = useState(false);

    // useEffect(() => {
    //     setDelayedLoader(true);

    //     const timer = setTimeout(() => {
    //         setDelayedLoader(false);
    //     }, 500);

    //     return () => clearTimeout(timer);
    // }, [location.pathname]);

    // const showLoader = navigation.state === "loading" || delayedLoader;

    const handleProfileToggle = () => setProfileToggle(!profileToggle);

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
            {/* {showLoader && <PageLoader />} */}
            {/* Top Navbar */}
            <nav className="fixed backdrop-blur-xl top-0 left-0 w-full z-50">
                <Container>
                    <div className="w-full flex justify-between items-center py-3">
                        {/* Menu Icon */}
                        <div className="block text-3xl text-neutral-700 dark:text-neutral-50 cursor-pointer">
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

                        <Link to="/" className="flex items-center gap-2">
                            <img
                                width="45"
                                height="45"
                                src="https://i.ibb.co/WNVv4py3/Loc-Chef.png"
                                alt="Loc Chef"
                                className="rounded-full shadow-sm"
                            />
                            <span className="font-semibold text-lg">Locchef</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            <ProfileDropdown
                                handleProfileToggle={handleProfileToggle}
                                user={user}
                                profileToggle={profileToggle}
                                handleLogOut={handleLogOut}
                            ></ProfileDropdown>

                            <ThemeToggle />
                        </div>
                    </div>
                </Container>

            </nav>

            {/* Sidebar */}
            <div
                className={`
                    fixed top-0 left-0 min-h-screen z-40
                    transition-all duration-300 pt-20
                    ${open ? "w-64 bg-white dark:bg-neutral-800" : "w-0"}
                `}
            >
                {/* Sidebar content */}
                <div
                    className={`${!open ? 'hidden' : 'block'}`}>
                    <ul className="space-y-2">
                        {activeMenu.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.to}>
                                    <NavLink
                                        to={item.to}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-600 ${isActive ? "font-semibold" : ""
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
            < div className="flex-1 pt-16 overflow-x-hidden mt-6" >
                <Container>

                    <Outlet />
                </Container>
            </div >
        </div >
    );
}
