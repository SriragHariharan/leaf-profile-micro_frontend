import React, { useState } from 'react';
import '../index.scss';
import SearchFriends from '../components/SearchFriends';
import MyFriends from '../components/MyFriends';
import FriendRequests from '../components/FriendRequests';


export default function PeoplePage() {

  const [activeTab, setActiveTab] = useState<'friends' | 'all' | 'requests'>('requests');


  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Friends</h1>

      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-2 px-1 ${
              activeTab === 'requests'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500'
            }`}
          >
            Requests
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`pb-2 px-1 ${
              activeTab === 'friends'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500'
            }`}
          >
            Friends
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2 px-1 ${
              activeTab === 'all'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500'
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
