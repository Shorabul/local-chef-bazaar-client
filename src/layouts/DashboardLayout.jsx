import { Outlet, NavLink, Link } from "react-router";
import { useState } from "react";
import {
    Menu,
    X,
    Home,
    User,
    Users,
    PlusCircle,
    Utensils,
    ClipboardList,
    Settings,
    Star,
} from "lucide-react";

import useAuth from "../hooks/useAuth";
import Container from "../components/Shared/Container";

export default function DashboardLayout() {
    const { role } = useAuth();
    const [open, setOpen] = useState(false);
    console.log()
    const menuItems = {
        user: [
            { to: "/dashboard/profile", label: "Profile", icon: User },
            { to: "/dashboard/orders", label: "My Orders", icon: ClipboardList },
            { to: "/dashboard/review", label: "My Review", icon: Star },
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

    const activeMenu = menuItems[role] || [];

    return (
        <Container>
            <div className="flex min-h-screen">

                {/* Sidebar */}
                <div className={`${open ? "w-64" : "w-16"} transition-all duration-300 shadow-md p-5 bg-amber-50 dark:bg-neutral-700`}>
                    {/* </div> */}
                    {/* <div
                className={`${open ? "w-64" : "w-16"} transition-all duration-300 shadow-md p-5 bg-white dark:bg-gray-800`}
            > */}
                    {/* Logo + Toggle */}
                    <div className="flex items-center justify-between mb-6">
                        <Link to="/" className="flex items-center gap-2">
                            <img
                                width="45"
                                height="45"
                                src="/Local-Chef's-bazaar.png"
                                alt=""
                                className="rounded-full shadow-sm"
                            />
                            {/* {open && (
                            <span className="font-bold text-xl text-gray-800 dark:text-white whitespace-nowrap">
                                Local Chef's Bazaar
                            </span>
                        )} */}
                        </Link>

                        <button onClick={() => setOpen(!open)} className="block">
                            {open ? <X /> : <Menu />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <ul className="space-y-2 text-gray-700 dark:text-gray-200">
                        {activeMenu.map((item) => {
                            const Icon = item.icon;

                            return (
                                <li key={item.to}>
                                    <NavLink
                                        to={item.to}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-700 ${isActive
                                                ? "bg-gray-300 dark:bg-gray-700 font-semibold"
                                                : ""
                                            }`
                                        }
                                    >
                                        <Icon className="w-5 h-5 shrink-0" />

                                        {open && <span>{item.label}</span>}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Dashboard Content */}

                <div className="flex-1 p-6 overflow-x-hidden">
                    <Outlet />
                </div>
            </div>
        </Container>
    );
}
