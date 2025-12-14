import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import axios from "axios";
import Skeleton from "../../../components/Skeleton";
import { LayoutDashboard } from "lucide-react";

const UpdateMeal = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, setValue } = useForm();
    const [loading, setLoading] = useState(true);
    const [mealData, setMealData] = useState(null);
    const isDark = document.documentElement.classList.contains("dark");

    /* Fetch the meal */
    const fetchMeal = async () => {
        try {
            const res = await axiosSecure.get(`/meals/id/${id}`);
            const data = res.data?.data;
            setMealData(data);

            setValue("chefName", data.chefName);
            setValue("chefEmail", data.chefEmail);
            setValue("foodName", data.foodName);
            setValue("price", data.price);
            setValue("deliveryTime", data.deliveryTime.replace(" minutes", ""));
            setValue("ingredients", data.ingredients.join(", "));
            setValue("chefExperience", data.chefExperience);
            setValue("deliveryArea", data.deliveryArea);
            setValue("deliveryRadius", data.deliveryRadius);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeal();
    }, [id]);

    /* Handle Update */
    const onSubmit = async (data) => {
        try {
            const ingredientsArray = data.ingredients
                .split(",")
                .map((i) => i.trim())
                .filter(Boolean);

            let photoURL = mealData.foodImage;

            if (data.foodImage?.length > 0) {
                const formData = new FormData();
                formData.append("image", data.foodImage[0]);

                const imgRes = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
                    formData
                );

                photoURL = imgRes.data.data.url;
            }

            const updatedMeal = {
                foodName: data.foodName,
                foodImage: photoURL,
                ingredients: ingredientsArray,
                price: data.price,
                deliveryTime: `${data.deliveryTime} minutes`,
                chefExperience: data.chefExperience,
                deliveryArea: data.deliveryArea,
                deliveryRadius: data.deliveryRadius
            };

            const res = await axiosSecure.patch(`/meals/${id}`, updatedMeal);

            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    icon: "success",
                    title: "Updated",
                    text: `${data.foodName} updated successfully!`,
                    timer: 2000,
                    showConfirmButton: false,
                    background: isDark ? "#262626" : "#ffffff",
                    color: isDark ? "#ffffff" : "#262626",
                });
            }
        } catch (err) {
            console.log(err);
            Swal.fire({
                title: "Error",
                text: "Failed to update the meal!",
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
            <div className="w-full max-w-4xl mx-auto space-y-6 p-6">
                <div className="flex flex-col items-center mb-4">
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>

                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="border rounded-xl p-6 bg-neutral-100 dark:bg-neutral-700"
                    >
                        <Skeleton className="h-6 w-40 mb-4" />
                        <Skeleton className="h-10 w-full mb-3" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
                <Skeleton className="h-12 w-full rounded-lg" />
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
        visible: { transition: { staggerChildren: 0.08 } },
    };

    return (
        <Motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariant}
            className="min-h-screen flex justify-center w-full mb-6"
        >
            <Motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-4xl space-y-6"
            >
                {/* Header */}
                <Motion.div variants={cardVariant} className="text-center">
                    <h1 className="font-bold text-2xl">Update Meal</h1>
                    <p className="flex justify-center gap-2 text-sm opacity-80">
                        <LayoutDashboard size={16} /> Dashboard / Update Meal
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
                    <h3 className="text-lg font-semibold mb-4">Replace Image</h3>

                    {/* Old image preview */}
                    <img
                        src={mealData.foodImage}
                        alt="Meal"
                        className="w-40 h-32 object-cover rounded-md mb-3"
                    />

                    <input
                        type="file"
                        accept="image/*"
                        {...register("foodImage")}
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
                    Update Meal
                </Motion.button>
            </Motion.form>
        </Motion.div>
    );
};

export default UpdateMeal;