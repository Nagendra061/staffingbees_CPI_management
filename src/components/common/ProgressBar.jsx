/**
 * ProgressBar Component
 *
 * Visual horizontal progress indicator featuring primary #EAB308 branding.
 * Supports percentages, custom labels, and height configurations.
 *
 * Used By:
 * CPI dimension breakdowns, SMART goal completion, and program eligibility meters.
 */
import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  label,
  valueText,
  showPercentage = true,
  height = 'h-2',
  colorClass = 'bg-[#EAB308]',
  className = '',
}) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage || valueText) && (
        <div className="flex justify-between items-center text-xs mb-1">
          {label && (
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {label}
            </span>
          )}
          <span className="font-semibold text-neutral-900 dark:text-neutral-100 ml-auto">
            {valueText || (showPercentage ? `${percentage}%` : `${value}/${max}`)}
          </span>
        </div>
      )}
      <div className={`w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} ${colorClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
