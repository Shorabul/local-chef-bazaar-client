import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { AiOutlineUpload, AiOutlineMail } from "react-icons/ai";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import axios from "axios";


const CreateMeal = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, reset, setValue } = useForm();

    const fetchUserData = async () => {
        try {
            const res = await axiosSecure.get(`/users/${user.email}`);
            setUserData(res.data);

            // Set form default values
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
            // Convert ingredients from comma-separated text → array
            const ingredientsArray = data.ingredients
                .split(",")
                .map(item => item.trim())
                .filter(Boolean);

            // Upload food image
            const formData = new FormData();
            formData.append("image", data.foodImage[0]);
            const imgRes = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
                formData
            );
            const photoURL = imgRes.data.data.url;

            const mealInfo = {
                chefId: userData.chefId,
                chefName: data.chefName,
                chefEmail: data.chefEmail,
                foodName: data.foodName,
                foodImage: photoURL,
                ingredients: ingredientsArray,
                price: data.price,
                deliveryTime: data.
                    deliveryTime,
                chefExperience: data.chefExperience,
            }



            const res = await axiosSecure.post("/meals", mealInfo);

            console.log(res);

            if (res.data.data.insertedId) {
                Swal.fire({
                    icon: "success",
                    title: "Meal Created!",
                    text: `${data.foodName} has been added successfully.`,
                    confirmButtonColor: "#ffcc00",
                });

                reset();

            }

        } catch (err) {
            console.log(err);
        }
    };


    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <Motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen p-6 flex justify-center items-start w-full 
            text-neutral-700 dark:text-neutral-50"
        >
            <Motion.form
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-lg p-6 rounded-2xl shadow-md"
            >
                <h2 className="text-2xl font-bold mb-4">Create Meal</h2>

                <span className="font-semibold">Chef ID: {userData?.chefId}</span>

                <div className="lg:flex gap-2 mt-3">
                    {/* Chef Name */}
                    <div className="w-full mb-3">
                        <label className="block mb-1">Chef Name</label>
                        <input
                            type="text"
                            {...register("chefName")}
                            readOnly
                            className="w-full pl-2 py-3 border rounded-lg 
                            bg-neutral-50 dark:bg-neutral-700 
                            border-gray-300 dark:border-gray-500"
                        />
                    </div>

                    {/* Email */}
                    <div className="w-full mb-3">
                        <label className="block mb-1 flex items-center gap-2">
                            <AiOutlineMail /> Chef Email
                        </label>
                        <input
                            type="email"
                            {...register("chefEmail")}
                            readOnly
                            className="w-full pl-2 py-3 border rounded-lg 
                            bg-neutral-50 dark:bg-neutral-700 
                            border-gray-300 dark:border-gray-500"
                        />
                    </div>
                </div>

                {/* Food Name */}
                <label className="block mb-3">
                    <span>Food Name</span>
                    <input
                        type="text"
                        {...register("foodName", { required: true })}
                        className="w-full pl-2 py-3 border rounded-lg 
                        bg-neutral-50 dark:bg-neutral-700 
                        border-gray-300 dark:border-gray-500"
                    />
                </label>

                {/* Food Image */}
                <label className="block mb-3">
                    <span className="flex items-center gap-2">
                        <AiOutlineUpload /> Food Image
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("foodImage", { required: true })}
                        className="w-full pl-2 py-3 border rounded-lg 
                        bg-neutral-50 dark:bg-neutral-700 
                        border-gray-300 dark:border-gray-500"
                    />
                </label>

                {/* Price */}
                <label className="block mb-3">
                    <span>Price ($)</span>
                    <input
                        type="number"
                        step="0.01"
                        {...register("price", { required: true })}
                        className="w-full pl-2 py-3 border rounded-lg 
                        bg-neutral-50 dark:bg-neutral-700 
                        border-gray-300 dark:border-gray-500"
                    />
                </label>

                {/* Ingredients */}
                <label className="block mb-3">
                    <span>Ingredients (comma-separated)</span>
                    <input
                        type="text"
                        {...register("ingredients", { required: true })}
                        className="w-full pl-2 py-3 border rounded-lg 
                        bg-neutral-50 dark:bg-neutral-700 
                        border-gray-300 dark:border-gray-500"
                    />
                </label>

                {/* Delivery Time */}
                <label className="block mb-3">
                    <span>Estimated Delivery Time</span>
                    <input
                        type="text"
                        {...register("deliveryTime", { required: true })}
                        className="w-full pl-2 py-3 border rounded-lg 
                        bg-neutral-50 dark:bg-neutral-700 
                        border-gray-300 dark:border-gray-500"
                    />
                </label>

                {/* Experience */}
                <label className="block mb-3">
                    <span>Chef Experience</span>
                    <input
                        type="text"
                        {...register("chefExperience", { required: true })}
                        className="w-full pl-2 py-3 border rounded-lg 
                        bg-neutral-50 dark:bg-neutral-700 
                        border-gray-300 dark:border-gray-500"
                    />
                </label>

                {/* Hidden Chef ID */}
                {/* <input type="hidden" {...register("chefId")} /> */}

                <Motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full py-3 rounded-lg bg-yellow-400 
                    text-black font-semibold mt-2 hover:bg-yellow-500 
                    transition"
                >
                    Create Meal
                </Motion.button>
            </Motion.form>
        </Motion.div>
    );
};

export default CreateMeal;
