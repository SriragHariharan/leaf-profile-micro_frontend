/**
 * Profile data shape returned from the profile API and held in ProfileHeader state.
 * Used by the profile header hook and presentational subcomponents.
 */
export type FriendStatus = '' | 'friends' | 'pending_sent' | 'pending_received';

export type Profile = {
  username: string | null;
  description: string | null;
  location: string | null;
  profilePicture: string | null;
  coverPicture: string | null;
  joinDate: string | null;
  isFriend?: boolean;
  friendStatus?: FriendStatus;
};

/** Fields that can be edited via EditProfileModal. */
export type ProfileEditField = 'username' | 'description' | 'location';

export type EditModalState = {
  type: ProfileEditField | null;
  isOpen: boolean;
};

export const emptyProfile: Profile = {
  username: null,
  description: null,
  location: null,
  profilePicture: null,
  coverPicture: null,
  joinDate: null,
  isFriend: false,
  friendStatus: '',
};
