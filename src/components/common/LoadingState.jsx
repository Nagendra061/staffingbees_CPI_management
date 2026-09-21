/**
 * LoadingState Component
 *
 * Clean skeleton / spinner view for loading states without UI jumping.
 *
 * Used By:
 * Async data fetches across all primary views and dashboards.
 */
import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({
  message = 'Loading Staffing Bees platform data...',
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 ${className}`}
    >
      <Loader2 className="w-8 h-8 text-[#EAB308] animate-spin mb-3" />
      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
        {message}
      </p>
    </div>
  );
}
