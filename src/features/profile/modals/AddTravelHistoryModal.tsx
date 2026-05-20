import React, { useState } from 'react';
import { X, Plus, Minus, Sparkles } from 'lucide-react';
import { designRecipes } from 'hostApp/designRecipes';

interface AddTravelHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    destination: string;
    year: number;
    places: string[];
  }) => void;
}

export default function AddTravelHistoryModal({ isOpen, onClose, onSave }: AddTravelHistoryModalProps) {
  const [destination, setDestination] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [places, setPlaces] = useState(['']);

  if (!isOpen) return null;

  const handleAddPlace = () => {
    setPlaces([...places, '']);
  };

  const handleRemovePlace = (index: number) => {
    setPlaces(places.filter((_, i) => i !== index));
  };

  const handlePlaceChange = (index: number, value: string) => {
    const newPlaces = [...places];
    newPlaces[index] = value;
    setPlaces(newPlaces);
  };

  const handleSubmit = () => {
    onSave({
      destination,
      year,
      places: places.filter(place => place.trim() !== '')
    });
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
            <h2 className="text-lg font-semibold text-ds-text-primary">Add Travel History</h2>
          </div>
          <button onClick={onClose} className={designRecipes.iconButton}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ds-text-secondary mb-1">
              Location
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Switzerland"
              className={designRecipes.inputBase}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ds-text-secondary mb-1">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              min="1900"
              max={new Date().getFullYear()}
              className={designRecipes.inputBase}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ds-text-secondary mb-1">
              Places Visited
            </label>
            {places.map((place, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={place}
                  onChange={(e) => handlePlaceChange(index, e.target.value)}
                  placeholder="e.g., Zermatt"
                  className={`${designRecipes.inputBase} flex-1`}
                />
                {places.length > 1 && (
                  <button
                    onClick={() => handleRemovePlace(index)}
                    className="rounded-xl p-2 text-ds-state-danger hover:bg-ds-state-dangerSoft"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddPlace}
              className="inline-flex items-center gap-2 rounded-xl border border-ds-brand-100 bg-ds-brand-50 px-4 py-2 text-sm font-medium text-ds-brand-700 hover:bg-ds-brand-100"
            >
              <Plus className="h-4 w-4" />
              Add Place
            </button>
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
            disabled={!destination.trim() || places.every(place => !place.trim())}
            className={`${designRecipes.buttonPrimary} disabled:cursor-not-allowed`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}