/**
 * useProfileHeaderFriendship
 *
 * Profile header: friendship / friend-request API and local request id.
 */
import { useCallback, useState } from 'react';
import useAxiosInstance from 'hostApp/useAxiosInstance';
import { showSuccessToast, showErrorToast } from 'hostApp/toast';
import type { Profile } from '../../../types/profile.types';
import { FRIEND_PATHS, friendUrl } from '../../friends/api/friendApi';
import {
  mapApiFriendStatus,
  type ProfileRelationshipApi,
} from './profileHeaderFriendship';

export function useProfileHeaderFriendship(
  userID: string | undefined,
  mergeProfile: (patch: Partial<Profile>) => void,
) {
  const axiosInstance = useAxiosInstance();
  const [friendRequestId, setFriendRequestId] = useState<string | null>(null);

  const resetRelationshipState = useCallback(() => {
    setFriendRequestId(null);
    mergeProfile({ isFriend: false, friendStatus: '' });
  }, [mergeProfile]);

  const hydrateFromRelationshipApi = useCallback(
    (rel: ProfileRelationshipApi) => {
      setFriendRequestId(rel.friendRequestId ?? null);
      mergeProfile({
        isFriend: rel.isFriend,
        friendStatus: mapApiFriendStatus(rel.friendStatus),
      });
    },
    [mergeProfile],
  );

  const handleSendFriendRequest = useCallback(() => {
    if (!userID) return;
    axiosInstance
      .post(friendUrl(FRIEND_PATHS.sendRequest(userID)))
      .then((resp) => {
        showSuccessToast(resp?.data?.message ?? 'Friend request sent');
        setFriendRequestId(resp?.data?.data?.id ?? null);
        mergeProfile({ isFriend: false, friendStatus: 'pending_sent' });
      })
      .catch((err) =>
        showErrorToast(err?.response?.data?.error?.message ?? 'Unable to send request'),
      );
  }, [userID, axiosInstance, mergeProfile]);

  const handleCancelFriendRequest = useCallback(() => {
    if (!friendRequestId) {
      showErrorToast('Friend request not found');
      return;
    }
    axiosInstance
      .patch(friendUrl(FRIEND_PATHS.patchRequest(friendRequestId)), { status: 'cancel' })
      .then(() => {
        showSuccessToast('Friend request cancelled');
        mergeProfile({ isFriend: false, friendStatus: '' });
        setFriendRequestId(null);
      })
      .catch((err) =>
        showErrorToast(err?.response?.data?.error?.message ?? 'Unable to cancel request'),
      );
  }, [friendRequestId, axiosInstance, mergeProfile]);

  const handleAcceptFriendship = useCallback(() => {
    if (!friendRequestId) {
      showErrorToast('Friend request not found');
      return;
    }
    axiosInstance
      .patch(friendUrl(FRIEND_PATHS.patchRequest(friendRequestId)), { status: 'accept' })
      .then(() => {
        showSuccessToast('Friend request accepted');
        mergeProfile({ isFriend: true, friendStatus: 'friends' });
        setFriendRequestId(null);
      })
      .catch((err) =>
        showErrorToast(err?.response?.data?.error?.message ?? 'You cannot perform this action'),
      );
  }, [friendRequestId, axiosInstance, mergeProfile]);

  const handleRejectFriendship = useCallback(() => {
    if (!friendRequestId) {
      showErrorToast('Friend request not found');
      return;
    }
    axiosInstance
      .patch(friendUrl(FRIEND_PATHS.patchRequest(friendRequestId)), { status: 'reject' })
      .then(() => {
        showSuccessToast('Friend request rejected');
        mergeProfile({ isFriend: false, friendStatus: '' });
        setFriendRequestId(null);
      })
      .catch((err) =>
        showErrorToast(err?.response?.data?.error?.message ?? 'Unable to reject request'),
      );
  }, [friendRequestId, axiosInstance, mergeProfile]);

  const handleUnfriend = useCallback(() => {
    if (!userID) return;
    axiosInstance
      .delete(friendUrl(FRIEND_PATHS.unfriend(userID)))
      .then(() => {
        showSuccessToast('Unfriended');
        mergeProfile({ isFriend: false, friendStatus: '' });
        setFriendRequestId(null);
      })
      .catch((err) =>
        showErrorToast(err?.response?.data?.error?.message ?? 'Unable to unfriend'),
      );
  }, [userID, axiosInstance, mergeProfile]);

  return {
    friendRequestId,
    resetRelationshipState,
    hydrateFromRelationshipApi,
    handleSendFriendRequest,
    handleCancelFriendRequest,
    handleAcceptFriendship,
    handleRejectFriendship,
    handleUnfriend,
  };
}
