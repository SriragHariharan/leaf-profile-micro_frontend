import React, { useEffect, useState } from 'react';
import { Edit, MapPin, Calendar, UserPlus, LogOut, Hourglass, Flag } from 'lucide-react';
import EditProfileModal from '../modals/EditProfileModal';
// import ImageUploadModal from './ImageUploadModal';
import useStore from "hostApp/GlobalStore";
import ProfileImgUploadModal from '../modals/ProfileImgUploadModal';
import CoverImgUploadModal from '../modals/CoverImgUploadModal';
import useAxiosInstance from '../axios/axiosInstance';
import dayjs from 'dayjs';
import { useParams } from 'react-router';

import { showSuccessToast, showErrorToast, Toaster } from 'authMF/toastFunction';


import { DEFAULT_PROFILE_IMAGE } from '../constants/constants';
import ReportModal from '../modals/ReportModal';
import { designRecipes } from 'hostApp/designRecipes';

type Profile = {
  username: string | null;
  description: string | null;
  location: string | null;
  profilePicture: string | null;
  coverPicture: string | null;
  joinDate: string | null;
  isFriend?: boolean;
  friendStatus?: string;
};


export default function ProfileHeader({self}: {self: boolean}) {
  const { logout, accessToken } = useStore();
  
  const [editModal, setEditModal] = useState<{
    type: 'username' | 'description' | 'location' | null;
    isOpen: boolean;
  }>({ type: null, isOpen: false });

  /* store friendship ID to accept/ cancel request */
  const [friendshipID, setFriendshipID] = useState<number | null>(null);
  
  /* profile image upload modal */
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  /* profile image upload modal */
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const openCoverModal = () => setIsCoverModalOpen(true);
  const closeCoverModal = () => setIsCoverModalOpen(false);

  const [profile, setProfile] = useState<Profile>({
    username: null,
    description: null,
    location: null,
    profilePicture: null,
    coverPicture: null,
    joinDate: null,
    isFriend: false,
    friendStatus: ""
  });

  /* logout user */
  const handleLogout = () => logout();

  const axiosInstance = useAxiosInstance();

  const {userID} = useParams();

  /* fetch profile details */ 
  useEffect(() => {
    axiosInstance.get("/profile/" + (userID ? userID : "self"))
    .then((resp) => {
        console.log(resp?.data?.data);
        const profileData = resp?.data?.data;
        setProfile({
            username:         profileData.username || null,
            description:      profileData.description || "description not added yet",
            location:         profileData.location ||"location not added",
            profilePicture:   profileData.profilePicture || null,
            coverPicture:     profileData.coverPicture || null,
            joinDate: profileData?.createdAt
              ? dayjs(profileData.createdAt).format("MMMM YYYY")
              : "Date not available",
            isFriend: profileData.isFriend,
            friendStatus: profileData.friendStatus
        });
        setFriendshipID(Number(resp?.data?.data?.friendshipId));
    })
    .catch((err) => console.log(err));
  }, [userID])

  /* update profile details */
  const changeProfileDetails = async ( value:string, type: string): Promise<void> => {
    console.log(value, type);
    axiosInstance.put(`/profile/${type}`, { [type]: value }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
    .then(resp => {
      console.log(resp?.data?.data)
      const data = resp.data?.data?.response;
      setProfile(prevProfile => ({
          ...prevProfile,
          [type]: data
      }));
    })
    .catch(err => console.log(err?.response?.data));
  }

  /* handle friend request: send friend request */
  const handleSendFriendRequest = () => {
    axiosInstance.post("/friend/request/" + userID )
    .then(_resp => {
      showSuccessToast("Friend request sent")
    })
    .catch(err => showErrorToast(err?.response?.data?.error?.message));
  };

  /* accept friend request */
  const handleAcceptFriendship = () => {
      axiosInstance.put("/friend/request/" + friendshipID)
      .then(_resp => {
        showSuccessToast("Friend request accepted")
        setProfile({...profile, isFriend: true})
      })
      .catch(_err => showErrorToast("You cannot perform this action"));
  }

  /* reject friend request */
  const handleRejectFriendship = () => {
      axiosInstance.delete("/friend/request/" + friendshipID)
      .then(_resp => showSuccessToast("friend request rejected") )
      .catch(_err => showErrorToast("Unable to reject request"));
  }

  /* report modal */
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const openReportModal = () => setIsReportModalOpen(true);
  const closeReportModal = () => setIsReportModalOpen(false);

  const handleReportSubmit = (reportData: {issue: string, description: string, priority: string}) => {
    axiosInstance.post("/profile/report/" + userID, {...reportData })
    .then(resp => {
      closeReportModal();
      showSuccessToast(resp?.data?.message)      ;
    })
    .catch(_err => showErrorToast("Unable to report profile"));
  };

  const displayName = profile.username || "User";
  const displayDescription = profile.description || "No bio added yet.";
  const displayLocation = profile.location || "Location not added";
  const displayJoinDate = profile.joinDate || "Date not available";
  const profileImage = profile.profilePicture || DEFAULT_PROFILE_IMAGE;
  const coverStyle = profile.coverPicture
    ? { backgroundImage: `url(${profile.coverPicture})` }
    : { backgroundImage: "linear-gradient(120deg, var(--ds-color-text-primary) 0%, var(--ds-color-text-secondary) 35%, var(--ds-color-brand-700) 100%)" };

  const renderActionButtons = () => {
    if (self) {
      return (
        <button
          onClick={handleLogout}
          className={`${designRecipes.buttonSecondary} inline-flex items-center gap-2 border-ds-state-danger/30 bg-ds-state-dangerSoft text-ds-state-danger hover:bg-ds-state-dangerSoft`}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      );
    }

    if (profile.isFriend) {
      return (
        <div className={designRecipes.statusSuccess}>
          Friends
        </div>
      );
    }

    if (profile?.friendStatus === 'pending') {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={handleRejectFriendship}
            className={`${designRecipes.statusWarning} hover:bg-ds-state-warningSoft`}
          >
            <Hourglass className="h-4 w-4" />
            Reject
          </button>
          <button
            onClick={handleAcceptFriendship}
            className={`${designRecipes.buttonPrimary} inline-flex items-center gap-2 px-4`}
          >
            <Hourglass className="h-4 w-4" />
            Accept
          </button>
        </div>
      );
    }

    return (
      <button
        onClick={handleSendFriendRequest}
        className={`${designRecipes.buttonPrimary} inline-flex items-center gap-2 px-4`}
      >
        <UserPlus className="h-4 w-4" />
        Add Friend
      </button>
    );
  };

  return (
    <div className="-mx-4 overflow-hidden border-y border-ds-border-subtle bg-ds-surface-card font-sans shadow-dsSm sm:mx-0 sm:rounded-2xl sm:border sm:border-ds-border-subtle">
      <Toaster />
      <div className="relative">
        <div 
          className="h-36 bg-cover bg-center sm:h-48 lg:h-56"
          style={coverStyle}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ds-text-primary/35 via-ds-text-primary/10 to-transparent" />
        {
          self && (
            <button 
              onClick={openCoverModal}
              className="absolute right-3 top-3 rounded-full border border-ds-surface-card/60 bg-ds-surface-card/90 p-2 shadow-dsSm backdrop-blur transition-colors hover:bg-ds-surface-card sm:right-4 sm:top-4"
            >
              <Edit className="h-4 w-4 text-ds-text-secondary" />
            </button>
          )
        }
      </div>
      
      <div className="px-4 pb-6 sm:px-6 lg:px-8">
        <div className="-mt-12 sm:-mt-16">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative shrink-0">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border-4 border-ds-surface-card object-cover shadow-dsMd sm:h-28 sm:w-28 lg:h-32 lg:w-32"
                />
                {
                  self && (
                    <button 
                      onClick={openProfileModal}
                      className="absolute bottom-1 right-1 rounded-full bg-ds-surface-card p-2 shadow-dsSm ring-1 ring-ds-border-subtle transition-colors hover:bg-ds-surface-muted"
                    >
                      <Edit className="h-4 w-4 text-ds-text-secondary" />
                    </button>
                  )
                }
              </div>
              <div className="pb-1">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold tracking-tight text-ds-text-primary sm:text-3xl">{displayName}</h1>
                  {
                    self && (
                      <button 
                        onClick={() => setEditModal({ type: 'username', isOpen: true })}
                        className="rounded-md p-1.5 text-ds-text-muted transition-colors hover:bg-ds-surface-muted hover:text-ds-brand-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )
                  }
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ds-text-secondary">
                  <div className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-ds-text-muted" />
                    <span>{displayLocation}</span>
                    {
                      self && (
                        <button 
                          onClick={() => setEditModal({ type: 'location', isOpen: true })}
                          className="rounded p-1 text-ds-text-muted transition-colors hover:bg-ds-surface-muted hover:text-ds-brand-600"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                      )
                    }
                  </div>
                  <div className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-ds-text-muted" />
                    <span>Joined {displayJoinDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {
                !self && (
                  <>
                    {renderActionButtons()}
                    {/* on clicking it will take to the message page where we can send message */}
                    {/* <MessageBtn userTwoID={ userID } /> */}
                    <button
                      onClick={openReportModal}
                  className="inline-flex items-center gap-2 rounded-xl border border-ds-state-danger/30 bg-ds-surface-card px-4 py-2 text-sm font-semibold text-ds-state-danger transition-colors hover:bg-ds-state-dangerSoft"
                    >
                      <Flag className="h-4 w-4" />
                      Report
                    </button>
                  </>
                )
              }
              {self && renderActionButtons()}
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-ds-border-subtle bg-ds-surface-muted/60 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="max-w-3xl text-sm leading-relaxed text-ds-text-secondary sm:text-base">
                {displayDescription}
              </p>
              {
                self && (
                  <button 
                    onClick={() => setEditModal({ type: 'description', isOpen: true })}
                    className="shrink-0 rounded-md p-2 text-ds-text-muted transition-colors hover:bg-ds-surface-card hover:text-ds-brand-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )
              }
            </div>

          </div>

        </div>
      </div>

      {editModal.type && (
        <EditProfileModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ type: null, isOpen: false })}
          type={editModal.type}
          // currentValue={profile[editModal.type]}
          onSave={async(value) => {
            changeProfileDetails( value, editModal?.type!)
          }}
        />
      )}

      {isProfileModalOpen && <ProfileImgUploadModal closeModal={closeProfileModal} />}
      {isCoverModalOpen && <CoverImgUploadModal closeModal={closeCoverModal} />}

      {/* report modal */}
      {
        isReportModalOpen && (
          <ReportModal
            isOpen={isReportModalOpen}
            onClose={closeReportModal}
            onSubmit={handleReportSubmit}
          />
        )
      }
    </div>
  );
}