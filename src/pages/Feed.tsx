import React from 'react';
import '../index.scss';
import CreatePost from '../features/feed/components/CreatePost';
import FeedCard from '../features/feed/components/FeedCard';
import { DEFAULT_PROFILE_IMAGE } from '../constants/constants';
import { designRecipes } from "@srirag/leaf-design-system"
import { useInfiniteFeed } from '../features/feed/hooks/useInfiniteFeed';

function Feed() {
  const { posts, loading, hasMore, refresh } = useInfiniteFeed({ source: 'home' });

  const handleDeletePost = (_postID: string) => {
    /* main feed is "common" — no delete from this surface */
  };

  return (
    <div className={designRecipes.pageCenter}>
      <div className={`${designRecipes.pageContainer} lg:mt-10`}>
        <CreatePost />

        <button
          onClick={refresh}
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
            isCommented={post.timelines[0]?.isCommented ?? false}
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
