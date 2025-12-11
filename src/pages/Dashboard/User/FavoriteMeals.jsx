import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

const FavoriteMeals = () => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();

    // Fetch favorite meals
    const fetchFavorites = async () => {
        try {
            const response = await axiosSecure.get(
                `/favorites?userEmail=${user.email}`
            );
            setFavorites(response.data.data || response.data);
        } catch (error) {
            console.error("Failed to fetch favorites:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Failed to load favorite meals",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [user.email]);

    // Delete a favorite meal
    const handleDelete = async (mealId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to remove this meal from favorites?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/favorites/${mealId}`);
                setFavorites(favorites.filter((fav) => fav._id !== mealId));
                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Meal removed from favorites successfully.",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (error) {
                console.error("Failed to delete favorite:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Failed to remove meal from favorites",
                });
            }
        }
    };

    if (loading) return <div>Loading favorite meals...</div>;
    if (favorites.length === 0) return <div>No favorite meals added yet.</div>;

    return (
        <div className="overflow-x-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Favorite Meals</h2>
            <table className="table w-full ">
                <thead>
                    <tr className="text-gray-700">
                        <th></th>
                        <th>Meal Name</th>
                        <th>Chef Name</th>
                        <th>Price</th>
                        <th>Date Added</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {favorites.map((fav) => (
                        <tr key={fav._id}>
                            <td></td>
                            <td>{fav.mealName}</td>
                            <td>{fav.chefName}</td>
                            <td>{fav.price ? `$${parseFloat(fav.price).toFixed(2)}` : "N/A"}</td>
                            <td>{new Date(Number(fav.addedTime)).toLocaleDateString()}</td>
                            <td>
                                <button
                                    onClick={() => handleDelete(fav._id)}
                                    className="btn btn-sm btn-error"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FavoriteMeals;
