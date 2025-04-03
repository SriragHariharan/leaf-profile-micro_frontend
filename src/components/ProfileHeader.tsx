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
import MessageBtn from './MessageBtn';

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

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Toaster />
      <div className="relative">
        <div 
          className="h-48 sm:h-64 bg-cover bg-center"
          style={{
            backgroundImage: `url(${profile?.coverPicture})`
          }}
        />
        {
          self && (
            <button 
              onClick={openCoverModal}
              className="absolute right-4 top-4 bg-white/80 p-2 rounded-full hover:bg-white"
            >
              <Edit className="h-4 w-4 text-gray-700" />
            </button>
          )
        }
      </div>
      
      <div className="px-4 sm:px-6 pb-6">
        <div className="flex justify-between items-end -mt-12 sm:-mt-16">
          <div className="relative">
            <img
              src={profile?.profilePicture || DEFAULT_PROFILE_IMAGE }
              alt="Profile"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white"
            />
            {
              self && (
                <button 
                  onClick={openProfileModal}
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-sm hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 text-gray-700" />
                </button>
              )
            }
          </div>
          {
            !self && (
              <button
                onClick={openReportModal}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <Flag className="h-4 w-4" />
                <span className="hidden sm:inline">Report</span>
              </button>
            )
          }
          {
            self ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
              ) : profile.isFriend ? (
                <div className="h2">Friends</div>
                /* uncomment this when message feature is implemented correctly */
                /* on clicking it will take to the message page where we can send message */
                // <MessageBtn userTwoID={ userID } />
              ) : profile?.friendStatus === 'pending' ? (
                <div className="flex">
                  <button
                    onClick={handleRejectFriendship}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                  >
                    <Hourglass className="h-4 w-4 spin" />
                    <span className="hidden sm:inline">Reject</span>
                  </button>

                  <button
                    onClick={handleAcceptFriendship}
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <Hourglass className="h-4 w-4 spin" />
                    <span className="hidden sm:inline">Accept</span>
                  </button>

                </div>
              ) : (
                <button
                  onClick={handleSendFriendRequest}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Friend</span>
                </button>
            )
          }
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-start">
            {
              self && (
                <button 
                  onClick={() => setEditModal({ type: 'username', isOpen: true })}
                  className="p-2 text-gray-600 hover:text-green-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )
            }
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{profile.username}</h1>
          </div>
          
          <div className="mt-2 flex items-center justify-between overflow-wrap break-words">
            {
              self && (
                <button 
                  onClick={() => setEditModal({ type: 'description', isOpen: true })}
                  className="p-2 text-gray-600 hover:text-green-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
              )
            }
            <p className="text-sm sm:text-base text-gray-600 flex-1 pr-4 ">{profile.description}</p>
          </div>
          <div className="flex flex-start">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{profile.location}</span>
                {
                  self && (
                    <button 
                      onClick={() => setEditModal({ type: 'location', isOpen: true })}
                      className="p-1 text-gray-600 hover:text-green-600"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                  )
                }
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Joined {profile?.joinDate}</span>
              </div>
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