import { useCallback, useEffect, useRef, useState } from 'react';
import useAxiosInstance from '../axios/axiosInstance';
import { User } from '../interfaces/User.interface';

export function useFriendsLists() {
  const axiosInstance = useAxiosInstance();
  const axiosRef = useRef(axiosInstance);
  axiosRef.current = axiosInstance;

  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const client = axiosRef.current;
      const [requestsResp, friendsResp] = await Promise.all([
        client.get('/friend/request'),
        client.get('friend/friends?page=1'),
      ]);
      setFriendRequests(requestsResp?.data?.data?.friendRequests ?? []);
      setFriends(friendsResp?.data?.data?.friends ?? []);
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
    requestCount: friendRequests.length,
    friendsCount: friends.length,
    loading,
    error,
    refetch,
  };
}
