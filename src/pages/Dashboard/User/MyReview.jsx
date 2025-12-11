import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import StarRating from "../../StarRating/StarRating";
import { useQuery } from "@tanstack/react-query";

const MyReview = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const [modalOpen, setModalOpen] = useState(false);
    const [editReview, setEditReview] = useState({});
    const [editRating, setEditRating] = useState(0);
    const [editComment, setEditComment] = useState("");

    // Fetch user's reviews
    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ["myReviews", user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosSecure.get(`/reviews/user/${user.email}`);
            return res.data.data;
        },
        enabled: !!user?.email, // Only run if user is logged in
    });

    if (isLoading) return <div className="text-center py-10">Loading...</div>;

    if (!reviews.length)
        return <div className="text-center py-10">You have not submitted any reviews yet.</div>;

    // Delete review
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This review will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/reviews/${id}`);
                Swal.fire("Deleted!", "Your review has been deleted.", "success");
                // Manual refresh: remove review locally
                reviews.splice(reviews.findIndex((r) => r._id === id), 1);
            } catch (error) {
                console.error(error);
                Swal.fire("Error", "Failed to delete review", "error");
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
            return Swal.fire("Error", "Please enter comment and rating.", "warning");
        }

        try {
            await axiosSecure.patch(`/reviews/${editReview._id}`, {
                rating: editRating,
                comment: editComment,
            });
            Swal.fire("Updated!", "Your review has been updated.", "success");
            // Manual refresh: update review locally
            const index = reviews.findIndex((r) => r._id === editReview._id);
            if (index !== -1) {
                reviews[index].rating = editRating;
                reviews[index].comment = editComment;
            }
            setModalOpen(false);
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to update review", "error");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Reviews</h2>

            {reviews.map((rev) => (
                <Motion.div
                    key={rev._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border p-4 rounded-lg mb-3 shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={rev.reviewerImage}
                                alt={rev.reviewerName}
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p className="font-bold">{rev.reviewerName}</p>
                                <p className="text-gray-500 text-sm">{rev.mealName}</p>
                                <p className="text-yellow-600">★ {rev.rating}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(rev)}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => handleDelete(rev._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                    <p className="mt-2">{rev.comment}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {new Date(rev.date).toLocaleString()}
                    </p>
                </Motion.div>
            ))}

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
                        <h3 className="text-xl font-bold mb-4">Update Review</h3>
                        <p className="font-semibold mb-2">Rating:</p>
                        <StarRating rating={editRating} setRating={setEditRating} />

                        <p className="font-semibold mt-4 mb-2">Comment:</p>
                        <textarea
                            className="w-full border p-3 rounded-lg"
                            rows={3}
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                        />

                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setModalOpen(false)}
                                className="px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateSubmit}
                                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyReview;