import React from 'react';
import useAxiosInstance from 'hostApp/useAxiosInstance';
import FeedCard from './FeedCard';
import { showErrorToast, showSuccessToast } from 'hostApp/toast';
import { DEFAULT_PROFILE_IMAGE } from '../../../constants/constants';
import { designRecipes } from "@srirag/leaf-design-system"
import { useInfiniteFeed } from '../hooks/useInfiniteFeed';
import { POST_PATHS } from '../services/postApi';

interface ProfileFeedProps {
  userID: string | undefined;
  self: boolean;
}

function ProfileFeed({ userID, self }: ProfileFeedProps) {
  const userid = userID || 'self';
  const axiosInstance = useAxiosInstance();
  const { posts, loading, hasMore, removePost } = useInfiniteFeed({
    source: 'timeline',
    userId: userid,
    resetDeps: [userid, self],
  });

  const handleDeletePost = (postID: string) => {
    axiosInstance
      .delete(POST_PATHS.delete(postID))
      .then(() => {
        removePost(postID);
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
          isCommented={post.timelines[0]?.isCommented ?? false}
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
