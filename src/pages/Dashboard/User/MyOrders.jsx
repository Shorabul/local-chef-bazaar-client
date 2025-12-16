import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { LayoutDashboard } from 'lucide-react';
import Skeleton from '../../../components/Skeleton';
import EmptyState from '../../../components/EmptyState';
import { motion as Motion } from "framer-motion";
import { usePageTitle } from '../../../hooks/usePageTitle';

const MyOrders = () => {
    usePageTitle('My Orders');
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const isDark = document.documentElement.classList.contains("dark");

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['orders', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/orders/user/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    const handlePay = async (order) => {
        const totalPrice = order.price * order.quantity;

        const result = await Swal.fire({
            title: "Confirm Payment",
            text: `Your total price is $${totalPrice}. Do you want to proceed?`,
            icon: "question",
            background: isDark ? "#262626" : "#ffffff",
            color: isDark ? "#ffffff" : "#262626",
            iconColor: "#facc15",
            showCancelButton: true,
            confirmButtonText: "Yes, Pay Now",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#ffde59",
            cancelButtonColor: "#a1a1a1",
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.post(
                    "/orders/payment-checkout-session",
                    {
                        totalPrice,
                        mealName: order.foodName,
                        customerEmail: user.email,
                        orderId: order._id,
                    }
                );

                // success feedback before redirect
                await Swal.fire({
                    icon: "success",
                    title: "Redirecting to payment...",
                    text: "Please complete your payment securely.",
                    timer: 1500,
                    showConfirmButton: false,
                    background: isDark ? "#262626" : "#ffffff",
                    color: isDark ? "#ffffff" : "#262626",
                });

                window.location.assign(res.data.url);
            } catch (error) {
                console.error(error);
                Swal.fire({
                    title: "Payment Failed",
                    text: "Something went wrong while initiating payment.",
                    icon: "error",
                    background: isDark ? "#262626" : "#ffffff",
                    color: isDark ? "#ffffff" : "#262626",
                    iconColor: "#fb2c36",
                    confirmButtonColor: "#fb2c36",
                });
            }
        }
    };

    // Skeleton Loader (same style as OrderRequests)
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex flex-col items-center justify-center mb-6">
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                </div>

                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr className="bg-yellow-400 text-black">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <th key={i} className="px-4 py-2">
                                        <Skeleton className="h-4 w-20" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4].map((i) => (
                                <tr key={i}>
                                    {Array.from({ length: 10 }).map((_, j) => (
                                        <td key={j} className="px-4 py-3">
                                            <Skeleton className="h-4 w-full" />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    const dateOptions = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // Use AM/PM format
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut",
                staggerChildren: 0.05,
            },
        },
    };

    const rowVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <Motion.div
            className="overflow-x-auto w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Header */}
            <Motion.div className="flex flex-col items-center justify-center mb-6">
                <h1 className="text-center font-bold text-2xl">My Orders</h1>
                <p className="flex gap-2">
                    <span className="opacity-80 flex items-center gap-2">
                        <LayoutDashboard size={16} />Dashboard
                    </span>
                    <span>/ my orders</span>
                </p>
            </Motion.div>

            {/* Empty State */}
            {orders.data?.length === 0 ? (
                <EmptyState message="You have no orders yet." />
            ) : (
                /* Table */
                <div className="overflow-x-auto rounded-xl shadow bg-neutral-50 dark:bg-neutral-700">
                    <table className="table-auto w-full text-left">
                        <thead className="bg-[#ffde59] text-black text-sm uppercase tracking-wide">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Meal</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Qty</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Payment</th>
                                <th className="px-4 py-3">Chef</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>

                        <tbody className="text-gray-500 dark:text-gray-300 text-sm">
                            {orders?.data.map((order, i) => {
                                const canPay =
                                    order?.orderStatus === 'accepted' || order?.orderStatus === "delivered";

                                return (
                                    <Motion.tr
                                        key={order?._id}
                                        variants={rowVariants}
                                        whileHover={{ scale: 1.01, backgroundColor: "rgba(0,0,0,0.03)" }}
                                        className="border-b border-neutral-200 dark:border-neutral-600 transition"
                                    >
                                        <td className="px-4 py-3">{i + 1}</td>
                                        <td className="px-4 py-3 font-semibold">{order?.foodName}</td>
                                        <td className="px-4 py-3">${order?.price}</td>
                                        <td className="px-4 py-3">{order?.quantity}</td>

                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold text-white ${order.orderStatus === 'pending' ? 'bg-yellow-500' : order.orderStatus === 'accepted' ? 'bg-blue-500' : order.orderStatus === 'cancelled' ? 'bg-red-500' : 'bg-green-500'}`}
                                            >
                                                {order?.orderStatus}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 font-medium">
                                            {order?.paymentStatus}
                                        </td>

                                        <td className="px-4 py-3">
                                            <div className='flex flex-col'>
                                                <span>{order?.chefName || 'Unknown'}</span>
                                                <span>{order?.chefId || 'Unknown'}</span>
                                            </div>
                                        </td>

                                        <td className="px-4 py-3">
                                            {/* {new Date(order?.createdAt).toLocaleDateString("en-GB")} */}
                                            {new Date(order?.createdAt).toLocaleString('en-US', dateOptions)}
                                        </td>

                                        <td className="px-4 py-3">
                                            {order?.paymentStatus !== 'paid' && (
                                                <button
                                                    disabled={!canPay}
                                                    onClick={() => handlePay(order)}
                                                    className={`px-3 py-2 rounded-lg text-white text-xs md:text-sm lg:text-base font-semibold
                                                        ${canPay
                                                            ? "bg-green-500 hover:bg-green-600"
                                                            : "bg-gray-400 cursor-not-allowed"
                                                        }`}
                                                >
                                                    Pay
                                                </button>
                                            )}
                                        </td>
                                    </Motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </Motion.div>
    );
};

export default MyOrders;