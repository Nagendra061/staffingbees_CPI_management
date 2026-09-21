/**
 * Input Component
 *
 * Form input with label, helper/error text, and optional leading/trailing icons.
 *
 * Used By:
 * All form workflows, search bars, and filtering controls.
 */
import React from 'react';

export default function Input({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  disabled = false,
  className = '',
  icon: Icon,
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5"
        >
          {label} {required && <span className="text-amber-600">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full rounded-lg border bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-colors focus:outline-none focus:ring-2 focus:ring-[#EAB308] focus:border-[#EAB308] disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:cursor-not-allowed ${
            Icon ? 'pl-9' : ''
          } ${
            error
              ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
              : 'border-neutral-300 dark:border-neutral-700'
          }`}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
