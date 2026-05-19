import '../index.scss';
import React, { useCallback, useRef, useState } from 'react';
import axios from 'axios';
import { Search, Bookmark } from 'lucide-react';
import { clsx } from 'clsx';
import useAxiosInstance from '../axios/axiosInstance';
import FeedCard from '../components/FeedCard';
import SavedFeedCard from '../components/SavedFeedCard';
import SearchSegmentedControl from '../components/SearchSegmentedControl';
import SearchUserCard from '../components/SearchUserCard';
import InfoCard from '../components/InfoCard';
import { Toaster, showErrorToast } from 'authMF/toastFunction';
import { designRecipes } from 'hostApp/designRecipes';
import type {
  SavedPostResult,
  SearchPostResult,
  SearchType,
  SearchUserResult,
  ViewMode,
} from '../types/search.types';

function isCanceledError(err: unknown): boolean {
  return (
    axios.isCancel(err) ||
    (err as { code?: string })?.code === 'ERR_CANCELED'
  );
}

function SearchPage() {
  const axiosInstance = useAxiosInstance();
  const axiosRef = useRef(axiosInstance);
  axiosRef.current = axiosInstance;

  const abortControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const loadingRef = useRef(false);
  const lastSearchKeyRef = useRef<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('user');
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [searchedPosts, setSearchedPosts] = useState<SearchPostResult[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<SearchUserResult[]>([]);
  const [savedPosts, setSavedPosts] = useState<SavedPostResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = useCallback(async (query: string, type: SearchType) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const searchKey = `${type}:${trimmed.toLowerCase()}`;
    if (loadingRef.current && lastSearchKeyRef.current === searchKey) {
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const requestId = ++requestIdRef.current;
    lastSearchKeyRef.current = searchKey;
    loadingRef.current = true;
    setLoading(true);
    setViewMode('search');
    setHasSearched(true);

    try {
      const resp = await axiosRef.current.get('../post/search', {
        params: { query: trimmed, type },
        signal: controller.signal,
      });

      if (requestId !== requestIdRef.current) return;

      if (type === 'post') {
        setSearchedPosts(resp?.data?.data?.posts ?? []);
        setSearchedUsers([]);
      } else {
        setSearchedUsers(resp?.data?.data?.users ?? []);
        setSearchedPosts([]);
      }
    } catch (err: unknown) {
      if (isCanceledError(err) || requestId !== requestIdRef.current) return;

      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      if (status === 429) {
        showErrorToast('Too many searches. Please wait a moment and try again.');
      } else {
        showErrorToast(
          type === 'post' ? 'Unable to search posts' : 'Unable to search people'
        );
      }
    } finally {
      if (requestId === requestIdRef.current) {
        loadingRef.current = false;
        setLoading(false);
      }
    }
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed || loadingRef.current) return;
    runSearch(trimmed, searchType);
  };

  const handleSegmentChange = (type: SearchType) => {
    if (type === searchType) return;
    setSearchType(type);
    setViewMode('search');
    const trimmed = searchQuery.trim();
    if (trimmed && hasSearched) {
      runSearch(trimmed, type);
    }
  };

  const handleSavedPosts = async () => {
    if (viewMode === 'saved') {
      setViewMode('search');
      return;
    }

    if (loadingRef.current) return;

    abortControllerRef.current?.abort();
    loadingRef.current = true;
    setLoading(true);
    setHasSearched(false);

    try {
      const resp = await axiosRef.current.get('../post/save');
      setSavedPosts(resp?.data?.data?.posts ?? []);
      setViewMode('saved');
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;
      const message =
        status === 429
          ? 'Too many requests. Please wait a moment and try again.'
          : ((err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? 'Unable to load saved posts');
      showErrorToast(message);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

  const placeholder =
    searchType === 'post' ? 'Search posts...' : 'Search people...';

  const isSavedView = viewMode === 'saved';

  const renderResults = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-ds-border-subtle border-t-ds-brand-600" />
        </div>
      );
    }

    if (isSavedView) {
      if (savedPosts.length === 0) {
        return <InfoCard message="No saved posts yet. Bookmark posts to see them here." />;
      }
      return savedPosts.map((item) => (
        <SavedFeedCard
          key={item.postID}
          postID={item.postID}
          username={item.user?.username ?? ''}
          profilepic={item.user?.profilepic ?? null}
          content={item.post?.content ?? ''}
          imageURL={item.post?.imageURL ?? null}
          createdAt={item.post?.createdAt ?? ''}
          userID={item.userID}
        />
      ));
    }

    if (!hasSearched) {
      return (
        <InfoCard message="Search for posts or people using the bar above." />
      );
    }

    if (searchType === 'user') {
      if (searchedUsers.length === 0) {
        return <InfoCard message="No people found matching your search." />;
      }
      return searchedUsers.map((user) => (
        <SearchUserCard key={user.userID} {...user} />
      ));
    }

    if (searchedPosts.length === 0) {
      return <InfoCard message="No posts found matching your search." />;
    }

    return searchedPosts.map((post) => (
      <FeedCard
        key={post.id}
        postID={post.id}
        username={post.user?.username ?? ''}
        userImage={post.user?.profilepic}
        content={post.content}
        image={post.imageURL}
        timestamp={post.createdAt}
        type="common"
        isLiked={false}
        isCommented={false}
        handleDeletePost={() => {}}
      />
    ));
  };

  return (
    <div>
      <Toaster />

      <div className="sticky top-0 z-10 mx-auto bg-ds-surface-card shadow-dsSm md:max-w-4xl">
        <div className="mx-auto space-y-3 px-4 py-3">
          <form onSubmit={handleSearch} className="relative flex">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ds-text-muted"
              aria-hidden
            />
            <input
              type="text"
              placeholder={placeholder}
              className={`${designRecipes.inputBase} w-full rounded-full py-2.5 pl-11 pr-14`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search query"
            />
            {/* <button
              type="submit"
              disabled={loading}
              className={`${designRecipes.buttonPrimary} absolute right-1 top-1/2 flex h-9 -translate-y-1/2 items-center justify-center rounded-full px-4 text-sm font-medium disabled:opacity-60`}
            >
              Search
            </button> */}
          </form>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <SearchSegmentedControl
              value={searchType}
              onChange={handleSegmentChange}
              disabled={isSavedView}
            />

            <button
              type="button"
              onClick={handleSavedPosts}
              aria-pressed={isSavedView}
              title={isSavedView ? 'Back to search' : 'Saved posts'}
              className={clsx(
                designRecipes.buttonSecondary,
                'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-ds',
                isSavedView &&
                  'border-ds-brand-200 bg-ds-brand-50 text-ds-brand-700 shadow-dsBrand'
              )}
            >
              <Bookmark
                className={clsx('h-5 w-5', isSavedView && 'fill-current')}
              />
              <span className="hidden sm:inline">
                {isSavedView ? 'Searching' : 'Saved'}
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-6 max-w-4xl px-4 pb-8">{renderResults()}</div>
    </div>
  );
}

export default SearchPage;
