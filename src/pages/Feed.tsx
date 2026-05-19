import React, { useEffect, useRef, useState } from 'react';
import '../index.scss';
import CreatePost from '../components/CreatePost';
import FeedCard from '../components/FeedCard';
import useAxiosInstance from '../axios/axiosInstance';
import { DEFAULT_PROFILE_IMAGE } from '../constants/constants';
import { designRecipes } from 'hostApp/designRecipes';

interface TimelineFeedItem {
  feed_id: string;
  post_id: string;
  is_liked: boolean;
  created_at: string;
  Author?: { username: string; profile_pic: string };
  Post?: { content: string; media_url: string; created_at: string };
}

interface MappedPost {
  id: string;
  postID: string;
  content: string;
  imageURL: string | null;
  createdAt: string;
  owner?: { username: string; profilePic: string };
  timelines: { isLiked: boolean }[];
}

const SCROLL_THROTTLE_MS = 500;

function mapFeedToPost(feed: TimelineFeedItem): MappedPost {
  return {
    id: feed.feed_id,
    postID: feed.post_id,
    content: feed.Post?.content ?? '',
    imageURL: feed.Post?.media_url ?? null,
    createdAt: feed.Post?.created_at ?? feed.created_at,
    owner: feed.Author
      ? { username: feed.Author.username, profilePic: feed.Author.profile_pic }
      : undefined,
    timelines: [{ isLiked: feed.is_liked }],
  };
}

function mergePosts(existing: MappedPost[], incoming: MappedPost[]): MappedPost[] {
  const seen = new Set(existing.map((p) => p.id));
  const uniqueIncoming = incoming.filter((p) => !seen.has(p.id));
  return [...existing, ...uniqueIncoming];
}

function Feed() {
  const axiosInstance = useAxiosInstance();

  const [posts, setPosts] = useState<MappedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const cursorRef = useRef('');
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const initialLoadDoneRef = useRef(false);
  const lastScrollFetchRef = useRef(0);
  const requestIdRef = useRef(0);

  const fetchFeedRef = useRef<(reset: boolean) => Promise<void>>(async () => {});

  fetchFeedRef.current = async (reset: boolean) => {
    if (loadingRef.current) return;
    if (!reset && (!hasMoreRef.current || !cursorRef.current)) return;

    const requestId = ++requestIdRef.current;
    loadingRef.current = true;
    setLoading(true);

    try {
      const params =
        reset || !cursorRef.current ? {} : { cursor: cursorRef.current };
      const response = await axiosInstance.get(`../feed`, { params });
      const feeds: TimelineFeedItem[] = response.data?.data ?? [];
      const nextCursor: string = response.data?.next_cursor ?? '';
      const mapped = feeds.map(mapFeedToPost);

      if (requestId !== requestIdRef.current) return;

      setPosts((prev) => (reset ? mapped : mergePosts(prev, mapped)));
      cursorRef.current = nextCursor;
      hasMoreRef.current = !!nextCursor;
      setHasMore(!!nextCursor);
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      console.error('Error fetching posts:', error);
    } finally {
      if (requestId === requestIdRef.current) {
        loadingRef.current = false;
        setLoading(false);
        initialLoadDoneRef.current = true;
      }
    }
  };

  useEffect(() => {
    requestIdRef.current += 1;
    cursorRef.current = '';
    hasMoreRef.current = true;
    initialLoadDoneRef.current = false;
    lastScrollFetchRef.current = 0;
    setPosts([]);
    setHasMore(true);
    setLoading(false);
    loadingRef.current = false;

    fetchFeedRef.current(true);

    return () => {
      requestIdRef.current += 1;
      loadingRef.current = false;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!initialLoadDoneRef.current || loadingRef.current || !hasMoreRef.current) {
        return;
      }

      const nearBottom =
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100;
      if (!nearBottom) return;

      const now = Date.now();
      if (now - lastScrollFetchRef.current < SCROLL_THROTTLE_MS) return;
      lastScrollFetchRef.current = now;

      fetchFeedRef.current(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const refreshFeed = () => {
    requestIdRef.current += 1;
    cursorRef.current = '';
    hasMoreRef.current = true;
    initialLoadDoneRef.current = false;
    lastScrollFetchRef.current = 0;
    setPosts([]);
    setHasMore(true);
    loadingRef.current = false;
    fetchFeedRef.current(true);
  };

  const handleDeletePost = (_postID: string) => {
    /* main feed is "common" — no delete from this surface */
  };

  return (
    <div className="flex items-start justify-center min-h-screen">
      <div className="max-w-3xl w-full lg:mt-10">
        <CreatePost />

        <button
          onClick={refreshFeed}
          className={`${designRecipes.buttonPrimary} mb-4 px-4`}
        >
          Refresh Feed
        </button>

        {posts.map((post) => (
          <FeedCard
            key={post.id}
            username={post.owner?.username ?? ''}
            userImage={post.owner?.profilePic || DEFAULT_PROFILE_IMAGE}
            content={post.content}
            image={post.imageURL}
            postID={post.postID}
            timestamp={post.createdAt}
            type="common"
            handleDeletePost={handleDeletePost}
            isLiked={post.timelines[0]?.isLiked ?? false}
            isCommented={false}
          />
        ))}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ds-text-primary" />
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="flex items-center justify-center">
            <div className={`${designRecipes.panel} p-4 text-center`}>
              <p className="text-ds-text-secondary">No more posts to load.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;
