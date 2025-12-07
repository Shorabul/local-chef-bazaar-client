import { motion as Motion } from "framer-motion";

const AnimatedInput = ({ icon: Icon, error, touched, children }) => (
    <Motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative"
    >
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className={`${error ? "text-red-500" : touched ? "text-teal-500" : "text-gray-400"}`} />
        </div>
        {children}
        {/* {error && (
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-red-500 text-sm">
                !
            </div>
        )} */}
    </Motion.div>
);

export default AnimatedInput;