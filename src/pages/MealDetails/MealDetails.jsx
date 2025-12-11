import React, { useState } from "react";
import { Link, useParams } from "react-router";
import Swal from "sweetalert2";
import Container from "../../components/Shared/Container";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

import { motion as Motion } from "framer-motion";
import StarRating from "../StarRating/StarRating";

const MealDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user } = useAuth();

    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(0);

    // ------------------ Fetch Meal Details ------------------
    const { data: mealData, isLoading } = useQuery({
        queryKey: ["meal", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/meals/id/${id}`);
            return res.data.data;
        },
    });
    const meal = mealData;

    // ------------------ Fetch Reviews ------------------
    const { data: reviews = [] } = useQuery({
        queryKey: ["reviews", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/reviews/${id}`);
            return res.data.data;
        },
    });

    // ------------------ Add Review ------------------
    const reviewMutation = useMutation({
        mutationFn: async (reviewData) =>
            axiosSecure.post("/reviews", reviewData),
        onSuccess: () => {
            Swal.fire("Success!", "Review added successfully!", "success");
            setNewReview("");
            setRating(0);
            queryClient.invalidateQueries(["reviews", id]);
        },
        onError: () => {
            Swal.fire("Error!", "Failed to submit review", "error");
        },
    });

    const handleSubmitReview = () => {
        if (!user)
            return Swal.fire("Login Required", "Please login to add review.", "warning");
        if (!rating)
            return Swal.fire("Rating Required", "Please select a rating.", "warning");
        if (!newReview.trim())
            return Swal.fire("Empty Review", "Please write something.", "warning");

        reviewMutation.mutate({
            foodId: id,
            reviewerName: user.displayName,
            reviewerEmail: user.email, // ✅ Send user email
            reviewerImage: user.photoURL,
            rating,
            comment: newReview,
            date: new Date(),
        });
    };

    // ------------------ Add to Favorites ------------------
    const favoriteMutation = useMutation({
        mutationFn: async (favData) => axiosSecure.post("/favorites", favData),
        onSuccess: (res) => {
            if (!res.data.success)
                return Swal.fire("Already Added", "This meal is already a favorite!", "info");
            Swal.fire("Added!", "Meal added to favorites!", "success");
        },
        onError: () => Swal.fire("Error!", "Failed to add favorite.", "error"),
    });

    const handleFavorite = () => {
        if (!user)
            return Swal.fire("Login Required", "Please login to add favorites.", "warning");

        favoriteMutation.mutate({
            userEmail: user.email,
            mealId: meal._id,
            mealName: meal.foodName,
            chefId: meal.chefId,
            chefName: meal.chefName,
            price: meal.price,
        });
    };

    if (isLoading || !meal)
        return <div className="text-center py-10">Loading...</div>;

    return (
        <Container>
            {/* Meal Info */}
            <div className="flex flex-col md:flex-row gap-6">
                <Motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    src={meal?.foodImage}
                    alt={meal?.foodName}
                    className="w-full md:w-1/2 h-full object-cover rounded-lg shadow-lg"
                />

                <div className="w-full md:w-1/2 space-y-1">
                    <Motion.h1
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-3xl font-bold mb-3"
                    >
                        {meal.foodName}
                    </Motion.h1>

                    <p>
                        <strong className="mr-1 font-semibold">Chef:</strong>
                        <span className="text-gray-500 dark:text-gray-300">{meal?.chefName}</span>
                    </p>
                    <p>
                        <strong className="mr-1 font-semibold">Price:</strong>
                        <span className="text-gray-500 dark:text-gray-300"> ${meal?.price}</span>
                    </p>
                    <p>
                        <strong className="mr-1 font-semibold">Rating:</strong>
                        <span className="text-gray-500 dark:text-gray-300">{meal?.rating}</span>
                    </p>
                    <p>
                        <strong className="mr-1 font-semibold">Delivery Area:</strong>
                        <span className="text-gray-500 dark:text-gray-300">{meal?.deliveryArea}</span>
                    </p>
                    <p>
                        <strong className="mr-1 font-semibold">Delivery Time:</strong>
                        <span className="text-gray-500 dark:text-gray-300">{meal?.deliveryTime}</span>
                    </p>
                    <p>
                        <strong className="mr-1 font-semibold">Experience:</strong>
                        <span className="text-gray-500 dark:text-gray-300">{meal?.chefExperience}</span>
                    </p>
                    <p>
                        <strong className="mr-1 font-semibold">Chef ID:</strong>
                        <span className="text-gray-500 dark:text-gray-300">{meal?.chefId}</span>
                    </p>
                    <p className="flex items-center flex-wrap">
                        <strong className="mr-1 font-semibold">Ingredients:</strong>
                        {
                            meal?.ingredients.map((ing, i) => (
                                <p key={i} className="mr-1 text-gray-500 dark:text-gray-300">{ing},</p>
                            ))
                        }
                    </p>

                    <div className="flex gap-4 mt-4">
                        <Link
                            to={`/order-confirm/${meal._id}`}
                            className="bg-[#ffde59] px-4 py-2 rounded-lg text-black font-semibold hover:bg-yellow-400"
                        >
                            Order Now
                        </Link>

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
                            <div className="flex items-start gap-2">
                                <div>
                                    <img src={rev.reviewerImage} className="w-10 h-10 rounded-full" />
                                </div>
                                <div>
                                    <p className="font-bold">{rev.reviewerName}</p>
                                    <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">
                                        {new Date(rev.date).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="mt-2">{rev.comment}</p>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: rev.rating }).map((_, i) => (
                                        <p key={i} className="text-yellow-400">★</p>
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
