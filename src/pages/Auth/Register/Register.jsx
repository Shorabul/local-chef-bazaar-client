import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { LuUserRound, LuMail, LuLock, LuUpload, LuChevronRight, } from "react-icons/lu";
import { IoLocationOutline } from "react-icons/io5";
import { motion as Motion } from "framer-motion";
import AnimatedInput from '../AnimatedInput';
import Swal from 'sweetalert2';


const Register = () => {
    const { registerUser, updateUserProfile, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors, touchedFields }, watch, setError } = useForm({ mode: "onChange" });
    const password = watch("password");

    // Redirect if logged in
    useEffect(() => {
        if (user) navigate("/", { replace: true });
    }, [user, navigate]);

    // Firebase error parse
    const getFirebaseErrorMessage = (error) => {
        const map = {
            "auth/email-already-in-use": "This email is already registered.",
            "auth/invalid-email": "Invalid email address.",
            "auth/weak-password": "Your password is too weak.",
        };
        return map[error.code] || error.message;
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Register user in Firebase
            await registerUser(data.email, data.password);

            // Upload profile image
            const formData = new FormData();
            formData.append("image", data.photo[0]);
            const imgRes = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
                formData
            );
            const photoURL = imgRes.data.data.url;

            // Save user in backend
            const userInfo = {
                email: data.email,
                displayName: data.name,
                photoURL,
                address: data.address,
                status: "active",
            };
            await axiosSecure.post("/users", userInfo);

            // Update Firebase profile
            await updateUserProfile({ displayName: data.name, photoURL });

            await axiosSecure.post("/jwt", { email: data.email });

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "You have successfully Create an account",
                showConfirmButton: false,
                timer: 1500
            });

            // Navigate to home or previous route
            navigate(location?.state || '/');
        } catch (error) {
            const errMsg = getFirebaseErrorMessage(error);
            if (error.code?.includes("email")) {
                setError("email", { type: "firebase", message: errMsg });
            } else if (error.code === "auth/weak-password") {
                setError("password", { type: "firebase", message: errMsg });
            } else {
                console.log(error);
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-sm mx-auto h-screen pt-10 space-y-5
            text-neutral-700
            dark:text-neutral-50"
        >
            {/* Header */}
            <Motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
            >
                <h1 className="font-bold text-4xl">Create an account</h1>
                <div className="flex gap-2 text-neutral-600
            dark:text-neutral-100">
                    <p>Already have an account?</p>
                    <Link to="/login" className="underline">Log in</Link>
                </div>
            </Motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Name */}
                <AnimatedInput
                    icon={LuUserRound}
                    error={errors.name}
                    touched={touchedFields.name}
                >
                    <input
                        type="text"
                        placeholder="Full Name"
                        {...register("name", { required: "Name is required" })}
                        className='w-full pl-10 py-3 border rounded-lg
                        bg-neutral-50
                        dark:bg-neutral-700
                        border-gray-300 dark:border-gray-500'
                    />
                </AnimatedInput>
                {errors.name && <p className="text-red-600 text-xs">{errors.name.message}</p>}

                {/* Photo */}
                <AnimatedInput
                    icon={LuUpload}
                    error={errors.photo}
                    touched={touchedFields.photo}
                >
                    <input
                        type="file"
                        {...register("photo", { required: "Photo is required" })}
                        className='w-full pl-10 py-3 border rounded-lg
                        bg-neutral-50
                        dark:bg-neutral-700
                        border-gray-300 dark:border-gray-500'
                    />
                </AnimatedInput>
                {errors.photo && <p className="text-red-600 text-xs">{errors.photo.message}</p>}

                {/* Address */}
                <AnimatedInput
                    icon={IoLocationOutline}
                    error={errors.address}
                    touched={touchedFields.address}
                >
                    <input
                        type="text"
                        placeholder="Address"
                        {...register("address", { required: "Address is required" })}
                        className='w-full pl-10 py-3 border rounded-lg
                        bg-neutral-50
                        dark:bg-neutral-700
                        border-gray-300 dark:border-gray-500'
                    />
                </AnimatedInput>
                {errors.address && <p className="text-red-600 text-xs">{errors.address.message}</p>}

                {/* Email */}
                <AnimatedInput
                    icon={LuMail}
                    error={errors.email}
                    touched={touchedFields.email}
                >
                    <input
                        type="email"
                        placeholder="Email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+\.\S+$/, // simple email regex
                                message: "Invalid email address",
                            },
                        })}
                        className='w-full pl-10 py-3 border rounded-lg
                        bg-neutral-50
                        dark:bg-neutral-700
                        border-gray-300 dark:border-gray-500'
                    />
                </AnimatedInput>

                {errors.email && <p className="text-red-600 text-xs">{errors.email.message}</p>}

                {/* Password */}
                <AnimatedInput
                    icon={LuLock}
                    error={errors.password}
                    touched={touchedFields.password}
                >
                    <input
                        type="password"
                        placeholder="Password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: { value: 6, message: "Min 6 characters" }
                        })}
                        className='w-full pl-10 py-3 border rounded-lg
                        bg-neutral-50
                        dark:bg-neutral-700
                        border-gray-300 dark:border-gray-500'
                    />
                </AnimatedInput>
                {errors.password && <p className="text-red-600 text-xs">{errors.password.message}</p>}

                {/* Confirm Password */}
                <AnimatedInput
                    icon={LuLock}
                    error={errors.confirmPassword}
                    touched={touchedFields.confirmPassword}
                >
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        {...register("confirmPassword", {
                            required: "Confirm Password is required",
                            validate: (value) =>
                                value === password || "Passwords do not match"
                        })}
                        className='w-full pl-10 py-3 border rounded-lg
                        bg-neutral-50
                        dark:bg-neutral-700
                        border-gray-300 dark:border-gray-500'
                    />
                </AnimatedInput>
                {errors.confirmPassword && <p className="text-red-600 text-xs">{errors.confirmPassword.message}</p>}


                {/* Submit */}
                <Motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center items-center gap-2 py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 font-semibold transition cursor-pointer ${loading ? "opacity-60" : ""}`}
                >
                    Create an account
                    <LuChevronRight />
                </Motion.button>
            </form>
        </Motion.div>
    );
};

export default Register;
