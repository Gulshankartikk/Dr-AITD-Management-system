import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: "bg-soft-grey/20 text-text-grey",
        primary: "bg-sky-blue/10 text-sky-blue",
        success: "bg-sky-blue/10 text-sky-blue",
        warning: "bg-navy/10 text-navy",
        danger: "bg-navy/10 text-navy",
        info: "bg-soft-grey/20 text-navy"
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
