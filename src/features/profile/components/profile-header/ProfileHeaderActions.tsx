/**
 * ProfileHeaderActions
 *
 * Renders the action button cluster in the profile header.
 */
import React from 'react';
import { UserPlus, LogOut, Hourglass, Flag, X, UserMinus } from 'lucide-react';
import { designRecipes } from "@srirag/leaf-design-system"
import type { Profile } from '../../../../types/profile.types';

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
        <span className={designRecipes.compactStatusSuccess}>Friends</span>
        <button onClick={onUnfriend} className={designRecipes.compactBtnWarning}>
          <UserMinus className={designRecipes.compactIcon} />
          Unfriend
        </button>
      </div>
    );
  }

  if (profile.friendStatus === 'pending_received') {
    return (
      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-2">
        <button onClick={onRejectFriendship} className={designRecipes.compactBtnWarning}>
          <Hourglass className={designRecipes.compactIcon} />
          Reject
        </button>
        <button onClick={onAcceptFriendship} className={designRecipes.compactBtnPrimary}>
          <Hourglass className={designRecipes.compactIcon} />
          Accept
        </button>
      </div>
    );
  }

  if (profile.friendStatus === 'pending_sent') {
    return (
      <button onClick={onCancelFriendRequest} className={designRecipes.compactBtnWarning}>
        <X className={designRecipes.compactIcon} />
        Cancel Request
      </button>
    );
  }

  return (
    <button onClick={onSendFriendRequest} className={designRecipes.compactBtnPrimary}>
      <UserPlus className={designRecipes.compactIcon} />
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
        <button onClick={onLogout} className={designRecipes.compactBtnReport}>
          <LogOut className={designRecipes.compactIcon} />
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
      <button onClick={onReport} className={designRecipes.compactBtnReport}>
        <Flag className={designRecipes.compactIcon} />
        Report
      </button>
    </div>
  );
}
