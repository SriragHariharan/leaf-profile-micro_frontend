/**
 * ProfileHeader
 *
 * Top-of-profile card: cover banner, avatar, identity meta, bio, and action buttons.
 * Composes presentational subcomponents and delegates state/API logic to useProfileHeader.
 *
 * @param self - true when viewing your own profile; enables edit controls and logout
 */
import React from 'react';
import { designRecipes } from "@srirag/leaf-design-system"
import { useProfileHeader } from '../hooks/useProfileHeader';
import ProfileCoverBanner from './profile-header/ProfileCoverBanner';
import ProfileIdentitySection from './profile-header/ProfileIdentitySection';
import ProfileBioSection from './profile-header/ProfileBioSection';
import ProfileHeaderActions from './profile-header/ProfileHeaderActions';
import ProfileHeaderModals from './profile-header/ProfileHeaderModals';

export default function ProfileHeader({ self }: { self: boolean }) {
  const h = useProfileHeader();

  return (
    <div className={designRecipes.profileHeaderCard}>
      <ProfileCoverBanner
        coverStyle={h.coverStyle}
        self={self}
        onEditCover={h.openCoverModal}
      />

      <div className="relative z-10 px-4 pb-6 sm:px-6 lg:px-8">
        <div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <ProfileIdentitySection
              self={self}
              profileImage={h.profileImage}
              displayName={h.displayName}
              displayLocation={h.displayLocation}
              displayJoinDate={h.displayJoinDate}
              onEditAvatar={h.openProfileModal}
              onEditUsername={() => h.openEditModal('username')}
              onEditLocation={() => h.openEditModal('location')}
            />

            <ProfileHeaderActions
              self={self}
              profile={h.profile}
              onLogout={h.handleLogout}
              onSendFriendRequest={h.handleSendFriendRequest}
              onCancelFriendRequest={h.handleCancelFriendRequest}
              onAcceptFriendship={h.handleAcceptFriendship}
              onRejectFriendship={h.handleRejectFriendship}
              onUnfriend={h.handleUnfriend}
              onReport={h.openReportModal}
            />
          </div>

          <ProfileBioSection
            description={h.displayDescription}
            self={self}
            onEditDescription={() => h.openEditModal('description')}
          />
        </div>
      </div>

      <ProfileHeaderModals
        editModal={h.editModal}
        isProfileModalOpen={h.isProfileModalOpen}
        isCoverModalOpen={h.isCoverModalOpen}
        isReportModalOpen={h.isReportModalOpen}
        onCloseEditModal={h.closeEditModal}
        onSaveProfileField={h.changeProfileDetails}
        onCloseProfileModal={h.closeProfileModal}
        onCloseCoverModal={h.closeCoverModal}
        onCloseReportModal={h.closeReportModal}
        onReportSubmit={h.handleReportSubmit}
      />
    </div>
  );
}
