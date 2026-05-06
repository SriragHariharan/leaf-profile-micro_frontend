import React from 'react';
import { useParams } from 'react-router';
import { Plus } from 'lucide-react';
import '../index.scss';
import { designRecipes } from 'hostApp/designRecipes';

const mockPhotos = [
  'https://images.unsplash.com/photo-1527254432336-ea5d55ebf3c0',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606',
];

export default function Gallery() {
  const { id } = useParams();
  console.log("gallery id",id)

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ds-text-primary">Swiss Alps 2024</h1>
          <p className="text-ds-text-secondary">A collection of memories from our Swiss adventure</p>
        </div>
        <button className={`${designRecipes.buttonPrimary} flex items-center gap-2 px-4`}>
          <Plus className="h-4 w-4" />
          Add Photos
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {mockPhotos.map((photo, index) => (
          <div
            key={index}
            className="aspect-square rounded-lg overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
          >
            <img
              src={`${photo}?auto=format&fit=crop&q=80`}
              alt={`Gallery photo ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}