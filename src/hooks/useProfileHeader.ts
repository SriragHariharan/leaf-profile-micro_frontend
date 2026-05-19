/**
 * useProfileHeader
 *
 * Encapsulates all state, API calls, and handlers for the profile header:
 * - Fetches profile data for the current route user (or "self")
 * - Manages edit, image upload, and report modal visibility
 * - Exposes friend-request actions and profile field updates
 *
 * Consumed by ProfileHeader; presentational children receive derived values
 * and callbacks from the hook return value.
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import dayjs from 'dayjs';
import useStore from 'hostApp/GlobalStore';
import useAxiosInstance from '../axios/axiosInstance';
import { showSuccessToast, showErrorToast } from 'authMF/toastFunction';
import { DEFAULT_PROFILE_IMAGE, LEAF_FRIEND_BASE_URL } from '../constants/constants';
import {
  emptyProfile,
  type EditModalState,
  type FriendStatus,
  type ProfileEditField,
} from '../types/profile.types';

type ApiFriendStatus = 'none' | 'friends' | 'pending_sent' | 'pending_received';

function mapApiFriendStatus(status: ApiFriendStatus): FriendStatus {
  if (status === 'friends') return 'friends';
  if (status === 'pending_sent') return 'pending_sent';
  if (status === 'pending_received') return 'pending_received';
  return '';
}

export function useProfileHeader() {
  const { logout, accessToken } = useStore();
  const axiosInstance = useAxiosInstance();
  const { userID } = useParams();

  const [editModal, setEditModal] = useState<EditModalState>({ type: null, isOpen: false });
  const [friendRequestId, setFriendRequestId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [profile, setProfile] = useState(emptyProfile);

  const friendUrl = (path: string) => `${LEAF_FRIEND_BASE_URL}${path}`;

  useEffect(() => {
    const profilePath = '/profile/' + (userID ? userID : 'self');

    const applyProfileData = (profileData: Record<string, unknown>) => {
      setProfile((prev) => ({
        ...prev,
        username: (profileData.username as string) || null,
        description: (profileData.description as string) || 'description not added yet',
        location: (profileData.location as string) || 'location not added',
        profilePicture: (profileData.profilePicture as string) || null,
        coverPicture: (profileData.coverPicture as string) || null,
        joinDate: profileData?.createdAt
          ? dayjs(profileData.createdAt as string).format('MMMM YYYY')
          : 'Date not available',
      }));
    };

    const applyRelationship = (rel: {
      isFriend: boolean;
      friendRequestId: string | null;
      friendStatus: ApiFriendStatus;
    }) => {
      setFriendRequestId(rel.friendRequestId ?? null);
      setProfile((prev) => ({
        ...prev,
        isFriend: rel.isFriend,
        friendStatus: mapApiFriendStatus(rel.friendStatus),
      }));
    };

    if (!userID) {
      setFriendRequestId(null);
      setProfile((prev) => ({ ...prev, isFriend: false, friendStatus: '' }));
      axiosInstance
        .get(profilePath)
        .then((resp) => applyProfileData(resp?.data?.data ?? {}))
        .catch((err) => console.log(err));
      return;
    }

    Promise.all([
      axiosInstance.get(profilePath),
      axiosInstance.get(friendUrl(`/friend-requests/relationship/${userID}`)),
    ])
      .then(([profileResp, relResp]) => {
        applyProfileData(profileResp?.data?.data ?? {});
        applyRelationship(relResp?.data?.data ?? { isFriend: false, friendRequestId: null, friendStatus: 'none' });
      })
      .catch((err) => console.log(err));
  }, [userID]);

  const changeProfileDetails = async (value: string, type: string): Promise<void> => {
    console.log(value, type);
    axiosInstance
      .put(`/profile/${type}`, { [type]: value }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((resp) => {
        console.log(resp?.data?.data);
        const data = resp.data?.data?.response;
        setProfile((prevProfile) => ({ ...prevProfile, [type]: data }));
      })
      .catch((err) => console.log(err?.response?.data));
  };

  const handleSendFriendRequest = () => {
    if (!userID) return;
    axiosInstance
      .post(friendUrl(`/friend-requests/${userID}`))
      .then((resp) => {
        showSuccessToast(resp?.data?.message ?? 'Friend request sent');
        setFriendRequestId(resp?.data?.data?.id ?? null);
        setProfile((p) => ({ ...p, isFriend: false, friendStatus: 'pending_sent' }));
      })
      .catch((err) =>
        showErrorToast(err?.response?.data?.error?.message ?? 'Unable to send request'),
      );
  };

  const handleCancelFriendRequest = () => {
    if (!friendRequestId) {
      showErrorToast('Friend request not found');
      return;
    }
    axiosInstance
      .patch(friendUrl(`/friend-requests/${friendRequestId}`), { status: 'cancel' })
      .then(() => {
        showSuccessToast('Friend request cancelled');
        setProfile((p) => ({ ...p, isFriend: false, friendStatus: '' }));
        setFriendRequestId(null);
      })
      .catch((err) =>
        showErrorToast(err?.response?.data?.error?.message ?? 'Unable to cancel request'),
      );
  };

  const handleAcceptFriendship = () => {
    if (!friendRequestId) {
      showErrorToast('Friend request not found');
      return;
    }
    axiosInstance
      .patch(friendUrl(`/friend-requests/${friendRequestId}`), { status: 'accept' })
      .then(() => {
        showSuccessToast('Friend request accepted');
        setProfile((p) => ({ ...p, isFriend: true, friendStatus: 'friends' }));
        setFriendRequestId(null);
      })
      .catch((err) =>
        showErrorToast(err?.response?.data?.error?.message ?? 'You cannot perform this action'),
      );
  };

  const handleRejectFriendship = () => {
    if (!friendRequestId) {
      showErrorToast('Friend request not found');
      return;
    }
    axiosInstance
      .patch(friendUrl(`/friend-requests/${friendRequestId}`), { status: 'reject' })
      .then(() => {
        showSuccessToast('Friend request rejected');
        setProfile((p) => ({ ...p, isFriend: false, friendStatus: '' }));
        setFriendRequestId(null);
      })
      .catch((err) =>
        showErrorToast(err?.response?.data?.error?.message ?? 'Unable to reject request'),
      );
  };

  const handleUnfriend = () => {
    if (!userID) return;
    axiosInstance
      .delete(friendUrl(`/friends/${userID}`))
      .then(() => {
        showSuccessToast('Unfriended');
        setProfile((p) => ({ ...p, isFriend: false, friendStatus: '' }));
        setFriendRequestId(null);
      })
      .catch((err) =>
        showErrorToast(err?.response?.data?.error?.message ?? 'Unable to unfriend'),
      );
  };

  const handleReportSubmit = (reportData: {
    issue: string;
    description: string;
    priority: string;
  }) => {
    axiosInstance
      .post('/profile/report/' + userID, { ...reportData })
      .then((resp) => {
        setIsReportModalOpen(false);
        showSuccessToast(resp?.data?.message);
      })
      .catch(() => showErrorToast('Unable to report profile'));
  };

  const openEditModal = (type: ProfileEditField) => setEditModal({ type, isOpen: true });
  const closeEditModal = () => setEditModal({ type: null, isOpen: false });

  const coverStyle = profile.coverPicture
    ? { backgroundImage: `url(${profile.coverPicture})` }
    : {
        backgroundImage:
          'linear-gradient(120deg, var(--ds-color-text-primary) 0%, var(--ds-color-text-secondary) 35%, var(--ds-color-brand-700) 100%)',
      };

  return {
    profile,
    editModal,
    isProfileModalOpen,
    isCoverModalOpen,
    isReportModalOpen,
    displayName: profile.username || 'User',
    displayDescription: profile.description || 'No bio added yet.',
    displayLocation: profile.location || 'Location not added',
    displayJoinDate: profile.joinDate || 'Date not available',
    profileImage: profile.profilePicture || DEFAULT_PROFILE_IMAGE || '',
    coverStyle,
    openEditModal,
    closeEditModal,
    openProfileModal: () => setIsProfileModalOpen(true),
    closeProfileModal: () => setIsProfileModalOpen(false),
    openCoverModal: () => setIsCoverModalOpen(true),
    closeCoverModal: () => setIsCoverModalOpen(false),
    openReportModal: () => setIsReportModalOpen(true),
    closeReportModal: () => setIsReportModalOpen(false),
    changeProfileDetails,
    handleLogout: () => logout(),
    handleSendFriendRequest,
    handleCancelFriendRequest,
    handleAcceptFriendship,
    handleRejectFriendship,
    handleUnfriend,
    handleReportSubmit,
  };
}
