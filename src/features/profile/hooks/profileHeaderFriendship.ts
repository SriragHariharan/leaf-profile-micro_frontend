import type { FriendStatus } from '../../../types/profile.types';

export type ApiFriendStatus = 'none' | 'friends' | 'pending_sent' | 'pending_received';

export type ProfileRelationshipApi = {
  isFriend: boolean;
  friendRequestId: string | null;
  friendStatus: ApiFriendStatus;
};

export const DEFAULT_PROFILE_RELATIONSHIP: ProfileRelationshipApi = {
  isFriend: false,
  friendRequestId: null,
  friendStatus: 'none',
};

export function mapApiFriendStatus(status: ApiFriendStatus): FriendStatus {
  if (status === 'friends') return 'friends';
  if (status === 'pending_sent') return 'pending_sent';
  if (status === 'pending_received') return 'pending_received';
  return '';
}
