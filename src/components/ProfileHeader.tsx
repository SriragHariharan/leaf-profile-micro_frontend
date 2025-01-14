import React, { useState } from 'react';
import { Edit, MapPin, Calendar, UserPlus } from 'lucide-react';
import EditProfileModal from './EditProfileModal';
import ImageUploadModal from './ImageUploadModal';

export default function ProfileHeader() {
  const [editModal, setEditModal] = useState<{
    type: 'username' | 'description' | 'location' | null;
    isOpen: boolean;
  }>({ type: null, isOpen: false });
  
  const [imageModal, setImageModal] = useState<{
    type: 'profile' | 'cover' | null;
    isOpen: boolean;
  }>({ type: null, isOpen: false });

  const [profile, setProfile] = useState({
    username: 'Ricky Ponting',
    description: 'Adventure seeker | Nature lover | Professional cricketer | IPL coach',
    location: 'Melbourne, Australia'
  });

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="relative">
        <div 
          className="h-32 sm:h-48 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80')`
          }}
        />
        <button 
          onClick={() => setImageModal({ type: 'cover', isOpen: true })}
          className="absolute right-4 top-4 bg-white/80 p-2 rounded-full hover:bg-white"
        >
          <Edit className="h-4 w-4 text-gray-700" />
        </button>
      </div>
      
      <div className="px-4 sm:px-6 pb-6">
        <div className="flex justify-between items-end -mt-12 sm:-mt-16">
          <div className="relative">
            <img
              src="https://st3.cricketcountry.com/wp-content/uploads/2022/12/ricky-ponting.jpg"
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white"
            />
            <button 
              onClick={() => setImageModal({ type: 'profile', isOpen: true })}
              className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-sm hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 text-gray-700" />
            </button>
          </div>
          
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Friend</span>
          </button>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{profile.username}</h1>
            <button 
              onClick={() => setEditModal({ type: 'username', isOpen: true })}
              className="p-2 text-gray-600 hover:text-green-600"
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>
          
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm sm:text-base text-gray-600 flex-1 pr-4">{profile.description}</p>
            <button 
              onClick={() => setEditModal({ type: 'description', isOpen: true })}
              className="p-2 text-gray-600 hover:text-green-600"
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{profile.location}</span>
              <button 
                onClick={() => setEditModal({ type: 'location', isOpen: true })}
                className="p-1 text-gray-600 hover:text-green-600"
              >
                <Edit className="h-3 w-3" />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Joined March 2024</span>
            </div>
          </div>
        </div>
      </div>

      {editModal.type && (
        <EditProfileModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ type: null, isOpen: false })}
          type={editModal.type}
          currentValue={profile[editModal.type]}
          onSave={(value) => {
            setProfile(prev => ({ ...prev, [editModal.type!]: value }));
          }}
        />
      )}

      {imageModal.type && (
        <ImageUploadModal
          isOpen={imageModal.isOpen}
          onClose={() => setImageModal({ type: null, isOpen: false })}
          type={imageModal.type}
          onSave={(imageUrl) => {
            // Handle image update logic here
          }}
        />
      )}
    </div>
  );
}