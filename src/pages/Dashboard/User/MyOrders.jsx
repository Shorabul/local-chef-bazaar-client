import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const MyOrders = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    // Fetch user's orders
    const { data: orders = [], refetch } = useQuery({
        queryKey: ['orders', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/orders/user/${user.email}`);
            return res.data;
        }
    });

    console.log(orders);

    // Handle Stripe payment
    const handlePay = async (order) => {
        const totalPrice = order.price * order.quantity;

        const result = await Swal.fire({
            title: `Your total price is $${totalPrice}`,
            text: "Do you want to confirm the payment?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            const orderInfo = {
                totalPrice,
                mealName: order.mealName,
                customerEmail: user.email,
                orderId: order._id,
            };

            const res = await axiosSecure.post('/orders/payment-checkout-session', orderInfo);

            // redirect to Stripe
            window.location.assign(res.data.url);
        }
    };


    return (
        <div className="overflow-x-auto w-full p-4 text-neutral-700">
            <table className="table table-zebra w-full">
                <thead>
                    <tr className='text-neutral-700'>
                        <th>#</th>
                        <th>Meal Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Order Status</th>
                        <th>Payment Status</th>
                        <th>Chef Name</th>
                        <th>Chef ID</th>
                        <th>Delivery Time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.data?.map((order, i) => (
                        <tr key={order?._id}>
                            <th>{i + 1}</th>
                            <td>{order?.mealName}</td>
                            <td>${order?.price}</td>
                            <td>{order?.quantity}</td>
                            <td>{order?.orderStatus}</td>
                            <td>{order?.paymentStatus}</td>
                            <td>{order?.chefName || 'Unknown'}</td>
                            <td>{order?.chefId}</td>
                            <td>{new Date(order?.orderTime).toLocaleString()}</td>
                            <td>
                                <button
                                    onClick={() => handlePay(order)}
                                    disabled={!(order.orderStatus === 'accepted' && order.paymentStatus === 'Pending')}
                                    className={`py-1 px-3 rounded font-semibold ${order.orderStatus === 'accepted' && order.paymentStatus === 'Pending'
                                        ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                                        : 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                        }`}
                                >
                                    Pay
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyOrders;
