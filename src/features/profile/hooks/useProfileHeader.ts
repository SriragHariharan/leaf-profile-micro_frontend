/**
 * useProfileHeader
 *
 * Composes profile document state, friendship actions, and report modal for the profile header.
 * Initial load uses a single effect with Promise.all (profile + relationship) when viewing another user.
 */
import { useEffect } from 'react';
import { useParams } from 'react-router';
import useStore from 'hostApp/GlobalStore';
import useAxiosInstance from 'hostApp/useAxiosInstance';
import { PROFILE_PATHS } from '../../../constants/constants';
import { FRIEND_PATHS, friendUrl } from '../../friends/api/friendApi';
import { DEFAULT_PROFILE_RELATIONSHIP } from './profileHeaderFriendship';
import { useProfileHeaderProfile } from './useProfileHeaderProfile';
import { useProfileHeaderFriendship } from './useProfileHeaderFriendship';
import { useProfileHeaderReport } from './useProfileHeaderReport';

export function useProfileHeader() {
  const { logout } = useStore();
  const axiosInstance = useAxiosInstance();
  const { userID } = useParams();

  const profileHeader = useProfileHeaderProfile();
  const friendship = useProfileHeaderFriendship(userID, profileHeader.mergeProfile);
  const report = useProfileHeaderReport(userID);

  useEffect(() => {
    const profilePath = PROFILE_PATHS.self(userID);

    if (!userID) {
      friendship.resetRelationshipState();
      axiosInstance
        .get(profilePath)
        .then((resp) => profileHeader.hydrateFromProfileApi(resp?.data?.data ?? {}))
        .catch((err) => console.log(err));
      return;
    }

    Promise.all([
      axiosInstance.get(profilePath),
      axiosInstance.get(friendUrl(FRIEND_PATHS.relationship(userID))),
    ])
      .then(([profileResp, relResp]) => {
        profileHeader.hydrateFromProfileApi(profileResp?.data?.data ?? {});
        friendship.hydrateFromRelationshipApi(
          relResp?.data?.data ?? DEFAULT_PROFILE_RELATIONSHIP,
        );
      })
      .catch((err) => console.log(err));
  }, [userID]);

  return {
    profile: profileHeader.profile,
    editModal: profileHeader.editModal,
    isProfileModalOpen: profileHeader.isProfileModalOpen,
    isCoverModalOpen: profileHeader.isCoverModalOpen,
    isReportModalOpen: report.isReportModalOpen,
    displayName: profileHeader.displayName,
    displayDescription: profileHeader.displayDescription,
    displayLocation: profileHeader.displayLocation,
    displayJoinDate: profileHeader.displayJoinDate,
    profileImage: profileHeader.profileImage,
    coverStyle: profileHeader.coverStyle,
    openEditModal: profileHeader.openEditModal,
    closeEditModal: profileHeader.closeEditModal,
    openProfileModal: profileHeader.openProfileModal,
    closeProfileModal: profileHeader.closeProfileModal,
    openCoverModal: profileHeader.openCoverModal,
    closeCoverModal: profileHeader.closeCoverModal,
    openReportModal: report.openReportModal,
    closeReportModal: report.closeReportModal,
    changeProfileDetails: profileHeader.changeProfileDetails,
    handleLogout: () => logout(),
    handleSendFriendRequest: friendship.handleSendFriendRequest,
    handleCancelFriendRequest: friendship.handleCancelFriendRequest,
    handleAcceptFriendship: friendship.handleAcceptFriendship,
    handleRejectFriendship: friendship.handleRejectFriendship,
    handleUnfriend: friendship.handleUnfriend,
    handleReportSubmit: report.handleReportSubmit,
  };
}
