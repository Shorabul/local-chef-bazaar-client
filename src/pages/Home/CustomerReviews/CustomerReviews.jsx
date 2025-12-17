import React, { useEffect, useState, useRef } from "react";
import { motion as Motion } from "framer-motion";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import Skeleton from "../../../components/Skeleton";
import Container from "../../../components/Shared/Container";
import { SiComma } from "react-icons/si";
import { Star, UtensilsCrossed } from "lucide-react";

// Single review card
const ReviewCard = ({ review }) => {
    return (
        <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-neutral-700 shadow-lg rounded-xl w-lg p-5 flex flex-col gap-4"
        >
            {/* Comma Icons */}
            <div className="flex mb-2">
                <SiComma size={24} color="black" />
                <SiComma size={24} color="black" />
            </div>

            {/* Comment */}
            <p className="text-gray-700 dark:text-gray-300 text-sm flex-1">
                &ldquo;{review.comment}&rdquo;
            </p>

            {/* User info */}
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3">
                    <img
                        src={review.userImage || "/default-avatar.png"}
                        alt={review.userName || "Customer"}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-semibold text-sm">{review.userName}</span>
                </div>
                {review.rating && (
                    <div className="flex items-center gap-1 text-yellow-400 font-semibold">
                        <Star size={16} /> <span>{review.rating}</span>
                    </div>
                )}
            </div>
        </Motion.div>
    );
};

// Auto-scrolling row
const AutoScrollRow = ({ reviews, direction = "left" }) => {
    const containerRef = useRef(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            setWidth(containerRef.current.scrollWidth / 2);
        }
    }, [reviews]);

    return (
        <div
            className="relative overflow-hidden w-full h-[320px] my-6"
            ref={containerRef}
        >
            {/* Gradient overlays */}
            <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white dark:from-neutral-800 to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white dark:from-neutral-800 to-transparent pointer-events-none z-10" />

            <Motion.div
                className="flex gap-6 absolute top-0 left-0"
                animate={{ x: direction === "left" ? [0, -width] : [0, width] }}
                transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 35,
                    ease: "linear",
                }}
            >
                {[...reviews, ...reviews].map((review, index) => (
                    <ReviewCard key={`${review._id}-${index}`} review={review} />
                ))}
            </Motion.div>
        </div>
    );
};

// Main component
const CustomerReviews = () => {
    const axiosPublic = useAxiosPublic();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const res = await axiosPublic.get("/reviews/latest?limit=10");
                setReviews(res.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [axiosPublic]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-60 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <Container>
            <section className="text-center py-16">
                <Motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold flex justify-center items-center gap-2">
                        <UtensilsCrossed className="text-[#ffde59] text-5 sm:text-6 md:size-7 lg:text-9 xl:size-10 " />
                        What Our Clients Say
                    </h1>
                    <p className="mt-2 text-neutral-500 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                        Testimonials
                    </p>
                </Motion.div>

                {/* Top row: left → right */}
                <AutoScrollRow reviews={reviews} direction="left" />

                {/* Bottom row: right → left */}
                <AutoScrollRow reviews={reviews} direction="left" />
            </section>
        </Container>
    );
};

export default CustomerReviews;