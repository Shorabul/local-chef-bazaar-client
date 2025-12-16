# Locchef

## Project Purpose

Locchef is a full-stack MERN marketplace that connects local home chefs with customers looking for fresh, homemade meals. The platform enables users to browse meals, place orders, make secure payments, track deliveries, and leave reviews, while chefs can manage meals and orders. Admins oversee users, requests, orders, and platform-wide statistics.

This project is designed to demonstrate real-world application development skills, including authentication, role-based access control, secure payments, and dashboard analytics.

---

## Live URL

🔗 **Url:** <YOUR_LIVE_CLIENT_URL>

---

## Key Features

### 🔐 Authentication & Security

* Firebase email/password authentication
* JWT-based secure API access (httpOnly cookies)
* Role-based route protection (Admin / Chef / User)
* Environment variable protection for Firebase & MongoDB

### 👥 User Roles

* **Admin:** Manage users, requests, orders, and platform statistics
* **Chef:** Create and manage meals, handle order requests
* **User:** Browse meals, place orders, make payments, leave reviews

### 🍽️ Meals & Orders

* Dynamic daily meals with sorting & pagination
* Meal details with reviews and favorites
* Order confirmation with quantity-based pricing
* Real-time order status updates

### 💳 Payments

* Stripe payment integration
* Secure checkout session
* Payment success page with transaction & tracking ID
* Payment history stored in MongoDB

### 📊 Dashboards

* **User Dashboard:** Profile, orders, reviews, favorites
* **Chef Dashboard:** Create meals, manage meals & order requests
* **Admin Dashboard:** Manage users, requests, and platform statistics

### 📈 Platform Statistics (Admin)

* Total payment amount
* Total registered users
* Pending orders count
* Delivered orders count
* Visualized using Recharts (Bar / Pie charts)

### 🌟 UI & UX

* Responsive design (mobile-friendly)
* Framer Motion animations
* Dark / Light theme toggle
* Loading & error fallback pages

---

## Technologies Used

### Frontend

* React
* React Router
* React Hook Form
* TanStack React Query
* Axios (with interceptors)
* Firebase Authentication
* SweetAlert2
* Framer Motion
* Recharts
* DaisyUI + Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* Stripe Payment API
* CORS

🎉 **Thank you for reviewing Locchef!**