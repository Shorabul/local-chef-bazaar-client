import { useEffect, useRef, useState } from "react";
import { IoSunnySharp, IoMoonSharp } from "react-icons/io5";
import { IoMdDesktop } from "react-icons/io";
import { motion as Motion, AnimatePresence } from "framer-motion";

const THEME_KEY = "theme";

export default function ThemeToggle() {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState(localStorage.getItem(THEME_KEY) ?? "system");
    const ref = useRef(null);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");

        const apply = (currentMode) => {
            if (currentMode === "system") {
                localStorage.removeItem(THEME_KEY);
                document.documentElement.classList.toggle("dark", mq.matches);
            } else {
                localStorage.setItem(THEME_KEY, currentMode);
                document.documentElement.classList.toggle("dark", currentMode === "dark");
            }
        };

        apply(mode);

        const onChange = (e) => {
            if (!localStorage.getItem(THEME_KEY)) {
                document.documentElement.classList.toggle("dark", e.matches);
            }
        };

        if (mode === "system") {
            mq.addEventListener("change", onChange);
            return () => mq.removeEventListener("change", onChange);
        }
    }, [mode]);

    // Close when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const label =
        mode === "system"
            ? "System"
            : `${mode.charAt(0).toUpperCase()}${mode.slice(1)}`;

    const CurrentIcon =
        mode === "system" ? IoMdDesktop : mode === "light" ? IoSunnySharp : IoMoonSharp;

    return (
        <div ref={ref} className="relative inline-block text-left select-none">
            {/* Button */}
            <button
                className="px-3 py-1.5 flex items-center gap-2 rounded-xl border border-gray-300 dark:border-gray-500 bg-neutral-50 dark:bg-neutral-600 hover:bg-gray-200 dark:hover:bg-neutral-700 backdrop-blur-md shadow-sm hover:shadow transition active:scale-95 cursor-pointer"
                onClick={() => setOpen((o) => !o)}
            >
                <Motion.div
                    key={mode}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                >
                    <CurrentIcon className="text-xl" />
                </Motion.div>

                <span className="text-sm font-medium">{label}</span>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <Motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-44 rounded-xl bg-neutral-50 dark:bg-neutral-600 backdrop-blur-md shadow-xl overflow-hidden"
                    >
                        {/* Option */}
                        <button
                            className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-neutral-700 transition cursor-pointer"
                            onClick={() => {
                                setMode("system");
                                setOpen(false);
                            }}
                        >
                            <IoMdDesktop />
                            <span className="text-sm">System</span>
                        </button>

                        <button
                            className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-neutral-700 transition cursor-pointer"
                            onClick={() => {
                                setMode("light");
                                setOpen(false);
                            }}
                        >
                            <IoSunnySharp />
                            <span className="text-sm">Light</span>
                        </button>

                        <button
                            className="w-full px-4 py-2 flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-neutral-700 transition cursor-pointer"
                            onClick={() => {
                                setMode("dark");
                                setOpen(false);
                            }}
                        >
                            <IoMoonSharp />
                            <span className="text-sm">Dark</span>
                        </button>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
