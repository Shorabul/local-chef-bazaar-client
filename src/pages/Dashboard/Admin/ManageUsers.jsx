import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });
    // console.log(users);

    const handleFraud = async (email) => {
        try {
            const res = await axiosSecure.patch(`/users/${email}`, { status: 'fraud' });
            if (res.data.modifiedCount > 0) {
                Swal.fire({
                    icon: "success",
                    title: "Status Updated to Fraud!",
                    text: `Updated successfully!`,
                });
                refetch();
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="overflow-x-auto w-full text-neutral-700 dark:text-neutral-50">
            <table className="table table-zebra">
                {/* head */}
                <thead className='text-neutral-700 dark:text-neutral-50'>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users?.map((user, i) => <tr>
                            <th>{i + 1}</th>
                            <td>
                                <div>
                                    <div className="font-bold">{user.displayName}</div>
                                    <div className="text-sm opacity-50">{user.email}</div>
                                </div>
                            </td>
                            <td>{user.role}</td>
                            <td>{user.status}</td>
                            <td>
                                {user.role !== 'admin' && user.status === 'active' && (
                                    <button
                                        onClick={() => handleFraud(user.email)}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-1.5 px-3 rounded-lg"
                                    >
                                        Fraud
                                    </button>
                                )}

                            </td>
                        </tr>)
                    }

                </tbody>
            </table>
        </div>

    );
};

export default ManageUsers;