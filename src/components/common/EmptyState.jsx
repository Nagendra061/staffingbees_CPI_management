/**
 * EmptyState Component
 *
 * Reusable empty state view when no records exist.
 * Includes an icon, clear explanation, and primary call-to-action button.
 *
 * Used By:
 * Applications, Interviews, Goals, Plans, and Progress modules.
 */
import React from 'react';
import Button from './Button';
import { FolderOpen } from 'lucide-react';

export default function EmptyState({
  title = 'No items found',
  description = 'Get started by creating your first entry.',
  actionLabel,
  onAction,
  icon: Icon = FolderOpen,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl my-4 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mb-4">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
