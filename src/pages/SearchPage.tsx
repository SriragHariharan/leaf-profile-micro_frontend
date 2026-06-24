import '../index.scss';
import React, { useState } from 'react';
import { type AxiosInstance } from 'axios';
import { Search, Bookmark } from 'lucide-react';
import { clsx } from 'clsx';
import useAxiosInstance from 'hostApp/useAxiosInstance';
import FeedCard from '../features/feed/components/FeedCard';
import SavedFeedCard from '../features/feed/components/SavedFeedCard';
import SearchSegmentedControl from '../features/search/components/SearchSegmentedControl';
import SearchUserCard from '../features/search/components/SearchUserCard';
import InfoCard from '../features/search/components/InfoCard';
import { showErrorToast } from 'hostApp/toast';
import { GATEWAY_PATHS } from '../constants/constants';
import { designRecipes } from "@srirag/leaf-design-system"
import type {
  SavedPostResult,
  SearchPostResult,
  SearchType,
  SearchUserResult,
  ViewMode,
} from '../features/search/types/search.types';

interface ApiResponse<T> {
  data?: T;
}

interface SearchResultsData {
  posts?: SearchPostResult[];
  users?: SearchUserResult[];
}

interface SavedPostsData {
  posts?: SavedPostResult[];
}

function getResponseStatus(err: unknown): number | undefined {
  return (err as { response?: { status?: number } })?.response?.status;
}

function SearchPage() {
  const axiosInstance = useAxiosInstance() as AxiosInstance;

  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('user');
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [searchedPosts, setSearchedPosts] = useState<SearchPostResult[]>([]);
  const [searchedUsers, setSearchedUsers] = useState<SearchUserResult[]>([]);
  const [savedPosts, setSavedPosts] = useState<SavedPostResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const runSearch = async (query: string, type: SearchType) => {
    const trimmed = query.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setViewMode('search');
    setHasSearched(true);

    try {
      const resp = await axiosInstance.get<ApiResponse<SearchResultsData>>(
        GATEWAY_PATHS.post.search,
        { params: { query: trimmed, type } }
      );

      if (type === 'post') {
        setSearchedPosts(resp?.data?.data?.posts ?? []);
        setSearchedUsers([]);
      } else {
        setSearchedUsers(resp?.data?.data?.users ?? []);
        setSearchedPosts([]);
      }
    } catch (err: unknown) {
      if (getResponseStatus(err) === 429) {
        showErrorToast('Too many searches. Please wait a moment and try again.');
      } else {
        showErrorToast(
          type === 'post' ? 'Unable to search posts' : 'Unable to search people'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    runSearch(searchQuery, searchType);
  };

  const handleSegmentChange = (type: SearchType) => {
    if (type === searchType || loading) return;
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

    if (loading) return;

    setLoading(true);
    setHasSearched(false);

    try {
      const resp = await axiosInstance.get<ApiResponse<SavedPostsData>>(
        GATEWAY_PATHS.post.save
      );
      setSavedPosts(resp?.data?.data?.posts ?? []);
      setViewMode('saved');
    } catch (err: unknown) {
      const status = getResponseStatus(err);
      const message =
        status === 429
          ? 'Too many requests. Please wait a moment and try again.'
          : ((err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? 'Unable to load saved posts');
      showErrorToast(message);
    } finally {
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
      <div className={designRecipes.searchStickyHeader}>
        <div className="mx-auto space-y-3 px-4 py-3">
          <form onSubmit={handleSearch} className="relative flex">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ds-text-muted"
              aria-hidden
            />
            <input
              type="text"
              placeholder={placeholder}
              disabled={loading}
              className={designRecipes.inputSearchPill}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search query"
            />
          </form>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <SearchSegmentedControl
              value={searchType}
              onChange={handleSegmentChange}
              disabled={loading || isSavedView}
            />

            <button
              type="button"
              onClick={handleSavedPosts}
              disabled={loading}
              aria-pressed={isSavedView}
              title={isSavedView ? 'Back to search' : 'Saved posts'}
              className={clsx(
                designRecipes.buttonSecondary,
                'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-ds disabled:opacity-60',
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
