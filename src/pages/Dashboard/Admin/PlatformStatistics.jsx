import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { usePageTitle } from "../../../hooks/usePageTitle";

const COLORS = ["#ffde59", "#22c55e", "#3b82f6", "#ef4444"];

const PlatformStatistics = () => {
    usePageTitle('Platform Statistics');
    const axiosSecure = useAxiosSecure();

    const { data = {}, isLoading } = useQuery({
        queryKey: ["platformStats"],
        queryFn: async () => {
            const res = await axiosSecure.get("/admin/platform-stats");
            return res.data;
        },
    });

    if (isLoading) {
        return <div className="text-center py-10">Loading statistics...</div>;
    }

    const {
        totalPayments = 0,
        totalUsers = 0,
        ordersPending = 0,
        ordersDelivered = 0,
    } = data;

    const barData = [
        { name: "Payments", value: totalPayments },
        { name: "Users", value: totalUsers },
    ];

    const pieData = [
        { name: "Pending Orders", value: ordersPending },
        { name: "Delivered Orders", value: ordersDelivered },
    ];
    return (
        <div className="p-6 space-y-8">
            {/* Stats Cards */}
            <div className="stats shadow w-full bg-neutral-50 dark:bg-neutral-600">
                <div className="stat place-items-center">
                    <div className="stat-title text-neutral-600 dark:text-neutral-300">Total Payments</div>
                    <div className="stat-value text-[#ffde59]">${totalPayments.toFixed(2)}</div>
                    <div className="stat-desc text-neutral-600 dark:text-neutral-300">All time revenue</div>
                </div>


                <div className="stat place-items-center">
                    <div className="stat-title text-neutral-600 dark:text-neutral-300">Total Users</div>
                    <div className="stat-value text-blue-500">{totalUsers}</div>
                    <div className="stat-desc text-neutral-600 dark:text-neutral-300">Registered users</div>
                </div>

                <div className="stat place-items-center">
                    <div className="stat-title text-neutral-600 dark:text-neutral-300">Pending Orders</div>
                    <div className="stat-value text-red-500">{ordersPending}</div>
                    <div className="stat-desc text-neutral-600 dark:text-neutral-300">Awaiting delivery</div>
                </div>

                <div className="stat place-items-center">
                    <div className="stat-title text-neutral-600 dark:text-neutral-300">Delivered Orders</div>
                    <div className="stat-value text-green-500">{ordersDelivered}</div>
                    <div className="stat-desc text-neutral-600 dark:text-neutral-300">Successfully completed</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-neutral-50 dark:bg-neutral-600 p-4 rounded-xl shadow">
                    <h3 className="font-bold mb-4 text-center text-neutral-600 dark:text-neutral-300">Payments & Users</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#ffde59" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="bg-neutral-50 dark:bg-neutral-600 p-4 rounded-xl shadow">
                    <h3 className="font-bold mb-4 text-center text-neutral-600 dark:text-neutral-300">Order Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                label
                            >
                                {pieData.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default PlatformStatistics;
