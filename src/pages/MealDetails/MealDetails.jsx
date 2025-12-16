import React, { useState } from "react";
import { Link, useParams } from "react-router";
import Swal from "sweetalert2";
import Container from "../../components/Shared/Container";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { FaStar, FaRegHeart, FaHeart } from "react-icons/fa6";
import { FiClock, FiMapPin, FiUser, FiAward, FiDollarSign } from "react-icons/fi";
import StarRating from "../StarRating/StarRating";
import Skeleton from "../../components/Skeleton";
import { motion as Motion, AnimatePresence } from "framer-motion";

// Framer Motion Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 },
    },
};

const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const MealDetails = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user, backendData } = useAuth();

    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(0);
    const [isFavoriteLocal, setIsFavoriteLocal] = useState(false);


    // GET: meal details
    const { data: mealData, isLoading } = useQuery({
        queryKey: ["meal", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/meals/id/${id}`);
            return res.data.data;
        },
    });

    // GET: reviews
    const { data: reviews = [], refetch } = useQuery({
        queryKey: ["reviews", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/reviews/${id}`);
            return res.data.data;
        },
    });

    // POST: submit review
    const handleSubmitReview = async () => {
        if (!rating) {
            toastWarning("Rating Required!", "Please select a rating.");
            return;
        }
        if (!newReview.trim()) {
            toastWarning("Empty Review!", "Please write something.");
            return;
        }

        try {
            await axiosSecure.post("/reviews", {
                foodId: id,
                userName: user.displayName,
                userEmail: user.email,
                userImage: user.photoURL,
                rating,
                comment: newReview,
            });
            toastSuccess("Success!", "Review added successfully.");

            setNewReview("");
            setRating(0);
            refetch();

        } catch (error) {
            console.log(error);
            toastError("Error!", "Failed to submit review.");
        }
    };

    // POST: add favorite
    const handleFavorite = async () => {
        setIsFavoriteLocal(true);

        try {
            const res = await axiosSecure.post("/favorites", {
                userEmail: user.email,
                foodId: mealData._id,
                foodName: mealData.foodName,
                chefId: mealData.chefId,
                chefName: mealData.chefName,
                price: mealData.price,
            });
            if (!res.data.success) {
                toastInfo("Already Added", "This meal is already a favorite!");
            } else {
                toastSuccess("Added", "Meal added to favorites!");
            }
        } catch (error) {
            console.log(error);
            toastError("Add Failed", "Failed to add favorite.");
            setIsFavoriteLocal(false);
        }
    };


    const toastWarning = (title, text) => Swal.fire({ icon: "warning", iconColor: "#facc15", title, text, timer: 1500, showConfirmButton: false, background: isDark ? "#262626" : "#ffffff", color: isDark ? "#ffffff" : "#262626" });
    const toastSuccess = (title, text) => Swal.fire({ icon: "success", title, text, timer: 1500, showConfirmButton: false, background: isDark ? "#262626" : "#ffffff", color: isDark ? "#ffffff" : "#262626" });
    const toastError = (title, text) => Swal.fire({ title, text, icon: "error", background: isDark ? "#262626" : "#ffffff", color: isDark ? "#ffffff" : "#262626", iconColor: "#fb2c36", confirmButtonColor: "#fb2c36" });
    const toastInfo = (title, text) => Swal.fire({ icon: "info", title, text, timer: 1500, showConfirmButton: false, background: isDark ? "#262626" : "#ffffff", color: isDark ? "#ffffff" : "#262626" });


    if (isLoading || !mealData) {
        return (
            <Container>
                <div className="flex flex-col md:flex-row gap-8 p-6">
                    <Skeleton className="w-full md:w-1/2 h-[400px] rounded-2xl" />
                    <div className="w-full md:w-1/2 space-y-6 py-4">
                        <Skeleton className="h-10 w-3/4 rounded-lg" />
                        <Skeleton className="h-6 w-1/4 rounded-lg" />
                        <div className="space-y-3 pt-4">
                            <Skeleton className="h-5 w-full rounded" />
                            <Skeleton className="h-5 w-full rounded" />
                            <Skeleton className="h-5 w-2/3 rounded" />
                        </div>
                        <div className="flex gap-4 mt-8">
                            <Skeleton className="h-12 w-40 rounded-xl" />
                            <Skeleton className="h-12 w-40 rounded-xl" />
                        </div>
                    </div>
                </div>
            </Container>
        );
    }


    return (
        <Container>
            <Motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="py-8"
            >
                {/* Top Section: Image and Details Card */}
                <div className="flex flex-col lg:flex-row gap-8 rounded-3xl shadow-xl overflow-hidden">

                    {/* Left Column: Image */}
                    <Motion.div variants={imageVariants} className="lg:w-1/2 relative h-[300px] lg:h-auto overflow-hidden">
                        <img
                            src={mealData?.foodImage}
                            alt={mealData?.foodName}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-white/80 dark:bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                            <FaStar className="text-yellow-400" />
                            <span className="font-bold">{mealData?.rating}</span>
                        </div>
                    </Motion.div>

                    {/* Right Column: Details Info */}
                    <div className="lg:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                        <Motion.div variants={itemVariants}>
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{mealData?.foodName}</h1>
                            {/* Chef & ID Block */}
                            <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                                <div className="flex items-center gap-1">
                                    {/* Use FiUser here */}
                                    <FiUser className="text-[#ffde59]" />
                                    <span>By {mealData?.chefName}</span>
                                </div>
                                <span className="hidden md:inline">|</span>
                                <div>ID: {mealData?.chefId}</div>
                            </div>
                        </Motion.div>

                        <Motion.div variants={itemVariants} className="text-3xl font-bold text-[#ffde59] mb-6 flex items-center">
                            <FiDollarSign className="mr-1 h-6 w-6" />{mealData?.price}
                        </Motion.div>

                        {/* Info Grid */}
                        <Motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-8">
                            <DetailItem icon={FiMapPin} label="Delivery Area" value={mealData?.deliveryArea} />
                            <DetailItem icon={FiClock} label="Delivery Time" value={mealData?.deliveryTime} />
                            <DetailItem icon={FiAward} label="Chef Experience" value={mealData?.chefExperience} />
                        </Motion.div>

                        {/* Ingredients Badges */}
                        <Motion.div variants={itemVariants} className="mb-8">
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#ffde59]">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Ingredients
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {mealData?.ingredients.map((ing, i) => (
                                    <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-neutral-700 text-sm rounded-full text-gray-700 dark:text-gray-300 capitalize">
                                        {ing}
                                    </span>
                                ))}
                            </div>
                        </Motion.div>

                        {/* Action Buttons */}
                        <Motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-auto">
                            {backendData.status === 'fraud' ? (
                                <button disabled className="flex-1 bg-gray-300 px-6 py-3 rounded-xl text-black font-bold cursor-not-allowed text-center opacity-70">
                                    Account Restricted
                                </button>
                            ) : (
                                <Link
                                    to={`/order-confirm/${mealData._id}`}
                                    className="flex-1 bg-[#ffde59] px-6 py-3 rounded-xl text-black font-bold hover:bg-yellow-400 transition-colors text-center shadow-md hover:shadow-lg flex justify-center items-center gap-2"
                                >
                                    Order Now
                                </Link>
                            )}

                            <Motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleFavorite}
                                className={`px-6 py-3 rounded-xl border-2 font-semibold transition-all flex items-center gap-2 shadow-sm hover:shadow-md
                                    ${isFavoriteLocal
                                        ? "bg-red-50 border-red-500 text-red-500 dark:bg-red-900/20"
                                        : "border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-200 hover:border-red-400 hover:text-red-500"
                                    }`}
                            >
                                {isFavoriteLocal ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                                {isFavoriteLocal ? "Favorited" : "Favorite"}
                            </Motion.button>
                        </Motion.div>
                    </div>
                </div>

                {/* Bottom Section: Reviews */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Review Input Form (Sticky on large screens) */}
                    <div className="lg:col-span-1">
                        <Motion.div
                            variants={itemVariants}
                            className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-lg sticky top-24"
                        >
                            <h3 className="text-xl font-bold mb-4">Write a Review</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Share your experience with this meal.</p>

                            <div className="mb-4 flex justify-center">
                                <StarRating rating={rating} setRating={setRating} size={32} />
                            </div>

                            <textarea
                                className="w-full border-2 border-gray-200 dark:border-neutral-700 bg-transparent p-4 rounded-xl focus:border-[#ffde59] focus:ring-0 transition-all outline-none resize-none"
                                rows={5}
                                placeholder="What did you like or dislike?"
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                            />

                            <Motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "#e6c84f" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmitReview}
                                className="w-full mt-4 bg-[#ffde59] text-black font-bold px-4 py-3 rounded-xl shadow-md transition-colors"
                            >
                                Submit Review
                            </Motion.button>
                        </Motion.div>
                    </div>

                    {/* Reviews List */}
                    <div className="lg:col-span-2">
                        <Motion.h2 variants={itemVariants} className="text-2xl font-bold mb-6 flex items-center gap-2">
                            Customer Reviews <span className="text-base font-normal text-gray-500">({reviews.length})</span>
                        </Motion.h2>

                        <Motion.div
                            variants={containerVariants}
                            className="space-y-4"
                        >
                            <AnimatePresence>
                                {reviews.length === 0 && (
                                    <Motion.p variants={itemVariants} className="text-gray-500 dark:text-gray-400 italic p-4 bg-gray-50 dark:bg-neutral-700 rounded-xl">
                                        No reviews yet. Be the first!
                                    </Motion.p>
                                )}

                                {reviews.map((rev) => (
                                    <ReviewCard key={rev._id} review={rev} />
                                ))}
                            </AnimatePresence>
                        </Motion.div>
                    </div>
                </div>
            </Motion.div>
        </Container >
    );
};


// A single row in the details grid
const DetailItem = ({ icon: Icon, label, value }) => (
    <Motion.div variants={itemVariants} className="flex items-start gap-3">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-lg text-yellow-600 dark:text-yellow-400">
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
            <p className="font-semibold">{value}</p>
        </div>
    </Motion.div>
);

// A single review card
const ReviewCard = ({ review }) => (
    <Motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, y: -20 }}
        className="p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-700 flex flex-col sm:flex-row gap-4"
    >
        <div className="flex-shrink-0">
            <img src={review.userImage} alt={review.userName} className="w-12 h-12 rounded-full object-cover border-2 border-[#ffde59]" />
        </div>
        <div className="flex-grow">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="font-bold text-lg">{review.userName}</h4>
                    <p className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 dark:bg-neutral-700 px-2 py-1 rounded-lg">
                    <FaStar className="text-yellow-400 w-4 h-4" />
                    <span className="font-bold text-sm">{review.rating}</span>
                </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
                "{review.comment}"
            </p>
        </div>
    </Motion.div>
);


export default MealDetails;