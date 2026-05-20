import { Bookmark } from 'lucide-react';
import React, { useState } from 'react';
import { DEFAULT_PROFILE_IMAGE } from '../../../constants/constants';
import { Link } from 'react-router';
import dayjs from 'dayjs';
import { Toaster } from 'authMF/toastFunction';
import { designRecipes } from 'hostApp/designRecipes';
import { usePostInteractions } from '../hooks/usePostInteractions';

interface SavedPosts {
  postID: string;
  profilepic: string | null;
  username: string;
  createdAt: Date | string;
  content: string;
  imageURL: string | null;
  userID: string;
}

function SavedFeedCard({
  postID,
  profilepic,
  username,
  createdAt,
  content,
  imageURL,
  userID,
}: SavedPosts) {
  const { unsavePost } = usePostInteractions(postID, false, false, true);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`${designRecipes.panel} overflow-hidden pb-4`}>
      <Toaster />
      <div className="p-4 flex items-center justify-between">
        <Link to={'/view-profile/' + userID} className="flex items-center gap-3">
          <img
            src={profilepic ?? DEFAULT_PROFILE_IMAGE}
            alt={username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-ds-text-primary">{username}</h3>
            <p className="text-sm text-ds-text-muted">
              {dayjs(createdAt).format('MMMM D, YYYY h:mm A')}
            </p>
          </div>
        </Link>
        <button
          onClick={() => unsavePost()}
          className="p-2 hover:bg-ds-surface-muted rounded-full transition-colors"
          title="Unsave post"
        >
          <Bookmark className="w-5 h-5 text-ds-state-danger " />
        </button>
      </div>

      <p className="mt-3 p-4 text-ds-text-primary break-words text-sm max-w-full overflow-hidden whitespace-normal">
        {isExpanded ? content : `${content.substring(0, 200)}...`}
        {content.length > 200 && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-ds-state-info ml-1">
            {isExpanded ? 'Read less' : 'Read more...'}
          </button>
        )}
      </p>

      {imageURL && (
        <img src={imageURL} alt="Post" className="w-screen h-96 object-contain" />
      )}
    </div>
  );
}

export default SavedFeedCard;
