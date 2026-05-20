import React, { useState } from 'react';
import { designRecipes } from 'hostApp/designRecipes';
import '../index.scss';
import MyFriends from '../features/friends/components/MyFriends';
import FriendRequests from '../features/friends/components/FriendRequests';
import FriendsSegmentedControl, {
  type FriendsTab,
} from '../features/friends/components/FriendsSegmentedControl';
import { useFriendsLists } from '../features/friends/hooks/useFriendsLists';

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
    <div className={designRecipes.pageContainerWide}>
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
        {activeTab === 'friends' && <MyFriends users={friends} loading={loading} />}
      </div>
    </div>
  );
}
