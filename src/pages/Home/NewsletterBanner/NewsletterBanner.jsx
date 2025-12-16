// NewsletterBanner.jsx
import React from "react";
import { motion as Motion } from "framer-motion";
import { Mail } from "lucide-react";
import Container from "../../../components/Shared/Container";

export default function NewsletterBanner() {
    return (
        <Motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#ffde59] overflow-hidden"
        >
            <Container>
                <div className="py-10 flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Left side: Icon + Text */}
                    <div className="flex items-center gap-4">
                        {/* Lucide Mail Icon */}
                        <Mail className="h-10 w-10 text-black" />

                        {/* Text */}
                        <div>
                            <h2 className="text-xl font-bold text-black">
                                Get the latest news and offers
                            </h2>
                            <p className="text-black">Subscribe to our newsletter</p>
                        </div>
                    </div>

                    {/* Right side: Input + Button */}
                    <form className="flex w-full md:w-auto gap-2">
                        <input
                            type="email"
                            placeholder="Your email"
                            className="flex-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-neutral-50 text-neutral-500"
                            required
                        />
                        <Motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="bg-black text-white px-3 py-2 rounded-lg transition"
                        >
                            Subscribe
                        </Motion.button>
                    </form>
                </div>
            </Container>
        </Motion.div>
    );
}
