import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const OrderRequests = () => {
    const { user } = useAuth(); // logged-in chef
    const axiosSecure = useAxiosSecure();

    const { data: orders = [], refetch } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/orders/chef/${user.chefId}`);
            return res.data;
        },
    });

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await axiosSecure.patch(`/orders/status/${orderId}`, { orderStatus: newStatus });
            Swal.fire({
                icon: 'success',
                title: `Order ${newStatus}`,
            });
            refetch();
        } catch (error) {
            console.error(error);
            Swal.fire({ icon: 'error', title: 'Failed to update order' });
        }
    };

    return (
        <div className="overflow-x-auto w-full">
            <table className="table-auto w-full border-collapse text-left">
                <thead className="bg-yellow-400 text-black">
                    <tr>
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Food</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Qty</th>
                        <th className="px-4 py-2">User Email</th>
                        <th className="px-4 py-2">Order Time</th>
                        <th className="px-4 py-2">Address</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Payment</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.data?.map((order, i) => {
                        const isCancelled = order.orderStatus === 'cancelled';
                        const isAccepted = order.orderStatus === 'accepted';
                        const isDelivered = order.orderStatus === 'delivered';

                        return (
                            <tr key={order._id} className="border-b hover:bg-gray-100 text-neutral-700">
                                <td className="px-4 py-2">{i + 1}</td>
                                <td className="px-4 py-2 font-semibold">{order.mealName}</td>
                                <td className="px-4 py-2">${order.price}</td>
                                <td className="px-4 py-2">{order.quantity}</td>
                                <td className="px-4 py-2">{order.userEmail}</td>
                                <td className="px-4 py-2">{new Date(order.orderTime).toLocaleString()}</td>
                                <td className="px-4 py-2">{order.userAddress}</td>
                                <td className="px-4 py-2">
                                    <span
                                        className={`px-2 py-1 rounded-full text-white font-semibold ${isCancelled
                                            ? 'bg-red-500'
                                            : isDelivered
                                                ? 'bg-green-500'
                                                : isAccepted
                                                    ? 'bg-blue-500'
                                                    : 'bg-yellow-500'
                                            }`}
                                    >
                                        {order.orderStatus}
                                    </span>
                                </td>
                                <td className="px-4 py-2 font-medium">{order.paymentStatus}</td>
                                <td className="px-4 py-2 flex gap-2">
                                    <button
                                        disabled={isCancelled || isAccepted || isDelivered}
                                        onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                                        className={`px-3 py-1 rounded text-white font-semibold ${isCancelled || isAccepted || isDelivered
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-red-500 hover:bg-red-600'
                                            }`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={isCancelled || isAccepted || isDelivered}
                                        onClick={() => handleStatusUpdate(order._id, 'accepted')}
                                        className={`px-3 py-1 rounded text-white font-semibold ${isCancelled || isAccepted || isDelivered
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-500 hover:bg-blue-600'
                                            }`}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        disabled={!isAccepted || isCancelled || isDelivered}
                                        onClick={() => handleStatusUpdate(order._id, 'delivered')}
                                        className={`px-3 py-1 rounded text-white font-semibold ${!isAccepted || isCancelled || isDelivered
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-green-500 hover:bg-green-600'
                                            }`}
                                    >
                                        Deliver
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default OrderRequests;