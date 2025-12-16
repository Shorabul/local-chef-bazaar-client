import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion as Motion } from "framer-motion";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Skeleton from "../../components/Skeleton";
import { usePageTitle } from "../../hooks/usePageTitle";
import { MdEmail, MdLocationOn, MdStar, MdLock, MdOutlineCameraAlt } from "react-icons/md";
import { useForm } from "react-hook-form";
import axios from "axios";

const Profile = () => {
    usePageTitle('Profile');
    const { user, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const isDark = document.documentElement.classList.contains("dark");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axiosSecure.get(`/users/${user.email}`);
                setUserData(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (user?.email) fetchUser();
    }, [user, axiosSecure]);


    const onSubmit = async (data) => {
        if (!data.photo || data.photo.length === 0) {
            Swal.fire({
                title: "Warning",
                text: "Please select an image file to upload.",
                icon: "warning",
                background: isDark ? "#262626" : "#ffffff",
                color: isDark ? "#ffffff" : "#262626",
            });
            return;
        }

        try {
            // Upload profile image to imgbb
            const formData = new FormData();
            formData.append("image", data.photo[0]);

            const imgRes = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
                formData
            );
            const newImageUrl = imgRes.data.data.url;

            // Update backend database (photoURL)
            await axiosSecure.patch(`/users/${userData.email}/update-photo`, {
                photoURL: newImageUrl
            });

            // Update Firebase/Auth context (optional but recommended)
            await updateUserProfile({ displayName: user.displayName, photoURL: newImageUrl });

            // Update local state for immediate UI refresh
            setUserData(prev => ({ ...prev, photoURL: newImageUrl }));

            // Close the modal manually
            document.getElementById('my_modal_5').close();

            // Show success message
            Swal.fire({
                title: "Updated!",
                text: "Your profile picture has been updated.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                background: isDark ? "#262626" : "#ffffff",
                color: isDark ? "#ffffff" : "#262626",
            });

        } catch (error) {
            console.error("Image update failed:", error);
            Swal.fire({
                title: "Error",
                text: "Failed to upload or update profile picture. Please try again.",
                icon: "error",
                background: isDark ? "#262626" : "#ffffff",
                color: isDark ? "#ffffff" : "#262626",
                iconColor: "#fb2c36",
                confirmButtonColor: "#fb2c36",
            });
        }
    };

    const handleRoleRequest = async (roleType) => {
        try {
            await axiosSecure.post("/role-requests", {
                userName: userData.displayName,
                userEmail: userData.email,
                requestType: roleType,
            });
            Swal.fire({
                title: "Submitted",
                text: `Your request to become a ${roleType} has been submitted!`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                background: isDark ? "#262626" : "#ffffff",
                color: isDark ? "#ffffff" : "#262626",
            });

            // Update local userData so button disables immediately
            setUserData(prev => ({
                ...prev,
                roleRequest: {
                    ...prev.roleRequest,
                    [roleType]: "pending"
                }
            }));
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: `Your request to become ${roleType} failed.`,
                icon: "error",
                background: isDark ? "#262626" : "#ffffff",
                color: isDark ? "#ffffff" : "#262626",
                iconColor: "#fb2c36",
                confirmButtonColor: "#fb2c36",
            });
        }
    };

    if (loading) {
        return (
            <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl mt-10">
                <div className="flex flex-col items-center">
                    <Skeleton className="w-36 h-36 rounded-full mb-6" />
                    <Skeleton className="h-8 w-56 mb-3" />
                    <Skeleton className="h-5 w-64 mb-1" />
                    <Skeleton className="h-5 w-52 mb-6" />
                    <div className="flex justify-center gap-4 mt-6 w-full">
                        <Skeleton className="h-12 w-36 rounded-xl" />
                        <Skeleton className="h-12 w-36 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    const chefRequestPending = userData?.roleRequest?.chef === "pending";
    const adminRequestPending = userData?.roleRequest?.admin === "pending";

    return (
        <Motion.div
            className="max-w-xl mx-auto bg-neutral-100 dark:bg-neutral-700 p-8 rounded-2xl shadow-xl mt-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex flex-col items-center border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">

                {/* Profile Picture with Edit Button */}
                <div className="relative group mb-4">
                    <img
                        src={userData?.photoURL}
                        alt="profile"
                        className="w-36 h-36 rounded-full object-cover ring-4 ring-yellow-500 shadow-lg"
                    />
                    <button
                        onClick={() => document.getElementById('my_modal_5').showModal()}
                        className="absolute bottom-0 right-0 p-2 bg-[#ffde59] rounded-full text-black opacity-80 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-1 translate-y-1 shadow-md hover:scale-110"
                        title="Update Image"
                    >
                        <MdOutlineCameraAlt className="w-4 h-4" />
                    </button>

                    {/* Modal Definition */}
                    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                        <div className="modal-box p-6 sm:p-8 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl shadow-2xl">

                            {/* Modal Header */}
                            <h3 className="text-2xl font-bold mb-4 border-b pb-3 border-gray-200 dark:border-gray-700">
                                📸 Update Profile Image
                            </h3>

                            <div className="modal-action p-0 m-0">
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="w-full space-y-4">

                                    {/* File Input Field */}
                                    <div className="flex flex-col items-start space-y-2">
                                        <label
                                            htmlFor="image-upload"
                                            className="text-sm font-medium text-gray-600 dark:text-gray-300"
                                        >
                                            Select a new image (JPG, PNG)
                                        </label>
                                        <input
                                            type="file"
                                            {...register("photo", { required: "Photo is required" })}
                                            className='w-full p-3 
                                                text-sm
                                                rounded-lg border-2 
                                                bg-neutral-50 dark:bg-gray-700
                                                border-gray-300 dark:border-gray-600
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-[#ffde59] file:text-gray-900
                                                hover:file:bg-yellow-400
                                                cursor-pointer
                                                focus:outline-none focus:ring-2 focus:ring-[#ffde59] focus:border-[#ffde59]'
                                            accept="image/png, image/jpeg"
                                        />
                                        {/* Display error message */}
                                        {errors.photo && <p className="text-red-500 text-xs mt-1">{errors.photo.message}</p>}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('my_modal_5').close()}
                                            className="py-2 px-5 rounded-lg 
                                                bg-gray-200 dark:bg-gray-700 
                                                hover:bg-gray-300 dark:hover:bg-gray-600
                                                font-semibold text-gray-700 dark:text-gray-300 
                                                transition duration-150"
                                        >
                                            Cancel
                                        </button>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            className="py-2 px-5 rounded-lg 
                                                bg-[#ffde59] hover:bg-yellow-400 
                                                font-semibold text-black shadow-md 
                                                transition duration-150"
                                        >
                                            Upload & Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </dialog>
                </div>

                {/* User Details */}
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">{userData?.displayName}</h2>

                <div className="flex items-center text-gray-600 dark:text-gray-300 mb-1">
                    <MdEmail className="w-5 h-5 mr-2 text-brand dark:text-yellow-500" />
                    <p className="text-lg">{userData?.email}</p>
                </div>

                {userData?.address && (
                    <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
                        <MdLocationOn className="w-5 h-5 mr-2 text-brand dark:text-yellow-500" />
                        <p>{userData?.address}</p>
                    </div>
                )}
            </div>

            {/* Role and Status Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex flex-col items-center p-4 bg-neutral-200 dark:bg-neutral-600 rounded-lg shadow-inner">
                    <div className="flex items-center mb-1">
                        <MdStar className="w-5 h-5 mr-2 text-yellow-400" />
                        <p className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-300">Role</p>
                    </div>
                    <span className="text-xl font-bold text-brand dark:text-yellow-500">{userData?.role}</span>
                </div>

                <div className="flex flex-col items-center p-4 bg-neutral-200 dark:bg-neutral-600 rounded-lg shadow-inner">
                    <div className="flex items-center mb-1">
                        <MdLock className="w-5 h-5 mr-2 text-green-500" />
                        <p className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-300">Status</p>
                    </div>
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">{userData?.status}</span>
                </div>

                {userData?.role === "chef" && (
                    <div className="col-span-1 sm:col-span-2 flex flex-col items-center p-4 bg-neutral-200 dark:bg-neutral-600 rounded-lg">
                        <p className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-300">Chef ID</p>
                        <span className="text-xl font-bold text-brand dark:text-yellow-500">{userData?.chefId}</span>
                    </div>
                )}
            </div>

            {/* Role request buttons */}
            <div className="flex justify-center gap-4 mt-6">
                {userData?.role === "user" && (
                    <Motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`bg-[#ffde59] hover:bg-yellow-400 text-black dark:text-black font-semibold py-2 px-6 text-xs md:text-sm lg:text-base rounded-md shadow ${chefRequestPending ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => handleRoleRequest("chef")}
                        disabled={chefRequestPending}
                    >
                        {chefRequestPending ? "Chef Request Pending" : "Be a Chef"}
                    </Motion.button>
                )}
                {userData?.role !== "admin" && (
                    <Motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-6 text-xs md:text-sm lg:text-base rounded-md shadow ${adminRequestPending ? "opacity-50 cursor-not-allowed" : ""}`}
                        onClick={() => handleRoleRequest("admin")}
                        disabled={adminRequestPending}
                    >
                        {adminRequestPending ? "Admin Request Pending" : "Be an Admin"}
                    </Motion.button>
                )}
            </div>
        </Motion.div>
    );
};

export default Profile;
