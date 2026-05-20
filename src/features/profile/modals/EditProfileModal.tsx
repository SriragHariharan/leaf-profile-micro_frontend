import React, { useState } from 'react';
import { X, MapPin, Sparkles } from 'lucide-react';
import { designRecipes } from 'hostApp/designRecipes';

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
    <div className={designRecipes.modalOverlay}>
      <div className={designRecipes.modalContainer}>
        <div className={designRecipes.modalHeader}>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-ds-brand-50 p-2 text-ds-brand-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-ds-text-primary">{titles[type]}</h2>
          </div>
          <button onClick={onClose} className={designRecipes.iconButton}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {type === 'location' ? (
            <div className="flex items-center gap-2 rounded-xl border border-ds-border-subtle bg-ds-surface-muted/70 p-3 focus-within:border-ds-brand-500 focus-within:bg-ds-surface-card focus-within:ring-2 focus-within:ring-ds-brand-500/20">
              <MapPin className="h-5 w-5 text-ds-text-muted" />
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter your location"
                className="flex-1 bg-transparent text-sm text-ds-text-primary outline-none placeholder:text-ds-text-muted"
              />
            </div>
          ) : (
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === 'description' ? "Write something about yourself..." : "Enter your username"}
              rows={type === 'description' ? 4 : 1}
              className={`${designRecipes.inputBase} resize-none`}
            />
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              onClick={onClose}
              className={designRecipes.buttonSecondary}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSave(value);
                onClose();
              }}
              className={`${designRecipes.buttonPrimary} px-4`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}