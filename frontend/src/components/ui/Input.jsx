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
        className={`w-full px-4 py-2.5 rounded-lg border border-soft-grey bg-white text-navy placeholder-text-grey/50 focus:outline-none focus:ring-2 focus:ring-sky-blue focus:border-transparent disabled:bg-background disabled:text-text-grey transition-all duration-200 ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
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