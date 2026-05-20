/**
 * useProfileHeaderProfile
 *
 * Profile header: profile document state, field updates, and edit/avatar/cover modals.
 */
import { useCallback, useState } from 'react';
import dayjs from 'dayjs';
import useStore from 'hostApp/GlobalStore';
import useAxiosInstance from 'hostApp/useAxiosInstance';
import { DEFAULT_PROFILE_IMAGE, PROFILE_PATHS } from '../../../constants/constants';
import {
  emptyProfile,
  type EditModalState,
  type Profile,
  type ProfileEditField,
} from '../../../types/profile.types';

export function useProfileHeaderProfile() {
  const { accessToken } = useStore();
  const axiosInstance = useAxiosInstance();

  const [profile, setProfile] = useState(emptyProfile);
  const [editModal, setEditModal] = useState<EditModalState>({ type: null, isOpen: false });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);

  const mergeProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const hydrateFromProfileApi = useCallback((profileData: Record<string, unknown>) => {
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
  }, []);

  const changeProfileDetails = async (value: string, type: string): Promise<void> => {
    console.log(value, type);
    axiosInstance
      .put(PROFILE_PATHS.field(type), { [type]: value }, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((resp) => {
        console.log(resp?.data?.data);
        const data = resp.data?.data?.response;
        setProfile((prevProfile) => ({ ...prevProfile, [type]: data }));
      })
      .catch((err) => console.log(err?.response?.data));
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
    mergeProfile,
    hydrateFromProfileApi,
    editModal,
    isProfileModalOpen,
    isCoverModalOpen,
    changeProfileDetails,
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
  };
}
