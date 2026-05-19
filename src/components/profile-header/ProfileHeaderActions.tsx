/**
 * ProfileHeaderActions
 *
 * Renders the action button cluster in the profile header:
 * - Own profile: Logout
 * - Other profiles: Add Friend / Cancel / Accept+Reject / Friends badge, plus Report
 *
 * Friendship state is read from `profile`; handlers call the API via useProfileHeader.
 */
import React from 'react';
import { UserPlus, LogOut, Hourglass, Flag, X, UserMinus } from 'lucide-react';
import type { Profile } from '../../types/profile.types';
import {
  compactBtnPrimary,
  compactBtnReport,
  compactBtnWarning,
  compactStatusSuccess,
  compactIcon,
} from './profileHeaderStyles';

type ProfileHeaderActionsProps = {
  self: boolean;
  profile: Profile;
  onLogout: () => void;
  onSendFriendRequest: () => void;
  onCancelFriendRequest: () => void;
  onAcceptFriendship: () => void;
  onRejectFriendship: () => void;
  onUnfriend: () => void;
  onReport: () => void;
};

function FriendActionButtons({
  profile,
  onSendFriendRequest,
  onCancelFriendRequest,
  onAcceptFriendship,
  onRejectFriendship,
  onUnfriend,
}: Pick<
  ProfileHeaderActionsProps,
  | 'profile'
  | 'onSendFriendRequest'
  | 'onCancelFriendRequest'
  | 'onAcceptFriendship'
  | 'onRejectFriendship'
  | 'onUnfriend'
>) {
  if (profile.isFriend || profile.friendStatus === 'friends') {
    return (
      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-2">
        <span className={compactStatusSuccess}>Friends</span>
        <button onClick={onUnfriend} className={compactBtnWarning}>
          <UserMinus className={compactIcon} />
          Unfriend
        </button>
      </div>
    );
  }

  if (profile.friendStatus === 'pending_received') {
    return (
      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-2">
        <button onClick={onRejectFriendship} className={compactBtnWarning}>
          <Hourglass className={compactIcon} />
          Reject
        </button>
        <button onClick={onAcceptFriendship} className={compactBtnPrimary}>
          <Hourglass className={compactIcon} />
          Accept
        </button>
      </div>
    );
  }

  if (profile.friendStatus === 'pending_sent') {
    return (
      <button onClick={onCancelFriendRequest} className={compactBtnWarning}>
        <X className={compactIcon} />
        Cancel Request
      </button>
    );
  }

  return (
    <button onClick={onSendFriendRequest} className={compactBtnPrimary}>
      <UserPlus className={compactIcon} />
      Add Friend
    </button>
  );
}

export default function ProfileHeaderActions({
  self,
  profile,
  onLogout,
  onSendFriendRequest,
  onCancelFriendRequest,
  onAcceptFriendship,
  onRejectFriendship,
  onUnfriend,
  onReport,
}: ProfileHeaderActionsProps) {
  if (self) {
    return (
      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-2">
        <button onClick={onLogout} className={compactBtnReport}>
          <LogOut className={compactIcon} />
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-2">
      <FriendActionButtons
        profile={profile}
        onSendFriendRequest={onSendFriendRequest}
        onCancelFriendRequest={onCancelFriendRequest}
        onAcceptFriendship={onAcceptFriendship}
        onRejectFriendship={onRejectFriendship}
        onUnfriend={onUnfriend}
      />
      {/* on clicking it will take to the message page where we can send message */}
      {/* <MessageBtn userTwoID={ userID } /> */}
      <button onClick={onReport} className={compactBtnReport}>
        <Flag className={compactIcon} />
        Report
      </button>
    </div>
  );
}
