// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router";
// import { useForm } from "react-hook-form";

// import Swal from "sweetalert2";
// import useAxiosSecure from "../../hooks/useAxiosSecure";
// import useAuth from "../../hooks/useAuth";

// const OrderConfirm = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const axiosSecure = useAxiosSecure();
//     const { user } = useAuth();

//     const [meal, setMeal] = useState(null);
//     const [loading, setLoading] = useState(true);

//     const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
//         defaultValues: { quantity: 1, userAddress: "" }
//     });

//     const quantity = watch("quantity") || 1;
//     const isDark = document.documentElement.classList.contains("dark");

//     useEffect(() => {
//         const fetchMeal = async () => {
//             try {
//                 const res = await axiosSecure.get(`/meals/id/${id}`);
//                 setMeal(res.data.data);
//                 setValue("quantity", 1);
//             } catch (error) {
//                 console.error(error);
//                 Swal.fire({
//                     icon: "error",
//                     title: "Failed to load meal",
//                     text: "Something went wrong while fetching the meal.",
//                     background: isDark ? "#262626" : "#ffffff",
//                     color: isDark ? "#ffffff" : "#262626",
//                     iconColor: "#fb2c36",
//                     confirmButtonColor: "#fb2c36",
//                 });
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchMeal();
//     }, [id, axiosSecure, setValue, isDark]);

//     const onSubmit = async (data) => {
//         if (!meal) return;
//         const totalPrice = meal.price * data.quantity;
//         const confirmResult = await Swal.fire({
//             title: "Confirm Order",
//             text: `Your total price is $${totalPrice}. Do you want to place this order?`,
//             icon: "question",
//             background: isDark ? "#262626" : "#ffffff",
//             color: isDark ? "#ffffff" : "#262626",
//             iconColor: "#facc15",
//             showCancelButton: true,
//             confirmButtonText: "Yes, order now!",
//             cancelButtonText: "Cancel",
//             confirmButtonColor: "#facc15",
//             cancelButtonColor: "#525252",
//         });

//         if (confirmResult.isConfirmed) {
//             const orderData = {
//                 foodId: meal._id,
//                 foodName: meal.foodName,
//                 price: meal.price,
//                 quantity: data.quantity,
//                 userEmail: user.email,
//                 userAddress: data.userAddress,
//                 chefId: meal.chefId,
//                 chefName: meal.chefName,
//                 orderStatus: "pending",
//                 paymentStatus: "pending",
//             };

//             try {
//                 await axiosSecure.post("/order", orderData);

//                 Swal.fire({
//                     icon: "success",
//                     title: "Order Placed!",
//                     text: "Your order has been placed successfully.",
//                     timer: 2000,
//                     showConfirmButton: false,
//                     background: isDark ? "#262626" : "#ffffff",
//                     color: isDark ? "#ffffff" : "#262626",
//                 });
//             } catch (error) {
//                 console.error(error);
//                 Swal.fire({
//                     title: "Error",
//                     text: "Failed to place order. Please try again.",
//                     icon: "error",
//                     background: isDark ? "#262626" : "#ffffff",
//                     color: isDark ? "#ffffff" : "#262626",
//                     iconColor: "#fb2c36",
//                     confirmButtonColor: "#fb2c36",
//                 });
//             }
//         }
//     };

//     const todydate = new Date();

//     if (loading) return <div className="text-center py-10">Loading...</div>;
//     if (!meal) return <div className="text-center py-10">Meal not found</div>;

//     return (
//         <div className="max-w-3xl mx-auto p-6">
//             <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Confirm Your Order</h1>

//             <div className="bg-white dark:bg-neutral-700 shadow-lg rounded-xl p-6 space-y-6">
//                 {/* Meal Preview */}
//                 <div className="flex flex-col md:flex-row items-center gap-6">
//                     <img src={meal.foodImage} alt={meal.foodName} className="w-full md:w-48 h-48 object-cover rounded-lg shadow-md" />
//                     <div className="flex-1 space-y-3">
//                         <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{meal.foodName}</h2>
//                         <p className="text-gray-600 dark:text-gray-300 font-semibold">Price: <span className="text-[#ffde59]">${meal.price}</span></p>
//                         <p>ChefId: {meal.chefId}</p>
//                         <p className="text-gray-500 dark:text-gray-400 text-sm">{meal.ingredients.join(", ")}</p>
//                     </div>
//                 </div>

//                 <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//                     {/* Quantity Selector */}
//                     <div>
//                         <label className="font-semibold text-gray-700 dark:text-gray-200">Quantity:</label>
//                         <div className="flex items-center gap-2 mt-2">
//                             <button
//                                 type="button"
//                                 onClick={() => setValue("quantity", quantity > 1 ? quantity - 1 : 1)}
//                                 className="px-4 py-2 bg-gray-200 dark:bg-neutral-600 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-500 font-bold"
//                             >
//                                 -
//                             </button>
//                             <span className="px-6 py-2 rounded-lg text-center bg-[#ffde59] text-black font-semibold">{quantity}</span>
//                             <button
//                                 type="button"
//                                 onClick={() => setValue("quantity", quantity + 1)}
//                                 className="px-4 py-2 bg-gray-200 dark:bg-neutral-600 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-500 font-bold"
//                             >
//                                 +
//                             </button>
//                         </div>
//                         {errors.quantity && <p className="text-red-500 text-sm mt-1">Quantity must be at least 1</p>}
//                     </div>

//                     {/* Total Price */}
//                     <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
//                         Total Price: <span className="text-[#ffde59]">${(meal.price * quantity).toFixed(2)}</span>
//                     </div>

//                     {/* Address */}
//                     <div>
//                         <label className="font-semibold text-gray-700 dark:text-gray-200">Delivery Address:</label>
//                         <textarea
//                             {...register("userAddress", { required: true })}
//                             className="w-full border rounded-lg p-3 mt-1 bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//                             placeholder="Enter your delivery address"
//                         />
//                         {errors.userAddress && <p className="text-red-500 text-sm mt-1">Address is required</p>}
//                         {/* <p>{todydate}</p> */}
//                         <p>{user.email}</p>
//                     </div>

//                     {/* Confirm Button */}
//                     <div className="flex gap-2">
//                         <button
//                             type="submit"
//                             className="w-full py-3 bg-[#ffde59] rounded-lg text-black font-semibold hover:bg-yellow-500 dark:hover:bg-yellow-600 transition"
//                         >
//                             Confirm Order
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => navigate(-1)}
//                             className="w-full py-3 bg-neutral-200 dark:bg-neutral-300 rounded-lg text-black font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-400 transition"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default OrderConfirm;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import {
    Calendar,
    MapPin,
    User,
    DollarSign,
    Utensils,
    ChefHat,
    Minus,
    Plus,
    CreditCard
} from "lucide-react";

import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const OrderConfirm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: { quantity: 1, userAddress: "" }
    });

    const quantity = watch("quantity") || 1;
    const isDark = document.documentElement.classList.contains("dark");

    // Date Formatting
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    useEffect(() => {
        const fetchMeal = async () => {
            try {
                const res = await axiosSecure.get(`/meals/id/${id}`);
                setMeal(res.data.data);
                setValue("quantity", 1);
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Failed to load meal",
                    text: "Something went wrong while fetching the meal.",
                    background: isDark ? "#262626" : "#ffffff",
                    color: isDark ? "#ffffff" : "#262626",
                });
            } finally {
                setLoading(false);
            }
        };
        fetchMeal();
    }, [id, axiosSecure, setValue, isDark]);

    const onSubmit = async (data) => {
        if (!meal) return;
        const totalPrice = meal.price * data.quantity;

        const confirmResult = await Swal.fire({
            title: "Confirm Order",
            html: `
                <div class="text-left text-sm">
                    <p><strong>Item:</strong> ${meal.foodName}</p>
                    <p><strong>Total:</strong> $${totalPrice.toFixed(2)}</p>
                    <p><strong>Address:</strong> ${data.userAddress}</p>
                </div>
            `,
            icon: "question",
            background: isDark ? "#262626" : "#ffffff",
            color: isDark ? "#ffffff" : "#262626",
            iconColor: "#facc15",
            showCancelButton: true,
            confirmButtonText: "Yes, order now!",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#facc15",
            cancelButtonColor: "#525252",
        });

        if (confirmResult.isConfirmed) {
            const orderData = {
                foodId: meal._id,
                foodName: meal.foodName,
                price: meal.price,
                quantity: data.quantity,
                userEmail: user.email,
                userAddress: data.userAddress,
                chefId: meal.chefId,
                chefName: meal.chefName,
                orderDate: new Date(), // Storing actual date object
                orderStatus: "pending",
                paymentStatus: "pending",
            };

            try {
                await axiosSecure.post("/order", orderData);
                Swal.fire({
                    icon: "success",
                    title: "Order Placed!",
                    text: "Your yummy food is on the way.",
                    timer: 2000,
                    showConfirmButton: false,
                    background: isDark ? "#262626" : "#ffffff",
                    color: isDark ? "#ffffff" : "#262626",
                });
                // Optional: Navigate to orders page
                // navigate('/dashboard/orders');
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: "Error",
                    text: "Failed to place order. Please try again.",
                    icon: "error",
                    background: isDark ? "#262626" : "#ffffff",
                    color: isDark ? "#ffffff" : "#262626",
                });
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <span className="loading loading-spinner loading-lg text-yellow-500"></span>
        </div>
    );

    if (!meal) return <div className="text-center py-10 text-xl font-bold">Meal not found</div>;

    return (
        <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto p-4 md:p-8"
        >
            <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-neutral-700">

                {/* Header Strip */}
                <div className="bg-[#ffde59] p-4 flex flex-col md:flex-row justify-between items-center text-black">
                    <h1 className="text-2xl font-extrabold flex items-center gap-2">
                        <Utensils className="w-6 h-6" /> Confirm Your Order
                    </h1>
                    <div className="flex items-center gap-2 font-medium bg-white/30 px-4 py-1 rounded-full text-sm">
                        <Calendar className="w-4 h-4" />
                        {formattedDate}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                    {/* Left Side: Meal Visuals & Details */}
                    <div className="lg:w-2/5 p-6 bg-gray-50 dark:bg-neutral-900/50 flex flex-col items-center">
                        <Motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            src={meal.foodImage}
                            alt={meal.foodName}
                            className="w-full h-64 object-cover rounded-2xl shadow-lg mb-6"
                        />

                        <div className="w-full space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{meal.foodName}</h2>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
                                    <ChefHat className="w-4 h-4" />
                                    <span className="text-sm">Chef: {meal.chefName}</span>
                                </div>
                            </div>

                            <div className="divider my-2"></div>

                            <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 text-sm uppercase tracking-wide">Ingredients</h3>
                                <div className="flex flex-wrap gap-2">
                                    {meal.ingredients.map((ing, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-white dark:bg-neutral-700 text-xs rounded-full border border-gray-200 dark:border-neutral-600 shadow-sm text-gray-600 dark:text-gray-300">
                                            {ing}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-700/50 flex justify-between items-center">
                                <span className="font-semibold text-yellow-800 dark:text-yellow-200">Unit Price</span>
                                <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">${meal.price}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Order Form */}
                    <div className="lg:w-3/5 p-8 lg:border-l border-gray-100 dark:border-neutral-700">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                            {/* Read Only User Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label text-gray-500 dark:text-gray-400 text-xs font-bold uppercase">
                                        Logged in as
                                    </label>
                                    <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-neutral-700/50 rounded-lg text-gray-600 dark:text-gray-300">
                                        <User className="w-5 h-5" />
                                        <span className="text-sm truncate">{user.email}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="label text-gray-700 dark:text-gray-200 font-semibold mb-2 block">
                                    Quantity
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-gray-100 dark:bg-neutral-700 rounded-xl p-1 shadow-inner">
                                        <Motion.button
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={() => setValue("quantity", quantity > 1 ? quantity - 1 : 1)}
                                            className="p-3 bg-white dark:bg-neutral-600 rounded-lg shadow-sm hover:text-red-500 transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </Motion.button>
                                        <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                        <Motion.button
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={() => setValue("quantity", quantity + 1)}
                                            className="p-3 bg-white dark:bg-neutral-600 rounded-lg shadow-sm hover:text-green-500 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </Motion.button>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        x ${meal.price}
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="label text-gray-700 dark:text-gray-200 font-semibold mb-2 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#ffde59]" /> Delivery Address
                                </label>
                                <textarea
                                    {...register("userAddress", { required: true })}
                                    rows="3"
                                    className="w-full border rounded-xl p-4 bg-gray-50 dark:bg-neutral-800 border-gray-300 dark:border-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#ffde59] transition-all"
                                    placeholder="Street, City, Zip Code..."
                                />
                                {errors.userAddress && <p className="text-red-500 text-sm mt-1 animate-pulse">Address is required for delivery.</p>}
                            </div>

                            {/* Total Calculation */}
                            <div className="bg-gray-900 text-white dark:bg-black p-6 rounded-2xl shadow-lg flex justify-between items-center">
                                <div>
                                    <p className="text-gray-400 text-sm">Total Amount Payable</p>
                                    <p className="text-xs text-gray-500">Including tax & fees</p>
                                </div>
                                <div className="text-3xl font-bold text-[#ffde59]">
                                    ${(meal.price * quantity).toFixed(2)}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-2">
                                <Motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="flex-1 py-4 bg-[#ffde59] rounded-xl text-black font-bold text-lg shadow-lg hover:bg-yellow-400 hover:shadow-xl transition-all flex justify-center items-center gap-2"
                                >
                                    Confirm Order <CreditCard className="w-5 h-5" />
                                </Motion.button>
                                <Motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-4 bg-gray-200 dark:bg-neutral-700 rounded-xl text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-neutral-600 transition-all"
                                >
                                    Cancel
                                </Motion.button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Motion.div>
    );
};

export default OrderConfirm;