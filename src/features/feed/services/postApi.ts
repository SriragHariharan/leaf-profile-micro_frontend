export const POST_PATHS = {
  interaction: (postId: string) => `../post/interaction/${postId}`,
  like: (postId: string) => `../post/like/${postId}`,
  save: (postId: string) => `../post/save/${postId}`,
  report: (postId: string) => `../post/report/${postId}`,
  delete: (postId: string) => `../post/${postId}/delete`,
} as const;
