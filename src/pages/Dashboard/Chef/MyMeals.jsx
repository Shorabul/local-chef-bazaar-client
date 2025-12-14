import React from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Skeleton from "../../../components/Skeleton";
import EmptyState from "../../../components/EmptyState";
import { LayoutDashboard } from "lucide-react";

const MyMeals = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const isDark = document.documentElement.classList.contains("dark");

    const { data: meals = [], refetch, isLoading, } = useQuery({
        queryKey: ["meals", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/meals/chef/${user.email}`);
            return res.data.data || [];
        },
        enabled: !!user?.email,
    });

    // Delete Handler
    const handleDelete = async (mealId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            iconColor: "#facc15",
            background: isDark ? "#262626" : "#ffffff",
            color: isDark ? "#ffffff" : "#262626",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            confirmButtonColor: "#fb2c36",
            cancelButtonText: "Cancel",
            cancelButtonColor: "#a1a1a1",
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/meals/${mealId}`);

                if (res.data?.data?.deletedCount) {
                    Swal.fire({
                        icon: "success",
                        title: "Deleted!",
                        text: "The meal has been removed.",
                        timer: 2000,
                        showConfirmButton: false,
                        background: isDark ? "#262626" : "#ffffff",
                        color: isDark ? "#ffffff" : "#262626",
                    });

                    refetch();
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: "Error",
                    text: "Failed to delete the meal",
                    icon: "error",
                    background: isDark ? "#262626" : "#ffffff",
                    color: isDark ? "#ffffff" : "#262626",
                    iconColor: "#fb2c36",
                    confirmButtonColor: "#fb2c36",
                });
            }
        }
    };


    // Skeleton Loader 
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex flex-col items-center mb-6">
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="border rounded-lg shadow p-4 bg-neutral-100 dark:bg-neutral-800"
                        >
                            <Skeleton className="h-40 w-full mb-3 rounded-md" />
                            <Skeleton className="h-6 w-32 mb-2" />
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-4 w-28 mb-1" />
                            <Skeleton className="h-4 w-20 mb-1" />
                            <Skeleton className="h-4 w-28 mb-3" />
                            <div className="flex gap-2">
                                <Skeleton className="h-10 w-20" />
                                <Skeleton className="h-10 w-20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }


    // Animation Variants
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.06,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.92 },
        visible: { opacity: 1, scale: 1 },
    };

    return (
        <Motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen w-full p-4"
        >
            {/* Header */}
            <Motion.div variants={cardVariants} className="text-center mb-6">
                <h1 className="font-bold text-3xl">My Meals</h1>
                <p className="flex justify-center gap-2 text-sm opacity-80 mt-1">
                    <LayoutDashboard size={16} /> Dashboard / My Meals
                </p>
            </Motion.div>

            {/* Empty State */}
            {meals.length === 0 ? (
                <EmptyState message="No meals found. Create one!" />
            ) : (
                //Meal Cards 
                <Motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {meals.map((meal) => (
                        <Motion.div
                            key={meal._id}
                            variants={cardVariants}
                            whileHover={{ scale: 1.02 }}
                            className="rounded-lg shadow-md p-4 bg-neutral-50 dark:bg-neutral-600 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all ease-in-out"
                        >
                            {/* Meal Image */}
                            <img
                                src={meal.foodImage}
                                alt={meal.foodName}
                                className="w-full h-40 object-cover rounded-md mb-3"
                            />

                            {/* Meal Information */}
                            <h2 className="text-xl font-bold mb-1">{meal.foodName}</h2>

                            <div className="text-gray-500 dark:text-gray-300 text-sm space-y-1">
                                {Object.entries(meal).map(([key, value]) => {
                                    // Skip unwanted fields
                                    if (key === "_id" || key === "foodImage") return null;

                                    // Format arrays
                                    const displayValue = Array.isArray(value)
                                        ? value.join(", ")
                                        : value;

                                    return (
                                        <p key={key}>
                                            <strong className="capitalize">
                                                {key.replace(/([A-Z])/g, " $1")}:
                                            </strong>{" "}
                                            {displayValue}
                                        </p>
                                    );
                                })}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleDelete(meal._id)}
                                    className="px-3 py-2  bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
                                >
                                    Delete
                                </button>

                                <Link
                                    to={`/dashboard/meal-update/${meal._id}`}
                                    className="px-3 py-2  bg-[#ffde59] text-black rounded-lg hover:bg-yellow-400 font-semibold"
                                >
                                    Update
                                </Link>
                            </div>
                        </Motion.div>
                    ))}


                </Motion.div>
            )}
        </Motion.div>
    );
};

export default MyMeals;
