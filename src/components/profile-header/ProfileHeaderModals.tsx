/**
 * ProfileHeaderModals
 *
 * Mounts all modals and toast UI tied to the profile header:
 * EditProfileModal, profile/cover image uploads, and ReportModal.
 * Visibility is controlled by parent state from useProfileHeader.
 *
 * @param editModal - Active edit field and open state
 * @param isProfileModalOpen - Profile picture upload modal visibility
 * @param isCoverModalOpen - Cover image upload modal visibility
 * @param isReportModalOpen - Report profile modal visibility
 * @param onCloseEditModal - Closes EditProfileModal
 * @param onSaveProfileField - Persists username, description, or location
 * @param onCloseProfileModal - Closes profile image upload modal
 * @param onCloseCoverModal - Closes cover image upload modal
 * @param onCloseReportModal - Closes report modal
 * @param onReportSubmit - Submits report payload to the API
 */
import React from 'react';
import { Toaster } from 'authMF/toastFunction';
import EditProfileModal from '../../modals/EditProfileModal';
import ProfileImgUploadModal from '../../modals/ProfileImgUploadModal';
import CoverImgUploadModal from '../../modals/CoverImgUploadModal';
import ReportModal from '../../modals/ReportModal';
import type { EditModalState } from '../../types/profile.types';

type ProfileHeaderModalsProps = {
  editModal: EditModalState;
  isProfileModalOpen: boolean;
  isCoverModalOpen: boolean;
  isReportModalOpen: boolean;
  onCloseEditModal: () => void;
  onSaveProfileField: (value: string, type: string) => Promise<void>;
  onCloseProfileModal: () => void;
  onCloseCoverModal: () => void;
  onCloseReportModal: () => void;
  onReportSubmit: (reportData: {
    issue: string;
    description: string;
    priority: string;
  }) => void;
};

export default function ProfileHeaderModals({
  editModal,
  isProfileModalOpen,
  isCoverModalOpen,
  isReportModalOpen,
  onCloseEditModal,
  onSaveProfileField,
  onCloseProfileModal,
  onCloseCoverModal,
  onCloseReportModal,
  onReportSubmit,
}: ProfileHeaderModalsProps) {
  return (
    <>
      <Toaster />
      {editModal.type && (
        <EditProfileModal
          isOpen={editModal.isOpen}
          onClose={onCloseEditModal}
          type={editModal.type}
          onSave={async (value) => {
            await onSaveProfileField(value, editModal.type!);
          }}
        />
      )}
      {isProfileModalOpen && (
        <ProfileImgUploadModal closeModal={onCloseProfileModal} />
      )}
      {isCoverModalOpen && <CoverImgUploadModal closeModal={onCloseCoverModal} />}
      {isReportModalOpen && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={onCloseReportModal}
          onSubmit={onReportSubmit}
        />
      )}
    </>
  );
}
