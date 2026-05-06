import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-50 p-2 text-green-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Add to Bucket List</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Bali, Indonesia"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What would you like to do there?"
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 p-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!destination.trim()}
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}