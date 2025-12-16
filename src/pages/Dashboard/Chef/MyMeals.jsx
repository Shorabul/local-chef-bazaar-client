import React from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Skeleton from "../../../components/Skeleton";
import EmptyState from "../../../components/EmptyState";
import { LayoutDashboard, Trash2, Edit } from "lucide-react";
import { usePageTitle } from "../../../hooks/usePageTitle";

const MyMeals = () => {
    usePageTitle('My Meals');
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

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex flex-col items-center mb-10"> {/* Increased bottom margin */}
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-xl shadow-lg p-6 bg-neutral-200 dark:bg-neutral-800 border dark:border-neutral-700" // Updated styling
                        >
                            <Skeleton className="h-48 w-full mb-4 rounded-xl" /> {/* Taller image placeholder */}
                            <Skeleton className="h-6 w-3/4 mb-3" />
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-4 w-1/2 mb-1" />
                            <Skeleton className="h-4 w-2/3 mb-4" />
                            <div className="flex gap-4"> {/* Increased gap */}
                                <Skeleton className="h-10 w-24 rounded-lg" />
                                <Skeleton className="h-10 w-24 rounded-lg" />
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
                staggerChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <Motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen w-full transition-colors duration-300"
        >

            {/* Header */}
            <Motion.div className="flex flex-col items-center justify-center mb-6">
                <h1 className="text-center font-bold text-2xl">My Meals</h1>
                <p className="flex gap-2">
                    <span className="opacity-80 flex items-center gap-2">
                        <LayoutDashboard size={16} />Dashboard
                    </span>
                    <span>/ my meals</span>
                </p>
            </Motion.div>

            {/* Empty State */}
            {meals.length === 0 ? (
                <EmptyState message="No meals found. Create one!" />
            ) : (
                //Meal Cards 
                <Motion.div
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                    {meals.map((meal) => (
                        <Motion.div
                            key={meal._id}
                            variants={cardVariants}
                            whileHover={{
                                scale: 1.03,
                                boxShadow: isDark ? "0 15px 30px rgba(0, 0, 0, 0.4)" : "0 10px 20px rgba(0, 0, 0, 0.1)"
                            }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="rounded-xl shadow-lg border border-transparent hover:border-yellow-500/50 p-5 bg-white dark:bg-neutral-800 transition-all duration-300 overflow-hidden" >

                            {/* Meal Image Container for better aspect ratio control */}
                            <div className="w-full h-48 mb-4 overflow-hidden rounded-lg">
                                <img
                                    src={meal.foodImage}
                                    alt={meal.foodName}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>

                            {/* Meal Information */}
                            <h2 className="text-2xl font-extrabold mb-2 truncate">
                                {meal.foodName}
                            </h2>
                            <p className="text-3xl font-bold text-[#ffde59] mb-4">${meal.price}</p> {/* Highlighted Price */}

                            <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300 border-t pt-4 mt-4 border-gray-100 dark:border-neutral-700">
                                <InfoItem label="Chef" value={meal.chefName} />
                                <InfoItem label="Experience" value={meal.chefExperience} />
                                <InfoItem label="Delivery Time" value={meal.deliveryTime} />
                                <InfoItem label="Rating" value={`${meal.rating} / 5`} className="font-semibold text-amber-500 dark:text-amber-400" />
                                <InfoItem label="Created" value={new Date(meal.createdAt).toLocaleDateString()} />
                            </div>


                            {/* Actions */}
                            <div className="flex gap-4 mt-6">
                                <button
                                    onClick={() => handleDelete(meal._id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold shadow-md hover:shadow-lg transition-all"
                                >
                                    <Trash2 size={18} /> Delete
                                </button>

                                <Link
                                    to={`/dashboard/meal-update/${meal._id}`}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#ffde59] text-black rounded-lg hover:bg-yellow-400 font-semibold shadow-md hover:shadow-lg transition-all"
                                >
                                    <Edit size={18} /> Update
                                </Link>
                            </div>
                        </Motion.div>
                    ))}


                </Motion.div>
            )}
        </Motion.div>
    );
};

// Helper component for cleaner information display
const InfoItem = ({ label, value, className = "" }) => (
    <p className={`flex justify-between items-center ${className}`}>
        <strong className="font-medium">{label}:</strong>
        <span className="ml-2 truncate">{value}</span>
    </p>
);

export default MyMeals;