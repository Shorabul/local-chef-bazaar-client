import { Outlet, NavLink, Link } from "react-router";
import useAuth from "../hooks/useAuth";

const DashboardLayout = () => {
    const { role } = useAuth();
    return (
        <div className="flex min-h-screen">

            {/* Sidebar */}
            <div className="w-64 shadow-md p-5">
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

                <ul className="space-y-2 dark:text-white">
                    {/* User Dashboard */}
                    {
                        role === 'user' && <>
                            <li><NavLink to="/dashboard/profile">Profile</NavLink></li>
                            <li><NavLink to="/dashboard/orders">My Orders</NavLink></li>
                            <li><NavLink to="/dashboard/review">My Review</NavLink></li>
                            <li><NavLink to="/dashboard/favorites">Favorite Meals</NavLink></li>
                        </>
                    }


                    {/* Chef Dashboard */}
                    {
                        role === 'chef' && <>
                            <li><NavLink to="/dashboard/profile">Profile</NavLink></li>
                            <li><NavLink to="/dashboard/create-meal">Create Meal</NavLink></li>
                            <li><NavLink to="/dashboard/my-meals">My Meals</NavLink></li>
                            <li><NavLink to="/dashboard/order-requests">Order Requests</NavLink></li>
                        </>
                    }


                    {/* Admin Dashboard */}
                    {
                        role === 'admin' && <>
                            <li><NavLink to="/dashboard/profile">Profile</NavLink></li>
                            <li><NavLink to="/dashboard/manage-users">Manage Users</NavLink></li>
                            <li><NavLink to="/dashboard/manage-requests">Manage Requests</NavLink></li>
                            <li><NavLink to="/dashboard/statistics">Platform Statistics</NavLink></li>
                        </>
                    }
                </ul>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 p-10">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;
