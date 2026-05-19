import React, { useState } from 'react';
import '../index.scss';
import MyFriends from '../components/MyFriends';
import FriendRequests from '../components/FriendRequests';
import FriendsSegmentedControl, {
  type FriendsTab,
} from '../components/FriendsSegmentedControl';
import { useFriendsLists } from '../hooks/useFriendsLists';

export default function PeoplePage() {
  const [activeTab, setActiveTab] = useState<FriendsTab>('requests');
  const {
    friendRequests,
    friends,
    requestCount,
    friendsCount,
    loading,
    refetch,
  } = useFriendsLists();

  const handleTabChange = (tab: FriendsTab) => {
    setActiveTab(tab);
    refetch();
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex justify-center">
        <FriendsSegmentedControl
          value={activeTab}
          onChange={handleTabChange}
          requestCount={requestCount}
          friendsCount={friendsCount}
        />
      </div>

      <div className="grid grid-cols-1 gap-0">
        {activeTab === 'requests' && (
          <FriendRequests users={friendRequests} loading={loading} />
        )}
        {activeTab === 'friends' && (
          <MyFriends users={friends} loading={loading} />
        )}
      </div>
    </div>
  );
}
