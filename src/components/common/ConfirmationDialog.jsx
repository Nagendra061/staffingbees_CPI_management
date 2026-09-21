/**
 * ConfirmationDialog Component
 *
 * Dedicated modal for destructive or irreversible actions (e.g. deleting a goal or application).
 *
 * Used By:
 * CRUD delete workflows for Goals, Applications, Interviews, and Plan Tasks.
 */
import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmLabel = 'Delete',
  confirmVariant = 'danger',
  id,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md" id={id}>
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          {message}
        </p>
      </div>
      <div className="flex justify-end gap-2.5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant={confirmVariant}
          size="sm"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
