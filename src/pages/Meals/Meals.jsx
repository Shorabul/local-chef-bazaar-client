import React, { useState, useEffect } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { motion as Motion } from "framer-motion";
import Container from "../../components/Shared/Container";
import MealCard from "../../components/Shared/MealCard";
import { House } from 'lucide-react';

const Meals = () => {
    useEffect(() => {
        document.title = "Meals";
    }, []);
    const axiosSecure = useAxiosSecure();


    // Local states
    const [meals, setMeals] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [sortOrder, setSortOrder] = useState("asc");

    const limit = 8;

    // Fetch meals
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosSecure.get(
                    `/meals?page=${page}&limit=${limit}&sortBy=price&order=${sortOrder}&fields=foodName,foodImage,price,rating,deliveryArea,ingredients,deliveryTime`
                );

                setMeals(res.data.data);
                setPages(res.data.pages);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData(); // call it inside, asynchronously
    }, [page, sortOrder, axiosSecure]);


    return (
        <Container>
            <div className="flex flex-col items-center justify-center mb-6">
                <h1 className="text-center font-bold text-2xl">Meals</h1>
                <p className="flex gap-2">
                    <p className="opacity-80 flex items-center gap-2">
                        <House size={16} />Home</p>
                    <span> / meals</span>
                </p>
            </div>
            {/* Header */}
            <div className="w-full flex justify-end mb-6">
                {/* Sort Button */}
                <button
                    onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="bg-[#ffde59] px-3 py-2 rounded-lg font-semibold hover:bg-yellow-400 text-black"
                >
                    Sort by Price ({sortOrder === "asc" ? "Low → High" : "High → Low"})
                </button>
            </div>

            {/* Meals Grid */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {meals?.map((meal) => (
                    < MealCard key={meal._id} meal={meal}></MealCard>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-8">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-neutral-50 dark:bg-neutral-600 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-lg cursor-pointer"
                >
                    Prev
                </button>

                {[...Array(pages).keys()].map((num) => (
                    <button
                        key={num}
                        onClick={() => setPage(num + 1)}
                        className={`px-4 py-2 rounded-lg cursor-pointer ${page === num + 1
                            ? "bg-[#ffde59] text-black font-bold"
                            : "bg-gray-200"
                            }`}
                    >
                        {num + 1}
                    </button>
                ))}

                <button
                    disabled={page === pages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-neutral-50 dark:bg-neutral-600 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-lg cursor-pointer"
                >
                    Next
                </button>
            </div>
        </Container >
    );
};

export default Meals;
