import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import axios from "axios";
import { LayoutDashboard } from "lucide-react";
import Skeleton from "../../../components/Skeleton";

const CreateMeal = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, setValue } = useForm();

    const isDark = document.documentElement.classList.contains("dark");

    const fetchUserData = async () => {
        try {
            const res = await axiosSecure.get(`/users/${user.email}`);
            setUserData(res.data);

            setValue("chefName", res.data?.displayName || "");
            setValue("chefEmail", res.data?.email || "");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email) {
            fetchUserData();
        }
    }, [user]);

    const onSubmit = async (data) => {
        try {
            const ingredientsArray = data.ingredients
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

            // Upload image
            const formData = new FormData();
            formData.append("image", data.foodImage[0]);

            const imgRes = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
                formData
            );

            const mealInfo = {
                chefId: userData.chefId,
                chefName: data.chefName,
                chefEmail: data.chefEmail,
                foodImage: imgRes.data.data.url,
                foodName: data.foodName,
                ingredients: ingredientsArray,
                price: data.price,
                deliveryTime: `${data.deliveryTime} minutes`,
                deliveryArea: data.deliveryArea,
                deliveryRadius: data.deliveryRadius,
                chefExperience: data.chefExperience,
                rating: "0",
            };

            const res = await axiosSecure.post("/meals", mealInfo);

            if (res.data.data.insertedId) {
                Swal.fire({
                    title: "Success",
                    text: `${data.foodName} has been created successfully.`,
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                    background: isDark ? "#262626" : "#ffffff",
                    color: isDark ? "#ffffff" : "#262626",
                });

            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error",
                text: "Failed to create the meal",
                icon: "error",
                background: isDark ? "#262626" : "#ffffff",
                color: isDark ? "#ffffff" : "#262626",
                iconColor: "#fb2c36",
                confirmButtonColor: "#fb2c36",
            });
        }
    };

    /* Skeleton Loader */
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center w-full p-6">
                <div className="w-full max-w-4xl space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <Skeleton className="h-8 w-40 mx-auto" />
                        <Skeleton className="h-4 w-32 mx-auto" />
                    </div>

                    {/* General Info */}
                    <div className="border rounded-xl p-4 bg-neutral-100 dark:bg-neutral-700 space-y-4">
                        <Skeleton className="h-6 w-48" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full md:col-span-2" />
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="border rounded-xl p-4 bg-neutral-100 dark:bg-neutral-700 space-y-4">
                        <Skeleton className="h-6 w-48" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>

                    {/* Meal Details */}
                    <div className="border rounded-xl p-4 bg-neutral-100 dark:bg-neutral-700 space-y-4">
                        <Skeleton className="h-6 w-48" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>

                    {/* Media Upload */}
                    <div className="border rounded-xl p-4 bg-neutral-100 dark:bg-neutral-700 space-y-4">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-10 w-full" />
                    </div>

                    {/* Submit Button */}
                    <Skeleton className="h-12 w-full rounded-lg" />
                </div>
            </div>
        );
    }

    // Fraud check
    if (userData?.status === "fraud") {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <div className="text-center p-6 bg-red-100 border border-red-300 rounded-lg">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
                    <p className="text-gray-700">
                        You have been marked as <span className="font-semibold">fraud</span>.
                        Chefs with fraud status cannot create meals.
                    </p>
                </div>
            </div>
        );
    }

    /* Animations */
    const cardVariant = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    };

    const containerVariant = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    return (
        <Motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariant}
            className="min-h-screen flex justify-center w-full"
        >
            <Motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-4xl space-y-6"
            >
                {/* Header */}
                <Motion.div variants={cardVariant} className="text-center">
                    <h1 className="font-bold text-2xl">Create Meal</h1>
                    <p className="flex justify-center gap-2 text-sm opacity-80">
                        <LayoutDashboard size={16} /> Dashboard / Create Meal
                    </p>
                </Motion.div>

                {/* General Info */}
                <Motion.div
                    variants={cardVariant}
                    className="border rounded-xl p-4 shadow-sm bg-neutral-50 dark:bg-neutral-700"
                >
                    <h3 className="text-lg font-semibold mb-4">General Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            {...register("chefName")}
                            readOnly
                            className="px-3 py-2 rounded-lg border bg-white dark:bg-neutral-800"
                        />
                        <input
                            type="email"
                            {...register("chefEmail")}
                            readOnly
                            className="px-3 py-2 rounded-lg border bg-white dark:bg-neutral-800"
                        />
                        <input
                            type="text"
                            placeholder="Food Name"
                            {...register("foodName", { required: true })}
                            className="md:col-span-2 px-3 py-2 rounded-lg border bg-white dark:bg-neutral-800"
                        />
                    </div>
                </Motion.div>

                {/* Pricing */}
                <Motion.div
                    variants={cardVariant}
                    className="border rounded-xl p-4 shadow-sm bg-neutral-50 dark:bg-neutral-700"
                >
                    <h3 className="text-lg font-semibold mb-4">Pricing</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="number"
                            placeholder="Price"
                            {...register("price", { required: true })}
                            className="px-3 py-2 rounded-lg border bg-white dark:bg-neutral-800"
                        />
                        <input
                            type="text"
                            placeholder="Delivery Time (minutes)"
                            {...register("deliveryTime", { required: true })}
                            className="px-3 py-2 rounded-lg border bg-white dark:bg-neutral-800"
                        />
                    </div>
                </Motion.div>

                {/* Meal Details */}
                <Motion.div
                    variants={cardVariant}
                    className="border rounded-xl p-4 shadow-sm bg-neutral-50 dark:bg-neutral-700"
                >
                    <h3 className="text-lg font-semibold mb-4">Meal Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Ingredients (comma-separated)"
                            {...register("ingredients", { required: true })}
                            className="px-3 py-2 rounded-lg border bg-white dark:bg-neutral-800"
                        />
                        <input
                            type="text"
                            placeholder="Chef Experience"
                            {...register("chefExperience", { required: true })}
                            className="px-3 py-2 rounded-lg border bg-white dark:bg-neutral-800"
                        />
                        <input
                            type="text"
                            placeholder="Delivery Area"
                            {...register("deliveryArea", { required: true })}
                            className="px-3 py-2 rounded-lg border bg-white dark:bg-neutral-800"
                        />
                        <input
                            type="number"
                            step="0.1"
                            placeholder="Delivery Radius (km)"
                            {...register("deliveryRadius", { required: true })}
                            className="px-3 py-2 rounded-lg border bg-white dark:bg-neutral-800"
                        />
                    </div>
                </Motion.div>

                {/* Media Upload */}
                <Motion.div
                    variants={cardVariant}
                    className="border rounded-xl p-4 shadow-sm bg-neutral-50 dark:bg-neutral-700"
                >
                    <h3 className="text-lg font-semibold mb-4">Product Media</h3>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("foodImage", { required: true })}
                        className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-neutral-800"
                    />
                </Motion.div>

                {/* Submit */}
                <Motion.button
                    whileTap={{ scale: 0.95 }}
                    variants={cardVariant}
                    type="submit"
                    className="w-full py-3 rounded-lg bg-[#ffde59] text-black font-semibold hover:bg-yellow-400 transition"
                >
                    Create Meal
                </Motion.button>
            </Motion.form>
        </Motion.div>
    );
};

export default CreateMeal;
