import { useCallback, useEffect, useRef, useState } from 'react';
import useAxiosInstance from '../../../axios/axiosInstance';
import { User } from '../../../interfaces/User.interface';
import { FRIEND_PATHS, friendUrl } from '../api/friendApi';

type FriendRequestApiItem = {
  id: string;
  sender?: { id: string; name: string; profilePicture: string };
};

type FriendApiItem = {
  friendId: string;
  friend: { id: string; name: string; profilePicture: string };
};

function mapFriendRequestToUser(item: FriendRequestApiItem): User {
  const sender = item.sender;
  return {
    userID: item.id,
    username: '',
    profilePicture: '',
    description: '',
    isFriend: false,
    friendStatus: '',
    Profile: sender
      ? {
          userID: sender.id,
          username: sender.name,
          profilePicture: sender.profilePicture,
          description: '',
          isFriend: false,
          friendStatus: '',
        }
      : ({} as User),
  };
}

function mapFriendToUser(item: FriendApiItem): User {
  const { friend } = item;
  return {
    userID: item.friendId,
    username: '',
    profilePicture: '',
    description: '',
    isFriend: true,
    friendStatus: 'friends',
    friendProfile: {
      userID: friend.id,
      username: friend.name,
      profilePicture: friend.profilePicture,
      description: '',
      isFriend: true,
      friendStatus: 'friends',
    },
  };
}

export function useFriendsLists() {
  const axiosInstance = useAxiosInstance();
  const axiosRef = useRef(axiosInstance);
  axiosRef.current = axiosInstance;

  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [requestCount, setRequestCount] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const client = axiosRef.current;
      const [requestsResp, friendsResp] = await Promise.all([
        client.get(friendUrl(FRIEND_PATHS.requests)),
        client.get(friendUrl(FRIEND_PATHS.friends)),
      ]);

      const requestsData = requestsResp?.data?.data;
      const friendsData = friendsResp?.data?.data;

      setFriendRequests(
        (requestsData?.friendRequests ?? []).map(mapFriendRequestToUser),
      );
      setFriends((friendsData?.friends ?? []).map(mapFriendToUser));
      setRequestCount(requestsData?.total ?? 0);
      setFriendsCount(friendsData?.total ?? 0);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    friendRequests,
    friends,
    requestCount,
    friendsCount,
    loading,
    error,
    refetch,
  };
}
