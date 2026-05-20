import { LEAF_FRIEND_BASE_URL } from '../../../constants/constants';

/** Friend service uses full URLs; bypasses user axios baseURL by design. */
export function friendUrl(path: string): string {
  return `${LEAF_FRIEND_BASE_URL}${path}`;
}

export const FRIEND_PATHS = {
  requests: '/friend-requests',
  friends: '/friends',
  relationship: (userId: string) => `/friend-requests/relationship/${userId}`,
  sendRequest: (userId: string) => `/friend-requests/${userId}`,
  patchRequest: (requestId: string) => `/friend-requests/${requestId}`,
  unfriend: (userId: string) => `/friends/${userId}`,
} as const;
