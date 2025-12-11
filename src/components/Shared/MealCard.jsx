import React from "react";
import { useNavigate } from "react-router";
import { motion as Motion } from "framer-motion";
import { Star, MapPin, Clock } from "lucide-react";

const MealCard = ({ meal }) => {
    const navigate = useNavigate();
    console.log(meal);
    return (
        <Motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className="bg-neutral-50 dark:bg-neutral-600 hover:bg-gray-200 dark:hover:bg-neutral-700 shadow rounded-xl overflow-hidden w-full max-w-sm"
        >
            {/* Meal Image */}
            <img
                src={meal?.foodImage}
                alt={meal?.foodName}
                className="w-full h-40 md:h-48 object-cover"
            />

            {/* Content */}
            <div className="p-4 flex flex-col gap-2">
                {/* Name & Rating */}
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg truncate">{meal?.foodName}</h3>
                    <div className="flex items-center gap-1 text-yellow-400 font-semibold">
                        <Star size={16} /> <span>{meal?.rating}</span>
                    </div>
                </div>

                {/* Description / Cuisine */}
                <div className="flex">
                    {meal?.ingredients.slice(0, 2).map((ing, i) => (
                        <p key={i} className="text-sm text-gray-500 dark:text-gray-300 truncate">
                            {ing},
                        </p>
                    ))
                    }
                    {meal?.ingredients.length > 2 && <p className="text-sm text-gray-500 dark:text-gray-300">...</p>}
                </div>


                {/* Location & Time */}
                <div className="flex gap-4 mt-2 text-sm text-gray-500 dark:text-gray-300">

                    <div className="flex items-center gap-1">
                        <span>{meal?.deliveryArea}</span>
                        <MapPin size={16} /> <span>{meal?.distance || "5 km"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={16} /> <span>{meal?.deliveryTime || "40 min"}</span>
                    </div>
                </div>
                <div className="flex gap-4 mt-2 text-sm text-gray-500 dark:text-gray-300">
                    <p>${meal.price}</p>
                </div>

                {/* Button */}
                <button
                    onClick={() => navigate(`/meals/${meal?._id}`)}
                    className="mt-4 w-full bg-[#ffde59] text-black py-2 rounded-lg font-semibold hover:bg-yellow-400 transition cursor-pointer"
                >
                    See Details
                </button>
            </div>
        </Motion.div>
    );
};

export default MealCard;