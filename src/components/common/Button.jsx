/**
 * Button Component
 *
 * Versatile action button with primary #EAB308 theme, secondary, outline,
 * and danger variants. Supports sizes, disabled states, and icons.
 *
 * Used By:
 * Forms, cards, tables, modals, and header action controls across the application.
 */
import React from 'react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  id,
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#EAB308] focus:ring-offset-1 rounded-lg cursor-pointer select-none whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#EAB308] hover:bg-[#ca9a07] text-neutral-950 font-semibold shadow-sm active:bg-[#a88006]',
    secondary:
      'bg-neutral-800 hover:bg-neutral-700 text-white shadow-sm active:bg-neutral-900',
    outline:
      'border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200',
    ghost:
      'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm active:bg-rose-800',
  };

  return (
    <button
      id={id}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
    </button>
  );
}
