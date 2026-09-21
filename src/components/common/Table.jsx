/**
 * Table Component
 *
 * Responsive data table with horizontal scroll container for mobile
 * and consistent column header styling.
 *
 * Used By:
 * Applications tracker, Interview schedule, SMART goals list, CPI dimension tables.
 */
import React from 'react';

export default function Table({
  columns = [],
  data = [],
  keyField = 'id',
  emptyMessage = 'No records available.',
  className = '',
  id,
}) {
  return (
    <div id={id} className={`w-full overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800 ${className}`}>
      <table className="w-full text-left text-sm divide-y divide-neutral-200 dark:divide-neutral-800">
        <thead className="bg-neutral-50 dark:bg-neutral-900 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                scope="col"
                className={`px-4 py-3 whitespace-nowrap ${col.className || ''}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-900">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-neutral-500 dark:text-neutral-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr
                key={row[keyField] || rowIdx}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={col.key || colIdx}
                    className={`px-4 py-3.5 text-neutral-800 dark:text-neutral-200 ${
                      col.className || ''
                    }`}
                  >
                    {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
