import React from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import { useQuery, } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MyMeals = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const mealsKey = ["meals", user?.email];

    //fetch meals
    const { data: meals = [], refetch, isLoading, isError } = useQuery({
        queryKey: mealsKey,
        queryFn: async () => {
            const res = await axiosSecure.get(`/meals/chef/${user.email}`);
            return res.data.data || [];
        },
        enabled: !!user?.email,
    });


    // handlers
    const handleDelete = (mealId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/meals/${mealId}`).then(res => {
                    if (res.data.data.deletedCount) {
                        refetch();
                        Swal.fire({
                            title: "Deleted!",
                            text: "Meal deleted.",
                            icon: "success"
                        });
                    }
                })
            }
        });
    };


    if (isLoading) return <div className="text-center py-10">Loading...</div>;
    if (isError) return <div className="text-center py-10">Error loading meals.</div>;
    if (!meals.length) return <div className="text-center py-10">No meals found.</div>;

    return (
        <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {meals.map((meal, index) => (
                <Motion.div
                    key={meal._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.06 }}
                    className="border rounded-lg shadow-md p-4 bg-white dark:bg-gray-800"
                >
                    <img
                        src={meal.foodImage}
                        alt={meal.foodName}
                        className="w-full h-40 object-cover rounded-md mb-3"
                    />
                    <h2 className="text-xl font-bold">{meal.foodName}</h2>
                    <p>Price: ${meal.price}</p>
                    <p>Rating: {meal.rating ?? "N/A"}</p>
                    <p>Ingredients: {(meal.ingredients || []).join(", ")}</p>
                    <p>ETA: {meal.estimatedDeliveryTime}</p>
                    <p>Chef: {meal.chefName} ({meal.chefId})</p>

                    <div className="flex gap-2 mt-3">
                        <button
                            onClick={() => handleDelete(meal._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                        >
                            Delete
                        </button>

                        <Link
                            to={`/dashboard/meal-update/${meal._id}`}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            Update
                        </Link>
                    </div>
                </Motion.div>
            ))}
        </Motion.div>
    );
};

export default MyMeals;
