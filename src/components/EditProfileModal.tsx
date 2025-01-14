import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'username' | 'description' | 'location';
  currentValue: string;
  onSave: (value: string) => void;
}

export default function EditProfileModal({ 
  isOpen, 
  onClose, 
  type, 
  currentValue,
  onSave 
}: EditProfileModalProps) {
  const [value, setValue] = useState(currentValue);

  if (!isOpen) return null;

  const titles = {
    username: 'Edit Username',
    description: 'Edit Bio',
    location: 'Edit Location'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{titles[type]}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        {type === 'location' ? (
          <div className="flex items-center gap-2 border rounded-lg p-3 mb-4">
            <MapPin className="h-5 w-5 text-gray-500" />
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter your location"
              className="flex-1 outline-none"
            />
          </div>
        ) : (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={type === 'description' ? "Write something about yourself..." : "Enter your username"}
            rows={type === 'description' ? 4 : 1}
            className="w-full border rounded-lg p-3 mb-4 resize-none"
          />
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(value);
              onClose();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}