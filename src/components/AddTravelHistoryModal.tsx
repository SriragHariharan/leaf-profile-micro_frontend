import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

interface AddTravelHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    location: string;
    year: number;
    places: string[];
  }) => void;
}

export default function AddTravelHistoryModal({ isOpen, onClose, onSave }: AddTravelHistoryModalProps) {
  const [location, setLocation] = useState('');
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
      location,
      year,
      places: places.filter(place => place.trim() !== '')
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Add Travel History</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Switzerland"
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                  className="flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {places.length > 1 && (
                  <button
                    onClick={() => handleRemovePlace(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddPlace}
              className="flex items-center gap-2 text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg"
            >
              <Plus className="h-4 w-4" />
              Add Place
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!location || places.every(place => !place.trim())}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}