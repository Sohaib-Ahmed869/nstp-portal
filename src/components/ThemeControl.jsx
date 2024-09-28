import React, { useState, useEffect } from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/20/solid';

const ThemeControl = () => {
    // Initialize isDarkMode based on local storage
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const theme = localStorage.getItem("data-theme");
        return theme === "nstpDark";
    });
    const [isSpinning, setIsSpinning] = useState(false);

    const toggleTheme = () => {
        setIsSpinning(true);
        setTimeout(() => {
            setIsDarkMode(!isDarkMode);
            setIsSpinning(false);
        }, 300); // Duration of the spin animation
    };

    useEffect(() => {
        const currentTheme = isDarkMode ? "nstpDark" : "nstp";
        // Set in local storage
        localStorage.setItem("data-theme", currentTheme);

        document.documentElement.setAttribute("data-theme", currentTheme);
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <button
            onClick={toggleTheme}
            className="relative inline-flex items-center rounded-full btn btn-outline btn-primary focus:outline-none transition-colors duration-300"
        >
            <span className="sr-only">Toggle Theme</span>
            <div className="flex items-center justify-center rounded-full transition-transform duration-300 transform">
                {isDarkMode ? (
                    <MoonIcon className={`w-5 h-5 text-white ${isSpinning ? 'animate-spin' : ''}`} />
                ) : (
                    <SunIcon className={`w-5 h-5 text-yellow-300 ${isSpinning ? 'animate-spin' : ''}`} />
                )}
            </div>
        </button>
    );
};

export default ThemeControl;