import React, { useState } from 'react';
import ProfileHeader from '../features/profile/components/ProfileHeader';
import { MapPin, Calendar, Film } from 'lucide-react';
import '../index.scss';
import TravelHistoryCard from '../features/profile/components/TravelHistoryCard';
import BucketListCard from '../features/profile/components/BucketListCard';
import { useParams } from 'react-router';
import ProfileFeed from '../features/feed/components/ProfileFeed';
import { designRecipes } from "@srirag/leaf-design-system"

const tabs = [
  { id: 'feed', label: 'Feed', icon: Film },
  { id: 'travel-history', label: 'Travel History', icon: MapPin },
  { id: 'bucket-list', label: 'Bucket List', icon: Calendar },
];

export default function Profile({ self }: { self: boolean }) {
  const [activeTab, setActiveTab] = useState('feed');
  const { userID } = useParams();

  return (
    <div className={designRecipes.pageContainer}>
      <ProfileHeader self={self} />

      <div className={`${designRecipes.panel} p-1`}>
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id
                  ? designRecipes.tabButtonActive
                  : designRecipes.tabButton
              }
            >
              {tab.icon && <tab.icon className="h-4 w-4" />}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === 'feed' && <ProfileFeed userID={userID} self={self} />}
        {activeTab === 'travel-history' && <TravelHistoryCard userID={userID} self={self} />}
        {activeTab === 'bucket-list' && <BucketListCard userID={userID} self={self} />}
      </div>
    </div>
  );
}
