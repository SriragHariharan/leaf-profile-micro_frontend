import { useCallback, useEffect, useRef, useState } from 'react';
import useAxiosInstance from 'hostApp/useAxiosInstance';
import { showErrorToast } from 'hostApp/toast';
import type { FeedSource, MappedPost, TimelineFeedItem } from '../types/feed.types';
import { GATEWAY_PATHS } from '../../../constants/constants';
import { mapFeedToPost, mergePosts } from '../utils/feedMappers';

const SCROLL_THROTTLE_MS = 500;

export interface UseInfiniteFeedOptions {
  source: FeedSource;
  userId?: string;
  resetDeps?: unknown[];
}

function getFeedEndpoint(source: FeedSource, userId?: string): string {
  if (source === 'home') return GATEWAY_PATHS.feed;
  return GATEWAY_PATHS.timeline(userId);
}

export function useInfiniteFeed({ source, userId, resetDeps = [] }: UseInfiniteFeedOptions) {
  const axiosInstance = useAxiosInstance();

  const [posts, setPosts] = useState<MappedPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

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
      const response = await axiosInstance.get(getFeedEndpoint(source, userId), { params });
      const feeds: TimelineFeedItem[] = response.data?.data ?? [];
      const nextCursor: string = response.data?.next_cursor ?? '';
      const mapped = feeds.map(mapFeedToPost);

      if (requestId !== requestIdRef.current) return;

      setPosts((prev) => (reset ? mapped : mergePosts(prev, mapped)));
      cursorRef.current = nextCursor;
      hasMoreRef.current = !!nextCursor;
      setHasMore(!!nextCursor);
    } catch (error: unknown) {
      if (requestId !== requestIdRef.current) return;
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (source === 'timeline' && status === 429) {
        hasMoreRef.current = false;
        setHasMore(false);
        showErrorToast('Too many requests. Please wait and refresh.');
      } else {
        console.error('Error fetching posts:', error);
      }
    } finally {
      if (requestId === requestIdRef.current) {
        loadingRef.current = false;
        setLoading(false);
        initialLoadDoneRef.current = true;
      }
    }
  };

  const resetFeedState = useCallback(() => {
    requestIdRef.current += 1;
    cursorRef.current = '';
    hasMoreRef.current = true;
    initialLoadDoneRef.current = false;
    lastScrollFetchRef.current = 0;
    setPosts([]);
    setHasMore(true);
    setLoading(false);
    loadingRef.current = false;
  }, []);

  const refresh = useCallback(() => {
    resetFeedState();
    fetchFeedRef.current(true);
  }, [resetFeedState]);

  const removePost = useCallback((postID: string) => {
    setPosts((prev) => prev.filter((post) => post.postID !== postID && post.id !== postID));
  }, []);

  useEffect(() => {
    resetFeedState();
    fetchFeedRef.current(true);

    return () => {
      requestIdRef.current += 1;
      loadingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source, userId, ...resetDeps]);

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
  }, [source, userId, ...resetDeps]);

  return { posts, loading, hasMore, refresh, removePost };
}
