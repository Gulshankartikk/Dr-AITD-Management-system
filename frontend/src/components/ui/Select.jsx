import React from 'react';

const Select = React.forwardRef(({ label, error, options = [], children, className = '', ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-text-grey mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    ref={ref}
                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-navy focus:outline-none focus:ring-2 focus:ring-sky-blue/20 focus:border-sky-blue focus:bg-white disabled:bg-gray-100 disabled:text-gray-500 appearance-none transition-all duration-200 ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''} ${className}`}
                    {...props}
                >
                    {children || options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                </div>
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
