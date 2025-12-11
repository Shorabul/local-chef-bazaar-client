import { motion as Motion, AnimatePresence } from "framer-motion";

const ProfileDropdown = ({ user, profileToggle, handleLogOut, handleProfileToggle }) => {
    return (
        <div className="relative">
            <img
                onClick={handleProfileToggle}
                className="h-10 w-10 rounded-full cursor-pointer hover:scale-105 transition hover:ring-2 hover:ring-yellow-400"
                src={user.photoURL}
                alt={user.displayName}
            />

            {/* Profile Dropdown */}
            <AnimatePresence>
                {profileToggle && (
                    <Motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 p-2 w-46 rounded-xl text-neutral-700 dark:text-neutral-50 bg-neutral-50 dark:bg-neutral-700 backdrop-blur-md shadow-xl overflow-hidden"
                    >
                        <h1 className="font-semibold">{user?.displayName}</h1>
                        <p className="text-sm">
                            {user.email}
                        </p>

                        <button
                            onClick={handleLogOut}
                            className="mt-3 w-full py-2 bg-[#ffde59] text-black rounded-md font-semibold hover:bg-yellow-500 transition"
                        >
                            Logout
                        </button>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfileDropdown;