import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { LayoutDashboard } from "lucide-react";
import Skeleton from "../../../components/Skeleton";
import EmptyState from "../../../components/EmptyState";
import { motion as Motion } from "framer-motion";
import { usePageTitle } from "../../../hooks/usePageTitle";

const FavoriteMeals = () => {
    usePageTitle('Favorite Meals');
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const isDark = document.documentElement.classList.contains("dark");

    const { data: favorites = [], isLoading, refetch } = useQuery({
        queryKey: ["favorites", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/favorites?userEmail=${user.email}`);
            return res.data.data || res.data;
        },
        enabled: !!user?.email,
    });

    const handleDelete = async (mealId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to remove this meal from favorites?",
            icon: "warning",
            background: isDark ? "#262626" : "#ffffff",
            color: isDark ? "#ffffff" : "#262626",
            iconColor: "#facc15",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#fb2c36",
            cancelButtonColor: "#a1a1a1",
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/favorites/${mealId}`);

                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Meal removed from favorites.",
                    timer: 2000,
                    showConfirmButton: false,
                    background: isDark ? "#262626" : "#ffffff",
                    color: isDark ? "#ffffff" : "#262626",
                });

                refetch();
            } catch (error) {
                console.log(error);
                Swal.fire({
                    title: "Error",
                    text: "Failed to delete favorite meal",
                    icon: "error",
                    background: isDark ? "#262626" : "#ffffff",
                    color: isDark ? "#ffffff" : "#262626",
                    iconColor: "#fb2c36",
                    confirmButtonColor: "#fb2c36",
                });
            }
        }
    };

    const dateOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // Use AM/PM format
    };

    // Skeleton Loader
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
                            <tr className="bg-yellow-400 text-black">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <th key={i} className="px-4 py-2">
                                        <Skeleton className="h-4 w-20" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4].map((i) => (
                                <tr key={i}>
                                    {Array.from({ length: 6 }).map((_, j) => (
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

    // Animation
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut",
                staggerChildren: 0.05,
            },
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
            <Motion.div className="flex flex-col items-center justify-center mb-6">
                <h1 className="text-center font-bold text-2xl">Favorite Meals</h1>
                <p className="flex gap-2">
                    <span className="opacity-80 flex items-center gap-2">
                        <LayoutDashboard size={16} />Dashboard
                    </span>
                    <span>/ favorite meals</span>
                </p>
            </Motion.div>

            {/* Empty State */}
            {favorites.length === 0 ? (
                <EmptyState message="No favorite meals added yet." />
            ) : (
                /* Table */
                <div className="overflow-x-auto rounded-xl shadow bg-neutral-50 dark:bg-neutral-700">
                    <table className="table-auto w-full text-left">
                        <thead className="bg-[#ffde59] text-black text-sm uppercase tracking-wide">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Meal Name</th>
                                <th className="px-4 py-3">Chef Name</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>

                        <tbody className="text-gray-500 dark:text-gray-300 text-sm">
                            {favorites?.map((fav, i) => (
                                <Motion.tr
                                    key={fav?._id}
                                    variants={rowVariants}
                                    whileHover={{ scale: 1.01, backgroundColor: "rgba(0,0,0,0.03)" }}
                                    className="border-b border-neutral-200 dark:border-neutral-600 transition"
                                >
                                    <td className="px-4 py-3">{i + 1}</td>
                                    <td className="px-4 py-3 font-semibold">{fav?.foodName}</td>
                                    <td className="px-4 py-3">{fav?.chefName}</td>
                                    <td className="px-4 py-3">
                                        {fav?.price ? `$${Number(fav.price).toFixed(2)}` : "N/A"}
                                    </td>
                                    <td className="px-4 py-3">
                                        {/* {new Date(fav?.createdAt).toLocaleDateString("en-GB")} */}
                                        {new Date(fav?.createdAt).toLocaleString('en-US', dateOptions)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDelete(fav?._id)}
                                            className="px-3 py-2 rounded-lg text-white text-xs md:text-sm lg:text-base font-semibold bg-red-500 hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </Motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Motion.div>
    );
};

export default FavoriteMeals;