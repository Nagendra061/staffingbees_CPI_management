/**
 * Select Component
 *
 * Form select dropdown for statuses, priorities, categories, and filters.
 *
 * Used By:
 * Application tracking, goal prioritization, filter toolbars.
 */
import React from 'react';

export default function Select({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  helperText,
  disabled = false,
  className = '',
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
      <select
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full rounded-lg border bg-white dark:bg-neutral-900 px-3.5 py-2 text-sm text-neutral-900 dark:text-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#EAB308] focus:border-[#EAB308] disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:cursor-not-allowed ${
          error
            ? 'border-rose-500 focus:ring-rose-500'
            : 'border-neutral-300 dark:border-neutral-700'
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
