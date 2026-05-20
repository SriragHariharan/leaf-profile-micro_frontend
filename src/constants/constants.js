export const DEFAULT_PROFILE_IMAGE = process.env.REACT_APP_DEFAULT_PROFILE_IMAGE;
export const LEAF_POST_BASE_URL = process.env.REACT_APP_LEAF_POST_BASE_URL;
export const LEAF_FRIEND_BASE_URL = process.env.REACT_APP_LEAF_FRIEND_BASE_URL;

/**
 * Gateway-relative paths from user axios baseURL (/api/v1/user).
 * ../post, ../feed, ../timeline hop to other services via the API gateway.
 */
export const GATEWAY_PATHS = {
  feed: '../feed',
  timeline: (userId = 'self') => `../timeline/${userId}`,
  post: {
    root: '../post',
    search: '../post/search',
    save: '../post/save',
    comment: (postId) => `../post/${postId}/comment`,
    commentById: (postId, commentId) => `../post/${postId}/comment/${commentId}`,
    interaction: (postId) => `../post/interaction/${postId}`,
    like: (postId) => `../post/like/${postId}`,
    saveById: (postId) => `../post/save/${postId}`,
    report: (postId) => `../post/report/${postId}`,
    delete: (postId) => `../post/${postId}/delete`,
    details: (postId) => `/${postId}/details`,
  },
};

/** Profile API paths on the user service baseURL */
export const PROFILE_PATHS = {
  self: (userId) => `/profile/${userId ?? 'self'}`,
  field: (type) => `/profile/${type}`,
  report: (userId) => `/profile/report/${userId}`,
  pictureProfile: '/profile/picture/profile',
  pictureCover: '/profile/picture/cover',
  bucketList: '/profile/bucket-list',
  bucketListByUser: (userId) => `/profile/bucket-list/${userId ?? 'self'}`,
  travelHistory: '/profile/travel-history',
  travelHistoryByUser: (userId) => `/profile/travel-history/${userId ?? 'self'}`,
};

export function postDetailsUrl(postId) {
  return `${LEAF_POST_BASE_URL}${GATEWAY_PATHS.post.details(postId)}`;
}
