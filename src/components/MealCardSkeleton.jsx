import React from "react";
import Skeleton from "./Skeleton";

const MealCardSkeleton = () => {
    return (
        <div className="bg-neutral-50 dark:bg-neutral-600 shadow rounded-xl overflow-hidden w-full max-w-sm">
            {/* Image placeholder */}
            <Skeleton className="w-full h-40 md:h-48" />

            {/* Content placeholders */}
            <div className="p-4 flex flex-col gap-2">
                {/* Name & Rating */}
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-10" />
                </div>

                {/* Ingredients */}
                <Skeleton className="h-4 w-48" />

                {/* Location & Time */}
                <div className="flex gap-4 mt-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                </div>

                {/* Price */}
                <Skeleton className="h-4 w-16 mt-2" />

                {/* Button */}
                <Skeleton className="h-10 w-full mt-4 rounded-lg" />
            </div>
        </div>
    );
};

export default MealCardSkeleton;