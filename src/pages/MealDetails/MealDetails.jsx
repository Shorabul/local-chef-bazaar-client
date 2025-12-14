import React, { useState } from "react";
import { Link, useParams } from "react-router";
import Swal from "sweetalert2";
import Container from "../../components/Shared/Container";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { FaStar } from "react-icons/fa6";
import StarRating from "../StarRating/StarRating";
import Skeleton from "../../components/Skeleton";
import { motion as Motion } from "framer-motion";

const MealDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user, backendData } = useAuth();

    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(0);

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
            Swal.fire("Rating Required", "Please select a rating.", "warning");
            return;
        }
        if (!newReview.trim()) {
            Swal.fire("Empty Review", "Please write something.", "warning");
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
            Swal.fire("Success!", "Review added successfully!", "success");
            setNewReview("");
            setRating(0);
            refetch(); // refresh reviews
        } catch (error) {
            console.log(error);
            Swal.fire("Error!", "Failed to submit review", "error");
        }
    };

    // POST: add favorite
    const handleFavorite = async () => {
        if (!user || !mealData) {
            Swal.fire("Login Required", "Please login to add favorites.", "warning");
            return;
        }

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
                Swal.fire("Already Added", "This meal is already a favorite!", "info");
            } else {
                Swal.fire("Added!", "Meal added to favorites!", "success");
            }
        } catch (error) {
            console.log(error);
            Swal.fire("Error!", "Failed to add favorite.", "error");
        }
    };


    if (isLoading || !mealData) {
        return (
            <div className="p-6 space-y-6">
                {/* Image skeleton */}
                <Skeleton className="w-full md:w-1/2 h-64 rounded-lg" />

                {/* Text skeletons */}
                <div className="space-y-3">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/2" />
                </div>

                {/* Button skeletons */}
                <div className="flex gap-4 mt-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-40" />
                </div>

                {/* Review section skeleton */}
                <div className="mt-10 space-y-4">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
        );
    }


    return (
        <Container>
            {/* Meal Info */}
            <div className="flex flex-col md:flex-row gap-6">
                <Motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    src={mealData?.foodImage}
                    alt={mealData?.foodName}
                    className="w-full md:w-1/2 h-full object-cover rounded-lg shadow-lg"
                />

                <div className="w-full md:w-1/2 space-y-1">
                    <Motion.h1
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-3xl font-bold mb-3"
                    >
                        {mealData?.foodName}
                    </Motion.h1>

                    <p>
                        <strong className="mr-1 font-semibold">Chef:</strong>
                        <span className="text-gray-500 dark:text-gray-300">{mealData?.chefName}</span>
                    </p>
                    <p>
                        <strong className="mr-1 font-semibold">Price:</strong>
                        <span className="text-gray-500 dark:text-gray-300"> ${mealData?.price}</span>
                    </p>
                    <p>
                        <strong className="mr-1 font-semibold">Rating:</strong>
                        <span className="text-gray-500 dark:text-gray-300">{mealData?.rating}</span>
                    </p>
                    <p>
                        <strong className="mr-1 font-semibold">Delivery Area:</strong>
                        <span className="text-gray-500 dark:text-gray-300">{mealData?.deliveryArea}</span>
                    </p>
                    <p>
                        <strong className="mr-1 font-semibold">Delivery Time:</strong>
                        <span className="text-gray-500 dark:text-gray-300">{mealData?.deliveryTime}</span>
                    </p>
                    <p>
                        <strong className="mr-1 font-semibold">Experience:</strong>
                        <span className="text-gray-500 dark:text-gray-300">{mealData?.chefExperience}</span>
                    </p>
                    <p>
                        <strong className="mr-1 font-semibold">Chef ID:</strong>
                        <span className="text-gray-500 dark:text-gray-300">{mealData?.chefId}</span>
                    </p>
                    <div className="flex items-center flex-wrap">
                        <strong className="mr-1 font-semibold">Ingredients:</strong>
                        {
                            mealData?.ingredients.map((ing, i) => (
                                <p key={i} className="mr-1 text-gray-500 dark:text-gray-300">{ing},</p>
                            ))
                        }
                    </div>

                    <div className="flex gap-4 mt-4">
                        {backendData.status === 'fraud' ? (
                            <button
                                disabled
                                className="bg-gray-300 px-4 py-2 rounded-lg text-black font-semibold cursor-not-allowed"
                            >
                                Order Now
                            </button>
                        ) : (
                            <Link
                                to={`/order-confirm/${mealData._id}`}
                                className="bg-[#ffde59] px-4 py-2 rounded-lg text-black font-semibold hover:bg-yellow-400"
                            >
                                Order Now
                            </Link>
                        )}

                        <button
                            onClick={handleFavorite}
                            className="cursor-pointer bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600"
                        >
                            ❤️ Add to Favorite
                        </button>
                    </div>
                </div>
            </div>

            {/* Review Section */}
            <div className="mt-10">
                <p className="font-semibold">Leave a Review</p>
                <StarRating rating={rating} setRating={setRating} />

                <textarea
                    className="w-full border border-gray-300 dark:border-gray-500 bg-neutral-50 dark:bg-neutral-600 p-4 rounded-lg mt-3"
                    rows={3}
                    placeholder="Write a review..."
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                />

                <Motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmitReview}
                    className="cursor-pointer mt-3 text-black bg-[#ffde59] px-4 py-2 rounded-lg hover:bg-yellow-400"
                >
                    Submit Review
                </Motion.button>

                <h2 className="font-semibold mt-6 mb-4">Reviews</h2>
                {reviews.length === 0 && <p>No reviews yet.</p>}

                {reviews.map((rev) => (
                    <Motion.div
                        key={rev._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-300 dark:border-gray-500 bg-neutral-50 dark:bg-neutral-600 p-4 rounded-lg mb-3 shadow-sm"
                    >
                        <div className="flex flex-col items-start">
                            <div className="flex items-center gap-2">
                                <div>
                                    <img src={rev.userImage} className="w-10 h-10 rounded-full" />
                                </div>
                                <div>
                                    <p className="font-bold">{rev.reviewerName}</p>
                                    <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">
                                        {new Date(rev.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="mt-2">{rev.comment}</p>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: rev.rating }).map((_, i) => (
                                        <span
                                            key={i} className="text-yellow-400">
                                            <FaStar />
                                        </span>
                                    ))}
                                    <span>{rev.rating}</span>
                                </div>
                            </div>
                        </div>
                    </Motion.div>
                ))}
            </div>
        </Container >
    );
};

export default MealDetails;
