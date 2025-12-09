import React, { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router";
import Container from "../../../components/Shared/Container";

const Banner = () => {
    const [meals, setMeals] = useState([]);
    const [index, setIndex] = useState(0);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const res = await axiosSecure.get(
                    "/meals?limit=3&fields=foodName,foodImage,chefName"
                );
                setMeals(res.data.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchMeals();
    }, [axiosSecure]);

    // Auto-slide every 5 seconds
    useEffect(() => {
        if (meals.length === 0) return;

        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % meals.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [meals]);

    if (meals.length === 0) return <div>Loading banner...</div>;

    const current = meals[index];

    return (
        <Container>
            <div className="relative w-full h-72 md:h-96 overflow-hidden rounded-xl">
                <AnimatePresence>
                    <Motion.img
                        key={index}
                        src={current.foodImage}
                        alt={current.foodName}
                        className="absolute inset-0 w-full h-full object-cover transition-all ease-in-out"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    />
                </AnimatePresence>

                {/* Text Overlay */}
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">
                    <h2 className="text-2xl md:text-4xl font-bold drop-shadow-lg">
                        {current.foodName}
                    </h2>

                    <p className="text-lg md:text-xl mt-2 opacity-90">
                        By: {current.chefName}
                    </p>

                    <Link
                        to="/meals"
                        className="mt-4 bg-yellow-400 text-black font-semibold px-6 py-2 rounded-lg shadow hover:bg-yellow-500"
                    >
                        View Meals →
                    </Link>
                </div>
            </div>
        </Container>
    );
};

export default Banner;