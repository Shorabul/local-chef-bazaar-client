import React from "react";
import { motion as Motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Container from "../../../components/Shared/Container";

const Footer = () => {
    const footerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <Motion.footer
            variants={footerVariants}
            initial="hidden"
            animate="visible"
            className="bg-gray-900 text-white mt-10"
        >
            <Container>
                <div className=" w-full h-full px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-6">

                    {/* Brand Logo */}
                    <Motion.div variants={itemVariants} className="flex flex-col items-start md:col-span-1">
                        <img
                            src="https://i.ibb.co/WNVv4py3/Loc-Chef.png"
                            alt="LocalChefBazaar Logo"
                            className="w-32 mb-4"
                        />
                        <p className="text-gray-300 max-w-xs">
                            LocChef is your gateway to delicious homemade meals from local chefs. Fresh, healthy, and made with love.
                        </p>
                    </Motion.div>

                    {/* Contact Details */}
                    <Motion.div variants={itemVariants}>
                        <h3 className="text-lg font-bold mb-4" style={{ color: "#ffde59" }}>
                            Contact Us
                        </h3>
                        <p>Email: support@localchefbazaar.com</p>
                        <p>Phone: +123 456 7890</p>
                        <p>Address: 123 Chef Street, Food City</p>
                    </Motion.div>

                    {/* Social Media Links */}
                    <Motion.div variants={itemVariants}>
                        <h3 className="text-lg font-bold mb-4" style={{ color: "#ffde59" }}>
                            Follow Us
                        </h3>
                        <div className="flex gap-4">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">
                                <FaFacebookF />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">
                                <FaTwitter />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">
                                <FaInstagram />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition">
                                <FaLinkedinIn />
                            </a>
                        </div>
                    </Motion.div>

                    {/* Working Hours */}
                    <Motion.div variants={itemVariants}>
                        <h3 className="text-lg font-bold mb-4" style={{ color: "#ffde59" }}>
                            Working Hours
                        </h3>
                        <p>Mon - Fri: 9:00 AM - 8:00 PM</p>
                        <p>Sat: 10:00 AM - 6:00 PM</p>
                        <p>Sun: Closed</p>
                    </Motion.div>
                </div>

                <div className="border-t border-gray-800 mt-6 py-4 text-center text-gray-400">
                    © {new Date().getFullYear()} LocChef. Made with ❤️ by Shorabul Hoque.
                </div>
            </Container>
        </Motion.footer>
    );
};

export default Footer;
