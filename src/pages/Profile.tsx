import React, { useState } from 'react';
import ProfileHeader from '../components/ProfileHeader';
import FeedCard from '../components/FeedCard';
import { MapPin, Calendar, Film } from 'lucide-react';
import { clsx } from 'clsx';
import '../index.scss';
import TravelHistoryCard from '../components/TravelHistoryCard';
import BucketListCard from '../components/BucketListCard';
import { useParams } from 'react-router';
import ProfileFeed from '../components/ProfileFeed';

const tabs = [
  { id: 'feed', label: 'Feed', icon: Film },
  { id: 'travel-history', label: 'Travel History', icon: MapPin },
  { id: 'bucket-list', label: 'Bucket List', icon: Calendar },
];






export default function Profile({self}: {self: boolean}) {

  const [activeTab, setActiveTab] = useState('feed');

  const { userID } = useParams()  ;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-4 px-4 md:px-0">
      <ProfileHeader self={self} />

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
        {activeTab === 'feed' && <ProfileFeed userID={userID} self={self} /> }

        { activeTab === 'travel-history' && <TravelHistoryCard userID={userID} self={self} /> }

        { activeTab === 'bucket-list' && <BucketListCard userID={userID} self={self}  /> }
      </div>

      

      
    </div>
  );
}