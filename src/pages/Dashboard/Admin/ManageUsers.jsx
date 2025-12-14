import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Skeleton from "../../../components/Skeleton";
import EmptyState from "../../../components/EmptyState";
import { UserCog } from "lucide-react";
import { motion as Motion } from "framer-motion";

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const isDark = document.documentElement.classList.contains("dark");

    const { data: users = [], refetch, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");
            return res.data.data;
        },
    });

    const handleFraud = async (email, name) => {
        try {
            const res = await axiosSecure.patch(`/users/${email}`, {
                status: "fraud",
            });
            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    icon: "success",
                    title: "Meal Created!",
                    text: `${name}'s status has been updated to fraud.`,
                    timer: 2000,
                    showConfirmButton: false,
                    background: isDark ? "#262626" : "#ffffff",
                    color: isDark ? "#ffffff" : "#262626",
                });
                refetch();
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error",
                text: "Update failed",
                icon: "error",
                background: isDark ? "#262626" : "#ffffff",
                color: isDark ? "#ffffff" : "#262626",
                iconColor: "#fb2c36",
                confirmButtonColor: "#fb2c36",
            });
        }
    };

    // Skeleton while loading
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex flex-col items-center justify-center mb-6">
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>

                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-[#ffde59] text-black">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <th key={i} className="px-4 py-2">
                                        <Skeleton className="h-4 w-20" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4].map((i) => (
                                <tr key={i}>
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <td key={j} className="px-4 py-3">
                                            <Skeleton className="h-4 w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }


    if (users.length === 0) {
        return <EmptyState message="No users found." />;
    }

    // Animations
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.05 },
        },
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <Motion.div
            className="overflow-x-auto w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <Motion.div className="text-center mb-6">
                <h1 className="font-bold text-2xl">Manage Users</h1>
                <p className="flex justify-center gap-2 text-sm opacity-80">
                    <UserCog size={16} /> Dashboard / Users
                </p>
            </Motion.div>

            {
                // Empty State
                users.length === 0 ? <EmptyState message="No users found." />
                    : <>
                        {/* Table */}
                        <div className="overflow-x-auto rounded-xl shadow bg-neutral-50 dark:bg-neutral-700">
                            <table className="table-auto w-full text-left">
                                <thead className="bg-[#ffde59] text-black text-sm uppercase tracking-wide">
                                    <tr>
                                        <th className="px-4 py-3">#</th>
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Role</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="text-neutral-600 dark:text-neutral-300 text-sm">
                                    {users.map((user, i) => (
                                        <Motion.tr
                                            key={user._id}
                                            variants={rowVariants}
                                            whileHover={{ scale: 1.01, backgroundColor: "rgba(0,0,0,0.03)" }}
                                            className="border-b border-neutral-200 dark:border-neutral-600 transition"
                                        >
                                            <td className="px-4 py-3">{i + 1}</td>

                                            {/* Name + Email */}
                                            <td className="px-4 py-3">
                                                <div className="font-semibold">{user.displayName}</div>
                                                <div className="text-xs opacity-70">{user.email}</div>
                                            </td>

                                            {/* Role Badge */}
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold text-white 
                                            ${user.role === "admin"
                                                            ? "bg-blue-500"
                                                            : "bg-green-500"
                                                        }
                                        `}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold text-white 
                                            ${user.status === "fraud"
                                                            ? "bg-red-500"
                                                            : "bg-gray-500"
                                                        }
                                        `}
                                                >
                                                    {user.status}
                                                </span>
                                            </td>

                                            {/* Button */}
                                            <td className="px-4 py-3">
                                                {user.role !== "admin" && user.status === "active" && (
                                                    <button
                                                        onClick={() => handleFraud(user.email, user.displayName)}
                                                        className="px-3 py-1.5 rounded text-black bg-[#ffde59] text-xs font-semibold hover:bg-yellow-400"
                                                    >
                                                        Mark Fraud
                                                    </button>
                                                )}
                                            </td>
                                        </Motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
            }


        </Motion.div>
    );
};

export default ManageUsers;