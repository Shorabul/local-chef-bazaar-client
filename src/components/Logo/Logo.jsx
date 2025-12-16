import React from 'react';
import { Link } from 'react-router';

const Logo = ({ className }) => {
    return (
        <Link to="/" className="flex items-center gap-2">
            <img
                width="45"
                height="45"
                src="https://i.ibb.co/WNVv4py3/Loc-Chef.png"
                alt="Locchef"
                className="rounded-full shadow-sm"
            />
            <span className={`font-bold text-3xl ${className}`}>
                Locchef
            </span>
        </Link>
    );
};

export default Logo;