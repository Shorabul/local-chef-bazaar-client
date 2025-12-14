import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Skeleton from "../../../components/Skeleton";
import EmptyState from "../../../components/EmptyState";
import { UserCog } from "lucide-react";
import { motion as Motion } from "framer-motion";

const ManageRequests = () => {
    const axiosSecure = useAxiosSecure();

    const { data: requests = [], refetch, isLoading } = useQuery({
        queryKey: ["roleRequests"],
        queryFn: async () => {
            const res = await axiosSecure.get("/role-requests");
            return res.data;
        },
    });

    const handleAccept = async (email, type) => {
        try {
            await axiosSecure.patch(`/role-requests/${email}`, {
                requestType: type,
                action: "approved",
            });

            Swal.fire({
                icon: "success",
                title: `${type} request approved`,
            });

            refetch();
        } catch (error) {
            console.log(error);
            Swal.fire({ icon: "error", title: "Action failed" });
        }
    };

    const handleReject = async (email, type) => {
        try {
            await axiosSecure.patch(`/role-requests/${email}`, {
                requestType: type,
                action: "rejected",
            });

            Swal.fire({
                icon: "error",
                title: "Request Rejected",
            });

            refetch();
        } catch (error) {
            console.log(error);
            Swal.fire({ icon: "error", title: "Action failed" });
        }
    };

    // Skeleton while loading
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
                            <tr className="bg-[#ffde59] text-black">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <th key={i} className="px-4 py-2">
                                        <Skeleton className="h-4 w-20" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4].map((i) => (
                                <tr key={i}>
                                    {Array.from({ length: 6 }).map((_, j) => (
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

    // Animations
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: "easeOut", staggerChildren: 0.05 },
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
                <h1 className="font-bold text-2xl">Manage Requests</h1>
                <p className="flex justify-center gap-2 text-sm opacity-80">
                    <UserCog size={16} /> Dashboard / Manage Requests
                </p>
            </Motion.div>

            {/* Empty State */}
            {requests.length === 0 ? <EmptyState message="No role requests found." />
                : <>
                    {/* Table */}
                    <div className="overflow-x-auto rounded-xl shadow bg-white dark:bg-neutral-800">
                        <table className="table-auto w-full text-left">
                            <thead className="bg-[#ffde59] text-black text-sm uppercase tracking-wide">
                                <tr>
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>

                            <tbody className="text-neutral-700 dark:text-neutral-300 text-sm">
                                {requests.map((req, i) => (
                                    <Motion.tr
                                        key={req._id}
                                        variants={rowVariants}
                                        whileHover={{ scale: 1.01, backgroundColor: "rgba(0,0,0,0.03)" }}
                                        className="border-b border-neutral-200 dark:border-neutral-700 transition"
                                    >
                                        <td className="px-4 py-3">{i + 1}</td>

                                        {/* Name + Email */}
                                        <td className="px-4 py-3">
                                            <div className="font-semibold">{req.userName}</div>
                                            <div className="text-xs opacity-70">{req.userEmail}</div>
                                        </td>

                                        <td className="px-4 py-3">{req.requestType}</td>

                                        {/* Status Badge */}
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold text-white
                                            ${req.requestStatus === "pending"
                                                        ? "bg-yellow-400"
                                                        : req.requestStatus === "approved"
                                                            ? "bg-green-500"
                                                            : "bg-red-500"
                                                    }
                                        `}
                                            >
                                                {req.requestStatus}
                                            </span>
                                        </td>

                                        <td className="px-4 py-3">{new Date(req.createdAt).toLocaleString()}</td>

                                        {/* Action Buttons */}
                                        <td className="px-4 py-3 flex gap-2">
                                            <button
                                                disabled={req.requestStatus !== "pending"}
                                                onClick={() => handleAccept(req.userEmail, req.requestType)}
                                                className="py-1.5 px-3 rounded-lg font-semibold bg-green-400 text-black hover:bg-green-500 disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                disabled={req.requestStatus !== "pending"}
                                                onClick={() => handleReject(req.userEmail, req.requestType)}
                                                className="py-1.5 px-3 rounded-lg font-semibold bg-red-400 text-black hover:bg-red-500 disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </Motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>}


        </Motion.div>
    );
};

export default ManageRequests;