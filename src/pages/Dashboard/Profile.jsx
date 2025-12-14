import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Skeleton from "../../components/Skeleton";

const Profile = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const isDark = document.documentElement.classList.contains("dark");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosSecure.get(`/users/${user.email}`);
                setUserData(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (user?.email) fetchUser();
    }, [user, axiosSecure]);

    const handleRoleRequest = async (roleType) => {
        try {
            await axiosSecure.post("/role-requests", {
                userName: userData.displayName,
                userEmail: userData.email,
                requestType: roleType,
            });
            Swal.fire({
                title: "Submitted",
                text: `Your request to become a ${roleType} has been submitted!`,
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                background: isDark ? "#262626" : "#ffffff",
                color: isDark ? "#ffffff" : "#262626",
            });

            // Update local userData so button disables immediately
            setUserData(prev => ({
                ...prev,
                roleRequest: {
                    ...prev.roleRequest,
                    [roleType]: "pending"
                }
            }));
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: `Your request to become ${roleType} failed.`,
                icon: "error",
                background: isDark ? "#262626" : "#ffffff",
                color: isDark ? "#ffffff" : "#262626",
                iconColor: "#fb2c36",
                confirmButtonColor: "#fb2c36",
            });
        }
    };

    if (loading) {
        return <div className="max-w-xl mx-auto bg-neutral-50 dark:bg-neutral-600 p-6 rounded-xl shadow-lg mt-8">
            <div className="flex flex-col items-center">
                {/* Avatar */}
                <Skeleton className="w-32 h-32 rounded-full mb-4" />

                {/* Name */}
                <Skeleton className="h-6 w-40 mb-2" />

                {/* Email */}
                <Skeleton className="h-4 w-52 mb-2" />

                {/* Address */}
                <Skeleton className="h-4 w-44 mb-2" />

                {/* Role */}
                <Skeleton className="h-4 w-32 mt-2 mb-1" />

                {/* Status */}
                <Skeleton className="h-4 w-28 mb-2" />

                {/* Chef ID (optional placeholder) */}
                <Skeleton className="h-4 w-36 mt-1" />
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-6">
                <Skeleton className="h-10 w-32 rounded-md" />
                <Skeleton className="h-10 w-32 rounded-md" />
            </div>
        </div>

    }

    const chefRequestPending = userData?.roleRequest?.chef === "pending";
    const adminRequestPending = userData?.roleRequest?.admin === "pending";

    return (
        <Motion.div
            className="max-w-xl mx-auto bg-neutral-50 dark:bg-neutral-600 text-black dark:text-white p-6 rounded-xl shadow-lg mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col items-center">
                <img
                    src={userData?.photoURL}
                    alt="profile"
                    className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <h2 className="text-2xl font-bold text-brand dark:text-brand">{userData?.displayName}</h2>
                <p>{userData?.email}</p>
                <p>{userData?.address}</p>
                <p className="mt-2 font-medium">Role: <span className="text-yellow-500 dark:text-brand">{userData?.role}</span></p>
                <p className="font-medium">Status: {userData?.status}</p>
                {userData?.role === "chef" && (
                    <p className="font-medium">Chef ID: {userData?.chefId}</p>
                )}
            </div>

            {/* Role request buttons */}
            <div className="flex justify-center gap-4 mt-6">
                {userData?.role === "user" && (
                    <Motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`bg-[#ffde59] hover:bg-yellow-400 text-black dark:text-black font-semibold py-2 px-6 text-xs md:text-sm lg:text-base rounded-md shadow ${chefRequestPending ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => handleRoleRequest("chef")}
                        disabled={chefRequestPending}
                    >
                        {chefRequestPending ? "Chef Request Pending" : "Be a Chef"}
                    </Motion.button>
                )}
                {userData?.role !== "admin" && (
                    <Motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-6 text-xs md:text-sm lg:text-base rounded-md shadow ${adminRequestPending ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => handleRoleRequest("admin")}
                        disabled={adminRequestPending}
                    >
                        {adminRequestPending ? "Admin Request Pending" : "Be an Admin"}
                    </Motion.button>
                )}
            </div>
        </Motion.div>
    );
};

export default Profile;
