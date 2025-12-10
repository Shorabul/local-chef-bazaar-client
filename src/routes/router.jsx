import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import MyOrders from "../pages/Dashboard/User/MyOrders";
import MyReview from "../pages/Dashboard/User/MyReview";
import FavoriteMeals from "../pages/Dashboard/User/FavoriteMeals";
import CreateMeal from "../pages/Dashboard/Chef/CreateMeal";
import MyMeals from "../pages/Dashboard/Chef/MyMeals";
import OrderRequests from "../pages/Dashboard/Chef/OrderRequests";
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import ManageRequests from "../pages/Dashboard/Admin/ManageRequests";
import PlatformStatistics from "../pages/Dashboard/Admin/PlatformStatistics";
import DashboardLayout from "../layouts/DashboardLayout";
import Profile from "../pages/Dashboard/Profile";
import PrivateRoute from "./PrivateRoute";
import UpdateMeal from "../pages/Dashboard/Chef/UpdateMeal";
import Meals from "../pages/Meals/Meals";
import MealDetails from "../pages/MealDetails/MealDetails";
import OrderConfirm from "../pages/OrderConfirm/OrderConfirm";
import PaymentSuccess from "../pages/Dashboard/User/PaymentSuccess";
import PaymentCancelled from "../pages/Dashboard/User/PaymentCancelled";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: '/meals', element: <Meals /> },
            { path: '/meals/:id', element: <MealDetails /> },
            { path: '/order-confirm/:id', element: <OrderConfirm /> },
        ]
    },
    { path: '/login', element: <Login />, },
    { path: '/register', element: <Register />, },
    {
        path: '/dashboard',
        element: (<PrivateRoute>
            <DashboardLayout />
        </PrivateRoute>),
        children: [
            { path: 'profile', element: <Profile /> },

            //user Routes
            { path: 'orders', element: <MyOrders /> },
            { path: 'review', element: <MyReview /> },
            { path: 'favorites', element: <FavoriteMeals /> },
            { path: 'payment-success', element: <PaymentSuccess /> },
            { path: 'payment-cancelled', element: <PaymentCancelled /> },

            // Chef Routes
            { path: 'create-meal', element: <CreateMeal /> },
            { path: 'my-meals', element: <MyMeals /> },
            { path: 'order-requests', element: <OrderRequests /> },
            { path: 'meal-update/:id', element: <UpdateMeal /> },

            // Admin Routes
            { path: 'manage-users', element: <ManageUsers /> },
            { path: 'manage-requests', element: <ManageRequests /> },
            { path: 'statistics', element: <PlatformStatistics /> },
        ]
    }

]);