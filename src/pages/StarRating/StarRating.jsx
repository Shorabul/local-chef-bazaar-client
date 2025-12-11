import { motion as Motion } from "framer-motion";
import { Star } from "lucide-react";

const StarRating = ({ rating, setRating }) => {

    const handleStarClick = (star) => {
        if (rating === star) {
            setRating(star); // remove rating when clicking same star
        } else {
            setRating(star);
        }
    };

    return (
        <div className="flex gap-2 mt-3 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
                <Motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleStarClick(star)}
                >
                    <Star
                        className={`size-4 sm:size-5 md:size-6 lg:size-7 xl:size-8 transition-all ${star <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-400"
                            }`}
                    />
                </Motion.button>
            ))}
        </div>
    );
};

export default StarRating;
