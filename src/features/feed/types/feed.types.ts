export interface TimelineFeedItem {
  feed_id: string;
  post_id: string;
  is_liked: boolean;
  is_commented: boolean;
  created_at: string;
  Author?: { username: string; profile_pic: string };
  Post?: { content: string; media_url: string; created_at: string };
}

export interface MappedPost {
  id: string;
  postID: string;
  content: string;
  imageURL: string | null;
  createdAt: string;
  owner?: { username: string; profilePic: string };
  timelines: { isLiked: boolean; isCommented: boolean }[];
}

export type FeedSource = 'home' | 'timeline';
