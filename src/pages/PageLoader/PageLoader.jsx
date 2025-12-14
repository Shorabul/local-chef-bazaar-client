import { motion as Motion } from "framer-motion";

const PageLoader = () => (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
        {/* Logo animation */}
        <Motion.img
            src="https://i.ibb.co/WNVv4py3/Loc-Chef.png"
            alt="local chef bazaar"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 360 }}

            transition={{
                duration: 0.6,
                ease: "easeOut",
            }}
            className="w-24 h-24 mb-6 rounded-full"
        />
    </div>
);

export default PageLoader;