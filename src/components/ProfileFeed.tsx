import React, { useEffect, useRef, useState } from 'react';
import useAxiosInstance from '../axios/axiosInstance';
import FeedCard from './FeedCard';
import { showErrorToast, showSuccessToast } from 'authMF/toastFunction';
import { DEFAULT_PROFILE_IMAGE } from '../constants/constants';
import { designRecipes } from 'hostApp/designRecipes';

interface ProfileFeedProps {
    userID: string | undefined;
    self: boolean;
}

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

function ProfileFeed({ userID, self }: ProfileFeedProps) {
    const userid = userID || 'self';
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

    const fetchTimelineRef = useRef<(reset: boolean) => Promise<void>>(async () => {});

    fetchTimelineRef.current = async (reset: boolean) => {
        if (loadingRef.current) return;
        if (!reset && (!hasMoreRef.current || !cursorRef.current)) return;

        const requestId = ++requestIdRef.current;
        loadingRef.current = true;
        setLoading(true);

        try {
            const params =
                reset || !cursorRef.current ? {} : { cursor: cursorRef.current };
            const response = await axiosInstance.get(`../timeline/${userid}`, { params });
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
            if (status === 429) {
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

        fetchTimelineRef.current(true);

        return () => {
            requestIdRef.current += 1;
            loadingRef.current = false;
        };
    }, [userid, self]);

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

            fetchTimelineRef.current(false);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [userid]);

    const handleDeletePost = (postID: string) => {
        axiosInstance
            .delete(`../post/${postID}/delete`)
            .then(() => {
                setPosts((prev) => prev.filter((post) => post.postID !== postID && post.id !== postID));
                showSuccessToast('Post deleted');
            })
            .catch(() => showErrorToast('Unable to delete post'));
    };

    return (
        <div className="mx-auto">
            {posts.map((post) => (
                <FeedCard
                    key={post.id}
                    username={post.owner?.username || 'You'}
                    userImage={post.owner?.profilePic || DEFAULT_PROFILE_IMAGE}
                    content={post.content}
                    image={post.imageURL}
                    postID={post.postID}
                    timestamp={post.createdAt}
                    type={self ? 'self' : 'common'}
                    handleDeletePost={handleDeletePost}
                    isLiked={post.timelines[0]?.isLiked ?? false}
                    isCommented={false}
                />
            ))}

            {loading && (
                <p className="py-4 text-center text-ds-text-muted animate-pulse">Loading...</p>
            )}

            {!hasMore && posts.length > 0 && (
                <div className={`${designRecipes.panel} mt-6 p-4 text-center text-ds-text-secondary`}>
                    <p>No more posts to load</p>
                </div>
            )}
        </div>
    );
}

export default ProfileFeed;
