import React, { useState } from 'react';
import { X, Plus, Minus, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-50 p-2 text-green-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Add Travel History</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Switzerland"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              min="1900"
              max={new Date().getFullYear()}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-2.5 text-sm outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Places Visited
            </label>
            {places.map((place, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={place}
                  onChange={(e) => handlePlaceChange(index, e.target.value)}
                  placeholder="e.g., Zermatt"
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
                />
                {places.length > 1 && (
                  <button
                    onClick={() => handleRemovePlace(index)}
                    className="rounded-xl p-2 text-red-500 hover:bg-red-50"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddPlace}
              className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
            >
              <Plus className="h-4 w-4" />
              Add Place
            </button>
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
            disabled={!destination.trim() || places.every(place => !place.trim())}
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}