import React from 'react';
import { Link } from 'react-router';

const PaymentCancelled = () => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-5">
            <h2 className="text-3xl font-semibold text-red-500 mb-4">
                Payment Cancelled
            </h2>

            <p className="text-gray-600 mb-6">
                Your payment was cancelled. You can try again anytime.
            </p>

            <Link to="/dashboard/orders">
                <button className="btn bg-primary text-black px-6 py-2 rounded-lg hover:bg-primary/80">
                    Go Back to Orders
                </button>
            </Link>
        </div>
    );
};

export default PaymentCancelled;
