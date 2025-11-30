import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-full mx-4'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="fixed inset-0 bg-navy/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className={`relative w-full ${sizes[size]} bg-white rounded-xl shadow-2xl transform transition-all flex flex-col max-h-[90vh]`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-soft-grey">
                    <h3 className="text-lg font-semibold text-navy">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-text-grey hover:text-navy transition-colors p-1 rounded-lg hover:bg-soft-grey/20"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
