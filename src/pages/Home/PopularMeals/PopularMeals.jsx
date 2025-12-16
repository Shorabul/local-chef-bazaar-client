import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { UtensilsCrossed, ArrowRight } from "lucide-react";
import MealCardSkeleton from "../../../components/MealCardSkeleton";
import EmptyState from "../../../components/EmptyState";
import MealCard from "../../../components/Shared/MealCard";
import Container from "../../../components/Shared/Container";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { Link, } from 'react-router';

const PopularMeals = () => {
    const axiosPublic = useAxiosPublic();
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const limit = 8;

    useEffect(() => {
        const fetchMeals = async () => {
            setLoading(true);
            try {
                const res = await axiosPublic.get(`/meals?limit=${limit}`);
                setMeals(res.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch meals", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMeals();
    }, [axiosPublic]);
    if (loading) {
        return (
            <Container>
                <section className="py-16">
                    {/* Section Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold flex justify-center items-center gap-2">
                            <UtensilsCrossed className="text-yellow-500" />
                            Today’s Popular Meals
                        </h1>
                        <p className="mt-2 text-neutral-500">
                            Freshly cooked by our top local chefs
                        </p>
                    </div>

                    {/* Meals Grid Skeleton */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(limit)].map((_, i) => (
                            <MealCardSkeleton key={i} />
                        ))}
                    </div>
                </section>
            </Container>
        );
    }
    return (
        <Container>
            <section className="py-16">
                {/* Section Header */}
                <Motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold flex justify-center items-center gap-2">
                        <UtensilsCrossed className="text-[#ffde59] text-5 sm:text-6 md:size-7 lg:text-9 xl:size-10 " />
                        Today’s Popular Meals
                    </h1>
                    <p className="mt-2 text-neutral-500 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                        Freshly cooked by our top local chefs
                    </p>
                </Motion.div>

                {/* Meals Grid */}
                <Motion.div
                    initial="hidden"
                    whileInView="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
                    }}
                    className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-4"
                >

                    {!loading && meals.length === 0 && (
                        <div className="col-span-full">
                            <EmptyState message="No meals found." />
                        </div>
                    )}

                    {!loading &&
                        meals.map((meal) => (
                            <Motion.div
                                key={meal._id}
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                            >
                                <div className="w-full flex justify-center">
                                    <MealCard meal={meal} className="w-full mx-auto" />
                                </div>
                            </Motion.div>
                        ))}
                </Motion.div>
                <div className="w-full flex justify-center">

                    <Link
                        to='/meals'
                        className="py-2 px-3 rounded-lg text-black font-semibold bg-[#ffde59] flex items-center gap-2 mt-4">
                        <span>see more</span>
                        <ArrowRight />
                    </Link>
                </div>

            </section>
        </Container>
    );
};

export default PopularMeals;
