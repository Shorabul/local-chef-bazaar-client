import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { LayoutDashboard } from 'lucide-react';
import Skeleton from '../../../components/Skeleton';
import EmptyState from '../../../components/EmptyState';
import { motion as Motion } from "framer-motion";

const OrderRequests = () => {
    const { backendData } = useAuth();
    const axiosSecure = useAxiosSecure();
    const isDark = document.documentElement.classList.contains("dark");

    const { data: orders = [], refetch, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/orders/chef/${backendData.chefId}`);
            return res.data;
        },
    });

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await axiosSecure.patch(`/orders/status/${orderId}`, { orderStatus: newStatus });
            Swal.fire({
                icon: "success",
                title: `Order ${newStatus}`,
                timer: 2000,
                showConfirmButton: false,
                background: isDark ? "#262626" : "#ffffff",
                color: isDark ? "#ffffff" : "#262626",
            });
            refetch();
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error",
                text: "Failed to update order",
                icon: "error",
                background: isDark ? "#262626" : "#ffffff",
                color: isDark ? "#ffffff" : "#262626",
                iconColor: "#fb2c36",
                confirmButtonColor: "#fb2c36",
            });
        }
    };

    // Skeleton Loader
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
            <Motion.div className="text-center mb-6">
                <h1 className="font-bold text-2xl">Order Requests</h1>
                <p className="flex justify-center gap-2 text-sm opacity-80">
                    <LayoutDashboard size={16} /> Dashboard / Order Requests
                </p>
            </Motion.div>
            {/* Empty State */}
            {orders.data?.length === 0 ? (
                <EmptyState message="No order requests yet." />
            ) : (
                // Table
                <div className="overflow-x-auto rounded-xl shadow bg-neutral-50 dark:bg-neutral-700">
                    <table className="table-auto w-full text-left">
                        <thead className="bg-[#ffde59] text-black text-sm uppercase tracking-wide">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Food</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Qty</th>
                                <th className="px-4 py-3">User Email</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Address</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Payment</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="ttext-neutral-600 dark:text-neutral-300 text-sm">
                            {orders.data?.map((order, i) => {
                                const isCancelled = order.orderStatus === "cancelled";
                                const isAccepted = order.orderStatus === "accepted";
                                const isDelivered = order.orderStatus === "delivered";

                                return (
                                    <Motion.tr
                                        key={order._id}
                                        variants={rowVariants}
                                        whileHover={{ scale: 1.01, backgroundColor: "rgba(0,0,0,0.03)" }}
                                        className="border-b border-neutral-200 dark:border-neutral-600 transition"
                                    >
                                        <td className="px-4 py-3">{i + 1}</td>
                                        <td className="px-4 py-3 font-semibold">{order.foodName}</td>
                                        <td className="px-4 py-3">${order.price}</td>
                                        <td className="px-4 py-3">{order.quantity}</td>
                                        <td className="px-4 py-3">{order.userEmail}</td>
                                        <td className="px-4 py-3">
                                            {new Date(order.createAt).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">{order.userAddress}</td>

                                        {/* Status Badge */}
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold text-white
                                                ${isCancelled
                                                        ? "bg-red-500"
                                                        : isDelivered
                                                            ? "bg-green-500"
                                                            : isAccepted
                                                                ? "bg-blue-500"
                                                                : "bg-yellow-500"
                                                    }`}
                                            >
                                                {order.orderStatus}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3 font-medium">{order.paymentStatus}</td>

                                        {/* Action Buttons */}
                                        <td className="px-4 py-3 flex gap-2">
                                            <button
                                                disabled={isCancelled || isAccepted || isDelivered}
                                                onClick={() => handleStatusUpdate(order._id, "cancelled")}
                                                className={`px-3 py-1 rounded text-white text-xs font-semibold
                                                ${isCancelled || isAccepted || isDelivered
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-red-500 hover:bg-red-600"
                                                    }`}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                disabled={isCancelled || isAccepted || isDelivered}
                                                onClick={() => handleStatusUpdate(order._id, "accepted")}
                                                className={`px-3 py-1 rounded text-white text-xs font-semibold
                                                ${isCancelled || isAccepted || isDelivered
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-blue-500 hover:bg-blue-600"
                                                    }`}
                                            >
                                                Accept
                                            </button>

                                            <button
                                                disabled={!isAccepted || isCancelled || isDelivered}
                                                onClick={() => handleStatusUpdate(order._id, "delivered")}
                                                className={`px-3 py-1 rounded text-white text-xs font-semibold
                                                ${!isAccepted || isCancelled || isDelivered
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-green-500 hover:bg-green-600"
                                                    }`}
                                            >
                                                Deliver
                                            </button>
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

export default OrderRequests;