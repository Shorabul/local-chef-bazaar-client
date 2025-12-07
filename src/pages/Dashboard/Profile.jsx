import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Profile = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log(userData);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosSecure.get(`/users/${user.email}`);
                setUserData(res.data);
            } catch (err) {
                console.error(err);
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
            Swal.fire("Success", `Your request to become ${roleType} is submitted!`, "success");

            // Update local userData so button disables immediately
            setUserData(prev => ({
                ...prev,
                roleRequest: {
                    ...prev.roleRequest,
                    [roleType]: "pending"
                }
            }));
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Failed to submit request", "error");
        }
    };

    if (loading) return <p className="text-center mt-4 dark:text-white">Loading...</p>;

    const chefRequestPending = userData?.roleRequest?.chef === "pending";
    const adminRequestPending = userData?.roleRequest?.admin === "pending";

    return (
        <Motion.div
            className="max-w-xl mx-auto bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-xl shadow-lg mt-8"
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
                        className={`bg-brand hover:bg-yellow-400 text-black dark:text-black font-semibold py-2 px-6 rounded-md shadow ${chefRequestPending ? "opacity-50 cursor-not-allowed" : ""}`}
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
                        className={`bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded-md shadow ${adminRequestPending ? "opacity-50 cursor-not-allowed" : ""}`}
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
