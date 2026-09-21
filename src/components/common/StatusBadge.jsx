/**
 * StatusBadge Component
 *
 * Visual status chip with semantic colors and pill styling.
 * Supports status values across applications, interviews, goals, and experts.
 *
 * Used By:
 * Application lists, interview rounds, expert cards, and progress cards.
 */
import React from 'react';

export default function StatusBadge({ status, variant, className = '' }) {
  const getVariant = (val) => {
    if (variant) return variant;
    const lower = (val || '').toLowerCase();

    // Success / Completed / Aligned / Offer
    if (
      lower.includes('complete') ||
      lower.includes('aligned') ||
      lower.includes('offer') ||
      lower.includes('eligible') ||
      lower.includes('ready') ||
      lower.includes('met')
    ) {
      return 'success';
    }

    // In Progress / Active / Screening / Interview / Pending
    if (
      lower.includes('in progress') ||
      lower.includes('active') ||
      lower.includes('screening') ||
      lower.includes('interview') ||
      lower.includes('pending')
    ) {
      return 'warning';
    }

    // High Priority / Rejected / Overdue / Declined
    if (
      lower.includes('rejected') ||
      lower.includes('overdue') ||
      lower.includes('declined') ||
      lower.includes('high')
    ) {
      return 'danger';
    }

    // Info / Applied / Recommended
    if (
      lower.includes('applied') ||
      lower.includes('recommended') ||
      lower.includes('scheduled')
    ) {
      return 'info';
    }

    // Neutral / Not Started / Saved / Withdrawn
    return 'neutral';
  };

  const styleMap = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700',
    danger: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    info: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
    neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
  };

  const currentVariant = getVariant(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${
        styleMap[currentVariant] || styleMap.neutral
      } ${className}`}
    >
      {status || 'Unknown'}
    </span>
  );
}
