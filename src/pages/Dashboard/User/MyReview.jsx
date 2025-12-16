import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import StarRating from "../../StarRating/StarRating";
import { useQuery } from "@tanstack/react-query";
import EmptyState from "../../../components/EmptyState";
import Skeleton from "../../../components/Skeleton";
import { LayoutDashboard } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { usePageTitle } from "../../../hooks/usePageTitle";

const MyReview = () => {
    usePageTitle('My Review');
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const [modalOpen, setModalOpen] = useState(false);
    const [editReview, setEditReview] = useState({});
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState("");

    const isDark = document.documentElement.classList.contains("dark");


    // Fetch user's reviews
    const { data: reviews = [], refetch, isLoading } = useQuery({
        queryKey: ["myReviews", user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosSecure.get(`/reviews/user/${user.email}`);
            return res.data.data;
        },
        enabled: !!user?.email, // Only run if user is logged in
    });

    console?.log(reviews)

    // Delete review
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This review will be permanently deleted!",
            icon: "warning",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            background: isDark ? "#262626" : "#ffffff",
            color: isDark ? "#ffffff" : "#262626",
            iconColor: "#facc15",
            showCancelButton: true,
            confirmButtonColor: "#fb2c36",
            cancelButtonColor: "#525252",
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/reviews/${id}`);

                Swal.fire({
                    background: isDark ? "#262626" : "#ffffff",
                    color: isDark ? "#ffffff" : "#262626",
                    icon: "success",
                    title: "Deleted!",
                    text: "Your review has been deleted.",
                    timer: 2000,
                    showConfirmButton: false,
                });
                refetch();
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: "Error",
                    text: "Failed to delete this review",
                    icon: "error",
                    background: isDark ? "#262626" : "#ffffff",
                    color: isDark ? "#ffffff" : "#262626",
                    iconColor: "#fb2c36",
                    confirmButtonColor: "#fb2c36",
                });
            }
        }
    };

    // Open edit modal
    const handleEdit = (review) => {
        setEditReview(review);
        setEditRating(review.rating);
        setEditComment(review.comment);
        setModalOpen(true);
    };

    // Update review
    const handleUpdateSubmit = async () => {
        if (!editComment.trim() || editRating === 0) {
            return Swal.fire({
                background: isDark ? "#262626" : "#ffffff",
                color: isDark ? "#ffffff" : "#262626",
                icon: "warning",
                title: "Error!",
                text: "Please enter comment and rating.",
                timer: 1500,
                showConfirmButton: false,
            });
        }

        try {
            await axiosSecure.patch(`/reviews/${editReview._id}`, {
                rating: editRating,
                comment: editComment,
            });
            Swal.fire({
                background: isDark ? "#262626" : "#ffffff",
                color: isDark ? "#ffffff" : "#262626",
                icon: "success",
                title: "Updated!",
                text: "Your review has been updated.",
                timer: 1500,
                showConfirmButton: false,
            });
            // Manual refresh: update review locally
            const index = reviews.findIndex((r) => r._id === editReview._id);
            if (index !== -1) {
                reviews[index].rating = editRating;
                reviews[index].comment = editComment;
            }
            setModalOpen(false);
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to update review.",
                icon: "error",
                background: isDark ? "#262626" : "#ffffff",
                color: isDark ? "#ffffff" : "#262626",
                iconColor: "#fb2c36",
                confirmButtonColor: "#fb2c36",
            });
        }
    };
    // Animation Variants
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

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div>
                                    <Skeleton className="h-4 w-32 mb-2" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-8 w-20" />
                            </div>
                        </div>

                        <Skeleton className="h-4 w-full mt-4" />
                        <Skeleton className="h-4 w-1/2 mt-2" />
                    </div>
                ))}
            </div>
        );
    }


    return (
        <Motion.div
            className="overflow-x-auto w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible">

            {/* Header */}
            <Motion.div className="text-center mb-6">
                <h1 className="font-bold text-2xl">My Reviews</h1>
                <p className="flex justify-center gap-2 text-sm opacity-80">
                    <LayoutDashboard size={16} /> Dashboard / My Reviews
                </p>
            </Motion.div>

            {/* Empty State */}
            {!reviews.length ? (
                <EmptyState message="You have not submitted any reviews yet." />
            ) : (<>

                {reviews.map((rev) => (
                    <Motion.div
                        key={rev._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 p-4 rounded-lg mb-3 shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div>
                                    <img src={rev.userImage} className="w-10 h-10 rounded-full" />
                                </div>
                                <div>
                                    <p className="font-bold">{rev.userName}</p>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                        {new Date(rev.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(rev)}
                                    className="bg-[#ffde59] text-black px-3 py-2 rounded-lg hover:bg-yellow-400 font-semibold text-xs md:text-sm lg:text-base"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDelete(rev._id)}
                                    className="px-3 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 text-xs md:text-sm lg:text-base font-semibold"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <div className="mt-2">
                            <h1 className="font-semibold">{rev?.foodName}</h1>
                            <p className="mt-1 text-sm">{rev.comment}</p>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: rev.rating }).map((_, i) => (
                                    <p key={i} className="text-yellow-400">
                                        <FaStar />
                                    </p>
                                ))}
                                <span>{rev.rating}</span>
                            </div>
                        </div>
                    </Motion.div>
                ))}

                {/* Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow w-full max-w-md relative">
                            <h3 className="w-full text-center text-xl font-bold mb-4">Update Review</h3>
                            <p className="font-semibold mb-2">Rating:</p>
                            <StarRating rating={editRating} setRating={setEditRating} />

                            <p className="font-semibold mt-4 mb-2">Comment:</p>
                            <textarea
                                className="w-full border border-gray-300 dark:border-gray-500 p-3 rounded-lg"
                                rows={3}
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                            />

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-3 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-600 hover:bg-gray-400 dark:hover:bg-neutral-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateSubmit}
                                    className="px-3 py-2 rounded-lg bg-[#ffde59] text-black  hover:bg-yellow-400"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>)}
        </Motion.div>
    );
};

export default MyReview;