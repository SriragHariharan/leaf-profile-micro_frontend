import React, { useEffect, useRef, useState } from 'react';
import { Heart, MessageCircle, Share2, MoreVertical, Bookmark, Flag, Trash } from 'lucide-react';
import { clsx } from 'clsx';
import CommentsModal from '../modals/CommentsModal';
import ReportPostModal from '../modals/ReportPostModal';
import { DEFAULT_PROFILE_IMAGE } from '../../../constants/constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { designRecipes } from 'hostApp/designRecipes';
import { showSuccessToast, showErrorToast } from 'hostApp/toast';
import { usePostInteractions } from '../hooks/usePostInteractions';

dayjs.extend(relativeTime);

interface FeedCardProps {
  postID: string;
  username: string;
  userImage: string | undefined | null;
  content: string;
  timestamp: string;
  image?: string | null;
  isLiked: boolean;
  isCommented: boolean;
  type: string;
  handleDeletePost: (postID: string) => void;
}

export default function FeedCard({
  username,
  userImage,
  content,
  timestamp,
  image,
  postID,
  type,
  handleDeletePost,
  isLiked,
  isCommented,
}: FeedCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    likes,
    comments,
    isLiked: postLiked,
    isCommented: postCommented,
    isSaved,
    toggleLike,
    toggleSave,
    reportPost,
    updateFromComments,
  } = usePostInteractions(postID, isLiked, isCommented, type === 'save');

  const handle = `@${username.replace(/\s+/g, '').toLowerCase()}`;
  const shouldTruncate = content.length > 200;
  const displayText =
    isExpanded || !shouldTruncate ? content : `${content.slice(0, 200)}…`;

  const toggleContent = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleShare = () => {
    const shareableLink = `${window.location.origin}/post?postID=${postID}`;
    navigator.clipboard
      .writeText(shareableLink)
      .then(() => showSuccessToast('Link copied to clipboard!'))
      .catch(() => showErrorToast('Failed to copy link.'));
  };

  const handleReportPost = async (reason: string, description: string) => {
    const ok = await reportPost(reason, description);
    if (ok) setShowReportModal(false);
  };

  const handleToggleSave = async () => {
    await toggleSave();
    setShowMenu(false);
  };

  const handleDelete = () => handleDeletePost(postID);

  return (
    <>
      <article
        className={clsx(
          designRecipes.panel,
          'mb-4 mx-auto max-w-2xl overflow-hidden'
        )}
      >
        <header className="flex items-center gap-3 px-4 py-3">
          <img
            src={userImage ?? DEFAULT_PROFILE_IMAGE}
            alt={username}
            className={designRecipes.avatarFeed}
          />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-ds-text-primary">
              {username}
            </h3>
            <p
              className="truncate text-xs text-ds-text-muted"
              title={dayjs(timestamp).format('MMM D, YYYY · h:mm A')}
            >
              {handle}
              <span className="mx-1">·</span>
              {dayjs(timestamp).fromNow()}
            </p>
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            {type === 'self' && (
              <button
                type="button"
                onClick={handleDelete}
                className={`${designRecipes.feedActionButton} hover:text-ds-state-danger`}
                aria-label="Delete post"
              >
                <Trash className="h-5 w-5" />
              </button>
            )}
            {type === 'common' && (
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className={designRecipes.feedActionButton}
                aria-label="Post options"
                aria-expanded={showMenu}
              >
                <MoreVertical className="h-5 w-5 text-ds-text-secondary" />
              </button>
            )}
            {showMenu && (
              <div className={designRecipes.dropdownMenu} role="menu">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setShowReportModal(true);
                    setShowMenu(false);
                  }}
                  className={designRecipes.dropdownMenuItem}
                >
                  <Flag className="h-4 w-4" />
                  Report post
                </button>
              </div>
            )}
          </div>
        </header>

        {content && (
          <div className="px-4 pb-3">
            <p className="break-words text-[15px] leading-6 text-ds-text-primary">
              {displayText}
              {shouldTruncate && (
                <button
                  type="button"
                  onClick={toggleContent}
                  className="ml-1 font-medium text-ds-state-info hover:underline"
                >
                  {isExpanded ? 'Read less' : 'Read more'}
                </button>
              )}
            </p>
          </div>
        )}

        {image && (
          <figure className="border-y border-ds-border-subtle bg-ds-surface-muted">
            <img
              src={image}
              alt="Post media"
              className="w-full max-h-[28rem] object-cover"
              loading="lazy"
            />
          </figure>
        )}

        <footer className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={toggleLike}
              className={designRecipes.feedActionWithCount}
              aria-label={postLiked ? 'Unlike post' : 'Like post'}
            >
              <Heart
                className={clsx(
                  'h-[22px] w-[22px] transition-colors duration-ds',
                  postLiked
                    ? 'fill-ds-state-danger text-ds-state-danger'
                    : 'text-ds-text-secondary'
                )}
              />
              <span className="min-w-[1ch] text-sm font-semibold tabular-nums text-ds-text-primary">
                {likes}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowComments(true)}
              className={designRecipes.feedActionWithCount}
              aria-label="View comments"
            >
              <MessageCircle
                className={clsx(
                  'h-[22px] w-[22px] transition-colors duration-ds',
                  postCommented
                    ? 'fill-ds-brand-500 text-ds-brand-500'
                    : 'text-ds-text-secondary'
                )}
              />
              <span className="min-w-[1ch] text-sm font-semibold tabular-nums text-ds-text-primary">
                {comments}
              </span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className={designRecipes.feedActionButton}
              aria-label="Share post"
            >
              <Share2 className="h-[22px] w-[22px] text-ds-text-secondary" />
            </button>
          </div>

          {(type === 'common' || type === 'save') && (
            <button
              type="button"
              onClick={handleToggleSave}
              className={designRecipes.feedActionButton}
              aria-label={isSaved ? 'Unsave post' : 'Save post'}
            >
              <Bookmark
                className={clsx(
                  'h-[22px] w-[22px] transition-colors duration-ds',
                  isSaved
                    ? 'fill-ds-text-primary text-ds-text-primary'
                    : 'text-ds-text-secondary'
                )}
              />
            </button>
          )}
        </footer>
      </article>

      <CommentsModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        postId={postID}
        onInteractionUpdate={updateFromComments}
      />

      <ReportPostModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportPost={handleReportPost}
      />
    </>
  );
}
