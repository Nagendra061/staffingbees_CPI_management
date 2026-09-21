/**
 * Card Component
 *
 * Professional flat container card with subtle border and padding.
 * Avoids heavy shadows, arbitrary gradients, or nested card anti-patterns.
 *
 * Used By:
 * Dashboard widgets, CPI breakdown cards, Expert profiles, and Task cards.
 */
import React from 'react';

export default function Card({
  children,
  className = '',
  title,
  subtitle,
  action,
  id,
  onClick,
}) {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 transition-all ${
        onClick ? 'cursor-pointer hover:border-amber-400' : ''
      } ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="flex items-start justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0 ml-3">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
