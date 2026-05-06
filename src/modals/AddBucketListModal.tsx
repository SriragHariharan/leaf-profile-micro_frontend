import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { designRecipes } from 'hostApp/designRecipes';

interface AddBucketListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    destination: string;
    notes: string;
  }) => void;
}

export default function AddBucketListModal({ isOpen, onClose, onSave }: AddBucketListModalProps) {
  const [destination, setDestination] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave({ destination, notes });
    onClose();
  };

  return (
    <div className={designRecipes.modalOverlay}>
      <div className={designRecipes.modalContainer}>
        <div className={designRecipes.modalHeader}>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-ds-brand-50 p-2 text-ds-brand-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-ds-text-primary">Add to Bucket List</h2>
          </div>
          <button onClick={onClose} className={designRecipes.iconButton}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ds-text-secondary mb-1">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Bali, Indonesia"
              className={designRecipes.inputBase}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ds-text-secondary mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What would you like to do there?"
              rows={4}
              className={`${designRecipes.inputBase} resize-none`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-ds-border-subtle p-4">
          <button
            onClick={onClose}
            className={designRecipes.buttonSecondary}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!destination.trim()}
            className={`${designRecipes.buttonPrimary} disabled:cursor-not-allowed`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}