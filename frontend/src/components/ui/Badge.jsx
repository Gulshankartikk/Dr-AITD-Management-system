import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: "bg-gray-100 text-text-grey border border-gray-200",
        primary: "bg-sky-blue/10 text-sky-blue border border-sky-blue/20",
        success: "bg-green-50 text-green-600 border border-green-200",
        warning: "bg-amber-50 text-amber-600 border border-amber-200",
        danger: "bg-red-50 text-red-600 border border-red-200",
        info: "bg-blue-50 text-blue-600 border border-blue-200"
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
