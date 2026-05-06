import React, { useState } from 'react';
import { X, MapPin, Sparkles } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'username' | 'description' | 'location';
  // currentValue: string;
  onSave: (value: string) => void;
}

export default function EditProfileModal({ 
  isOpen, 
  onClose, 
  type, 
  // currentValue,
  onSave 
}: EditProfileModalProps) {
  const [value, setValue] = useState("");

  if (!isOpen) return null;

  const titles = {
    username: 'Edit Username',
    description: 'Edit Bio',
    location: 'Edit Location'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-50 p-2 text-green-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{titles[type]}</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {type === 'location' ? (
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/70 p-3 focus-within:border-green-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-green-500/20">
              <MapPin className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter your location"
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
              />
            </div>
          ) : (
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'description' ? "Write something about yourself..." : "Enter your username"}
              rows={type === 'description' ? 4 : 1}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/70 p-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
            />
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(value);
                onClose();
              }}
              className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}