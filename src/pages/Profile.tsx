import React, { useState } from 'react';
import { Link } from 'react-router';
import ProfileHeader from '../components/ProfileHeader';
import FeedCard from '../components/FeedCard';
import AddTravelHistoryModal from '../components/AddTravelHistoryModal';
import AddBucketListModal from '../components/AddBucketListModal';
import CreateGalleryModal from '../components/CreateGalleryModal';
import { MapPin, Calendar, Film, Image, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import '../index.scss';

const tabs = [
  { id: 'feed', label: 'Feed', icon: Film },
  { id: 'travel-history', label: 'Travel History', icon: MapPin },
  { id: 'bucket-list', label: 'Bucket List', icon: Calendar },
  { id: 'gallery', label: 'Photo Gallery', icon: Image },
];

const mockFeeds = [
  {
    id: '1',
    username: 'Ricky Ponting',
    userImage: "https://st3.cricketcountry.com/wp-content/uploads/2022/12/ricky-ponting.jpg",
    content: 'Just completed an amazing trek through the Swiss Alps! The views were absolutely breathtaking. Can\'t wait to share more photos from this incredible journey! 🏔️ #SwissAlps #Adventure #Hiking',
    timestamp: '2 hours ago',
    image: 'https://th.bing.com/th/id/OIP.HKTIB3DM46yiY-RGWmu8SQHaLf?rs=1&pid=ImgDetMain'
  },
  {
    id: '3',
    username: 'Ricky Ponting',
    userImage: "https://st3.cricketcountry.com/wp-content/uploads/2022/12/ricky-ponting.jpg",
    content: 'Just completed an amazing trek through the Swiss Alps! The views were absolutely breathtaking. Can\'t wait to share more photos from this incredible journey! 🏔️ #SwissAlps #Adventure #Hiking',
    timestamp: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606'
  },
  
  {
    id: '2',
    username: 'Ricky Ponting',
    userImage: "https://st3.cricketcountry.com/wp-content/uploads/2022/12/ricky-ponting.jpg",
    content: 'Planning my next adventure to Southeast Asia! Any recommendations for must-visit places in Vietnam and Thailand? 🌏 #TravelPlanning #SoutheastAsia',
    timestamp: '1 day ago'
  }
];

const mockTravelHistory = [
  {
    id: '1',
    location: 'Switzerland',
    year: 2024,
    places: ['Zermatt', 'Interlaken', 'Lucerne']
  },
  {
    id: '2',
    location: 'Japan',
    year: 2023,
    places: ['Tokyo', 'Kyoto', 'Osaka']
  }
];

const mockBucketList = [
  {
    id: '1',
    location: 'New Zealand',
    notes: 'Visit Hobbiton, go bungee jumping in Queenstown, and explore Milford Sound.'
  },
  {
    id: '2',
    location: 'Iceland',
    notes: 'See the Northern Lights, visit the Blue Lagoon, and explore ice caves.'
  }
];

const mockGalleries = [
  {
    id: '1',
    name: 'Swiss Alps 2024',
    description: 'A collection of memories from our Swiss adventure',
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
  },
  {
    id: '2',
    name: 'Japan Highlights',
    description: 'Cherry blossoms and city lights',
    coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80'
  }
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState('feed');
  const [showTravelModal, setShowTravelModal] = useState(false);
  const [showBucketModal, setShowBucketModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-4 px-4 md:px-0">
      <ProfileHeader />
      
      <div className="bg-white rounded-lg shadow-sm p-1">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-green-50 text-green-600'
                  : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
              )}
            >
              {tab.icon && <tab.icon className="h-4 w-4" />}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        {activeTab === 'feed' && mockFeeds.map(feed => (
          <FeedCard key={feed.id} {...feed} />
        ))}

        {activeTab === 'travel-history' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Travel History</h2>
              <button
                onClick={() => setShowTravelModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
                Add Trip
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockTravelHistory.map((trip) => (
                <div key={trip.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{trip.location}</h3>
                    <span className="text-sm text-gray-500">{trip.year}</span>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-700">Places visited:</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {trip.places.map((place, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                        >
                          {place}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bucket-list' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Bucket List</h2>
              <button
                onClick={() => setShowBucketModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
                Add Destination
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockBucketList.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold">{item.location}</h3>
                  <p className="mt-2 text-gray-600">{item.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Photo Gallery</h2>
              <button
                onClick={() => setShowGalleryModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
                Create Gallery
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockGalleries.map((gallery) => (
                <Link
                  key={gallery.id}
                  to={`/gallery/${gallery.id}`}
                  className="group relative aspect-video rounded-lg overflow-hidden"
                >
                  <img
                    src={gallery.coverImage}
                    alt={gallery.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-4 text-white">
                    <h3 className="text-lg font-semibold">{gallery.name}</h3>
                    <p className="text-sm text-white/80">{gallery.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <AddTravelHistoryModal
        isOpen={showTravelModal}
        onClose={() => setShowTravelModal(false)}
        onSave={(data) => {
          console.log('New travel history:', data);
          setShowTravelModal(false);
        }}
      />

      <AddBucketListModal
        isOpen={showBucketModal}
        onClose={() => setShowBucketModal(false)}
        onSave={(data) => {
          console.log('New bucket list item:', data);
          setShowBucketModal(false);
        }}
      />

      <CreateGalleryModal
        isOpen={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
        onSave={(data) => {
          console.log('New gallery:', data);
          setShowGalleryModal(false);
        }}
      />
    </div>
  );
}