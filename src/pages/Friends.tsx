import React, { useState } from 'react';
import '../index.scss';
import SearchFriends from '../components/SearchFriends';
import MyFriends from '../components/MyFriends';
import FriendRequests from '../components/FriendRequests';
import { designRecipes } from 'hostApp/designRecipes';


export default function PeoplePage() {

  const [activeTab, setActiveTab] = useState<'friends' | 'all' | 'requests'>('requests');


  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4 text-ds-text-primary">Friends</h1>

      <div className="mb-6">
        <div className={`${designRecipes.panel} flex space-x-4 border-b border-ds-border-subtle bg-ds-surface-card px-3 py-2`}>
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-2 px-1 ${
              activeTab === 'requests'
                ? 'border-b-2 border-ds-brand-500 text-ds-brand-600'
                : 'text-ds-text-muted'
            }`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`pb-2 px-1 ${
              activeTab === 'friends'
                ? 'border-b-2 border-ds-brand-500 text-ds-brand-600'
                : 'text-ds-text-muted'
            }`}
          >
            Friends
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2 px-1 ${
              activeTab === 'all'
                ? 'border-b-2 border-ds-brand-500 text-ds-brand-600'
                : 'text-ds-text-muted'
            }`}
          >
            All People
          </button>
        </div>
      </div>

      <div className="grid gap-0 grid-cols-1">
            { activeTab === 'requests' && <FriendRequests /> }
            { activeTab === 'friends' && <MyFriends /> }
            { activeTab === 'all' && <SearchFriends /> }
      </div>
    </div>
  );
}
