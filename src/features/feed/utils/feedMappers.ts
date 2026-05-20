import type { MappedPost, TimelineFeedItem } from '../types/feed.types';

export function mapFeedToPost(feed: TimelineFeedItem): MappedPost {
  return {
    id: feed.feed_id,
    postID: feed.post_id,
    content: feed.Post?.content ?? '',
    imageURL: feed.Post?.media_url ?? null,
    createdAt: feed.Post?.created_at ?? feed.created_at,
    owner: feed.Author
      ? { username: feed.Author.username, profilePic: feed.Author.profile_pic }
      : undefined,
    timelines: [{ isLiked: feed.is_liked, isCommented: feed.is_commented }],
  };
}

export function mergePosts(existing: MappedPost[], incoming: MappedPost[]): MappedPost[] {
  const seen = new Set(existing.map((p) => p.id));
  const uniqueIncoming = incoming.filter((p) => !seen.has(p.id));
  return [...existing, ...uniqueIncoming];
}
