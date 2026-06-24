import React, { useEffect, useState } from 'react';
import { MessageCircle, Send, Trash2, X } from 'lucide-react';
import useAxiosInstance from 'hostApp/useAxiosInstance';
import { showErrorToast, showSuccessToast } from 'hostApp/toast';
import { DEFAULT_PROFILE_IMAGE, GATEWAY_PATHS } from '../../../constants/constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { designRecipes } from "@srirag/leaf-design-system"

dayjs.extend(relativeTime);

interface CommentUser {
  userID: string;
  username: string;
  profilepic?: string | null;
}

interface Comment {
  id: number;
  postID: string;
  userID: string;
  comment: string;
  createdAt: string;
  user?: CommentUser;
}

interface InteractionUpdate {
  commentsCount?: number;
  isCommented?: boolean;
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onInteractionUpdate?: (update: InteractionUpdate) => void;
}

export default function CommentsModal({
  isOpen,
  onClose,
  postId,
  onInteractionUpdate,
}: CommentsModalProps) {
  const axiosInstance = useAxiosInstance();
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const currentUserId = localStorage.getItem('LEAF_USER_ID');

  useEffect(() => {
    if (!isOpen) return;
    axiosInstance
      .get(GATEWAY_PATHS.post.comment(postId))
      .then((resp) => setComments(resp.data?.data?.comments ?? []))
      .catch(() => showErrorToast('Unable to load comments'));
  }, [postId, isOpen]);

  const handleAddComment = () => {
    if (newComment.trim() === '') return;

    setIsLoading(true);

    axiosInstance
      .post(GATEWAY_PATHS.post.comment(postId), { comment: newComment })
      .then((resp) => {
        const { comment, commentsCount, isCommented } = resp.data?.data ?? {};
        if (comment) {
          setComments((prev) => [comment, ...prev]);
        }
        setNewComment('');
        onInteractionUpdate?.({ commentsCount, isCommented });
        showSuccessToast('Comment Added');
      })
      .catch(() => showErrorToast('Unable to add comment'))
      .finally(() => setIsLoading(false));
  };

  const handleDeleteComment = (commentId: number) => {
    axiosInstance
      .delete(GATEWAY_PATHS.post.commentById(postId, commentId))
      .then((resp) => {
        const { commentsCount, isCommented } = resp.data?.data ?? {};
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        onInteractionUpdate?.({ commentsCount, isCommented });
        showSuccessToast('Comment deleted');
      })
      .catch(() => showErrorToast('Unable to delete comment'));
  };

  if (!isOpen) return null;

  return (
    <div className={designRecipes.modalOverlay}>
      <div className={`${designRecipes.modalContainer} flex h-[80vh] max-w-2xl flex-col`}>
        <div className={designRecipes.modalHeader}>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-ds-brand-50 p-2 text-ds-brand-600">
              <MessageCircle className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-ds-text-primary">Comments</h2>
          </div>
          <button onClick={onClose} className={designRecipes.iconButton}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-ds-surface-muted/30 p-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img
                src={comment?.user?.profilepic ?? DEFAULT_PROFILE_IMAGE}
                alt={comment.user?.username ?? 'User'}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-ds-surface-card"
              />
              <div className="flex-1">
                <div className="rounded-xl border border-ds-border-subtle bg-ds-surface-card p-3 shadow-dsSm">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm">{comment?.user?.username}</h4>
                    {currentUserId && comment.userID === currentUserId && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment.id)}
                        className={designRecipes.iconButton}
                        aria-label="Delete comment"
                      >
                        <Trash2 className="h-4 w-4 text-ds-text-muted" />
                      </button>
                    )}
                  </div>
                  <p className="text-ds-text-secondary text-sm">{comment?.comment}</p>
                </div>
                <p className="text-xs text-ds-text-muted mt-1">
                  {dayjs(comment?.createdAt)?.fromNow()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-ds-border-subtle p-4">
          <div className="flex gap-3">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className={`${designRecipes.inputBase} flex-1`}
              />
              <button
                onClick={handleAddComment}
                className={`${designRecipes.buttonPrimary} px-3 disabled:cursor-not-allowed`}
                disabled={isLoading || !newComment.trim()}
              >
                <Send className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
