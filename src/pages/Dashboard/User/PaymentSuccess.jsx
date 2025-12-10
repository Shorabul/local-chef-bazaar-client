import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';


const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const sessionId = searchParams.get('session_id');
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        if (!sessionId) {
            setLoading(false);
            setError("Invalid payment session.");
            return;
        }

        axiosSecure
            .patch(`/payment-success?session_id=${sessionId}`)
            .then((res) => {
                setPaymentInfo({
                    transactionId: res.data.transactionId,
                    trackingId: res.data.trackingId,
                });
            })
            .catch(() => {
                setError("Failed to verify your payment.");
            })
            .finally(() => {
                setLoading(false);
            });

    }, [sessionId, axiosSecure]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-xl">
                Processing your payment...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center text-red-500 text-xl">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-5">
            <h2 className="text-4xl font-bold text-green-500 mb-4">
                Payment Successful!
            </h2>

            <p className="text-lg text-gray-700 mb-2">
                <span className="font-semibold">Transaction ID:</span> {paymentInfo.transactionId}
            </p>

            <p className="text-lg text-gray-700 mb-6">
                <span className="font-semibold">Parcel Tracking ID:</span> {paymentInfo.trackingId}
            </p>

            <p className="text-gray-500 mb-6">
                You can track your order from the dashboard.
            </p>

            <a href="/dashboard/orders">
                <button className="btn bg-primary text-black px-6 py-2 rounded-lg hover:bg-primary/80">
                    Go to Orders
                </button>
            </a>
        </div>
    );
};

export default PaymentSuccess;
