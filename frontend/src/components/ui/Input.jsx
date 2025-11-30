import React from 'react';

const Input = React.forwardRef(({ label, error, className = '', icon: Icon, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-grey mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-blue/20 focus:border-sky-blue focus:bg-white disabled:bg-gray-100 disabled:text-gray-500 transition-all duration-200 ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;