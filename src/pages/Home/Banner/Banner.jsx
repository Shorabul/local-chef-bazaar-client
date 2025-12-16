// import { useEffect, useState } from "react";
// import { motion as Motion, AnimatePresence } from "framer-motion";
// import { Link } from "react-router";
// import Container from "../../../components/Shared/Container";
// import Skeleton from "../../../components/Skeleton";
// import useAxiosPublic from "../../../hooks/useAxiosPublic";
// import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// const Banner = () => {
//     const [meals, setMeals] = useState([]);
//     const [index, setIndex] = useState(0);
//     const axiosPublic = useAxiosPublic();

//     useEffect(() => {
//         const fetchMeals = async () => {
//             try {
//                 const res = await axiosPublic.get(
//                     "/meals?limit=3&fields=foodName,foodImage,chefName"
//                 );
//                 setMeals(res.data.data || []);
//             } catch (err) {
//                 console.log(err);
//             }
//         };
//         fetchMeals();
//     }, [axiosPublic]);

//     useEffect(() => {
//         if (!meals.length) return;
//         const timer = setInterval(
//             () => setIndex((i) => (i + 1) % meals.length),
//             5000
//         );
//         return () => clearInterval(timer);
//     }, [meals]);

//     const current = meals[index];

//     const handlePrev = () => {
//         setIndex((i) => (i - 1 + meals.length) % meals.length);
//     };

//     const handleNext = () => {
//         setIndex((i) => (i + 1) % meals.length);
//     };

//     if (!meals.length) {
//         return (
//             <Container>
//                 <div className="relative w-full h-64 md:h-96 lg:h-[700px] overflow-hidden rounded-2xl shadow-2xl">
//                     <Skeleton className="absolute inset-0 w-full h-full" />
//                     <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4 space-y-4">
//                         <Skeleton className="h-8 w-48 rounded animate-pulse" />
//                         <Skeleton className="h-6 w-32 rounded animate-pulse" />
//                         <Skeleton className="h-10 w-40 rounded-lg animate-pulse" />
//                     </div>
//                 </div>
//             </Container>
//         );
//     }

//     return (
//         <Container>
//             <div className="relative w-full h-64 md:h-96 lg:h-[700px] overflow-hidden rounded-2xl shadow-2xl">
//                 <AnimatePresence>
//                     <Motion.img
//                         key={index}
//                         src={current.foodImage}
//                         alt={current.foodName}
//                         className="absolute inset-0 w-full h-full object-cover"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         transition={{ duration: 0.8 }}
//                     />
//                 </AnimatePresence>

//                 {/* Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-center items-center text-gray-100 text-center px-6">
//                     <Motion.h2
//                         key={current.foodName}
//                         initial={{ y: 30, opacity: 0 }}
//                         animate={{ y: 0, opacity: 1 }}
//                         transition={{ duration: 0.6 }}
//                         className="text-3xl md:text-5xl font-extrabold drop-shadow-lg"
//                     >
//                         {current.foodName}
//                     </Motion.h2>
//                     <p className="text-lg md:text-xl mt-2 italic text-gray-200">
//                         By {current.chefName}
//                     </p>
//                     <Link
//                         to="/meals"
//                         className="mt-6 bg-[#ffde59] text-black font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-yellow-400 hover:shadow-xl transition transform hover:scale-105"
//                     >
//                         View Meals →
//                     </Link>
//                 </div>

//                 {/* Navigation Buttons */}
//                 <button
//                     onClick={handlePrev}
//                     className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
//                 >
//                     <IoIosArrowBack size={16} />
//                 </button>
//                 <button
//                     onClick={handleNext}
//                     className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
//                 >
//                     <IoIosArrowForward size={16} />
//                 </button>
//             </div>
//         </Container>
//     );
// };

// export default Banner;


import { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import Container from "../../../components/Shared/Container";
import Skeleton from "../../../components/Skeleton";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Define animation variants for staggered effect
const bannerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2, // Time between child animations
            delayChildren: 0.3, // Delay before children start animating
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};


const Banner = () => {
    const [meals, setMeals] = useState([]);
    const [index, setIndex] = useState(0);
    const axiosPublic = useAxiosPublic();

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const res = await axiosPublic.get(
                    "/meals?limit=3&fields=foodName,foodImage,chefName"
                );
                setMeals(res.data.data || []);
            } catch (err) {
                console.log(err);
            }
        };
        fetchMeals();
    }, [axiosPublic]);

    useEffect(() => {
        if (!meals.length) return;
        // Adjusted interval to 6000ms (6 seconds) to allow more time for new animations
        const timer = setInterval(
            () => setIndex((i) => (i + 1) % meals.length),
            6000
        );
        return () => clearInterval(timer);
    }, [meals]);

    const current = meals[index];

    const handlePrev = () => {
        setIndex((i) => (i - 1 + meals.length) % meals.length);
    };

    const handleNext = () => {
        setIndex((i) => (i + 1) % meals.length);
    };

    if (!meals.length) {
        return (
            <Container>
                <div className="relative w-full h-64 md:h-96 lg:h-[700px] overflow-hidden rounded-2xl shadow-2xl">
                    <Skeleton className="absolute inset-0 w-full h-full" />
                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-4 space-y-4">
                        <Skeleton className="h-8 w-48 rounded animate-pulse" />
                        <Skeleton className="h-6 w-32 rounded animate-pulse" />
                        <Skeleton className="h-10 w-40 rounded-lg animate-pulse" />
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="relative w-full h-64 md:h-96 lg:h-[700px] overflow-hidden rounded-2xl shadow-2xl">
                <AnimatePresence>
                    {/* Image transition remains smooth */}
                    <Motion.img
                        key={index}
                        src={current.foodImage}
                        alt={current.foodName}
                        className="absolute inset-0 w-full h-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                    />
                </AnimatePresence>

                {/* Overlay with Staggered Animation */}
                <Motion.div
                    key={index} // Key is essential here to re-run animations on content change
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-center items-center text-gray-100 text-center px-6"
                    variants={bannerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Motion.h2
                        variants={itemVariants}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-5xl font-extrabold drop-shadow-lg"
                    >
                        {current.foodName}
                    </Motion.h2>

                    <Motion.p
                        variants={itemVariants}
                        transition={{ duration: 0.6 }}
                        className="text-lg md:text-xl mt-2 italic text-gray-200"
                    >
                        By {current.chefName}
                    </Motion.p>

                    <Motion.div
                        variants={itemVariants}
                        transition={{ duration: 0.6 }}
                    >
                        <Link
                            to="/meals"
                            className="mt-6 inline-block bg-[#ffde59] text-black font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-yellow-400 hover:shadow-xl transition transform hover:scale-105"
                        >
                            View Meals →
                        </Link>
                    </Motion.div>
                </Motion.div>

                {/* Navigation Buttons - Added minor scale/opacity effect on hover */}
                <Motion.button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
                    whileHover={{ scale: 1.1, opacity: 1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <IoIosArrowBack size={16} />
                </Motion.button>
                <Motion.button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
                    whileHover={{ scale: 1.1, opacity: 1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <IoIosArrowForward size={16} />
                </Motion.button>
            </div>
        </Container>
    );
};

export default Banner;