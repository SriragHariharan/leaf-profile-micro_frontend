import React, { useEffect, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import useAxiosInstance from '../axios/axiosInstance';
import { showErrorToast, showSuccessToast } from 'authMF/toastFunction';
import { DEFAULT_PROFILE_IMAGE } from '../constants/constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { designRecipes } from 'hostApp/designRecipes';

dayjs.extend(relativeTime);


interface Comment {
  id: string;
  username: string;
  userImage: string;
  content: string;
  timestamp: string;
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

export default function CommentsModal({ isOpen, onClose, postId }: CommentsModalProps) {
  
  const axiosInstance = useAxiosInstance();
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  
  /* get comments */
  useEffect(() => {
    axiosInstance.get(`../post/${postId}/comment`)
    .then(resp => setComments(resp.data?.data?.comments))
    .catch(err => console.log(err));
  }, [postId])
  
  /* Add comment */
  const handleAddComment = () => {
    if (newComment.trim() === '') return;

    setIsLoading(true);

    axiosInstance.post(`../post/${postId}/comment`, { comment: newComment })
    .then(resp => {
      const comment = resp.data?.data?.comment;
      console.log(comment)
      setComments([comment, ...comments]);
      setNewComment('');
      showSuccessToast("Comment Added")
    })
    .catch(_err => showErrorToast("Unable to add comment"))
    .finally(() => setIsLoading(false));
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
                alt={comment.username}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-ds-surface-card"
              />
              <div className="flex-1">
                <div className="rounded-xl border border-ds-border-subtle bg-ds-surface-card p-3 shadow-dsSm">
                  <h4 className="font-semibold text-sm">{comment?.user?.username}</h4>
                  <p className="text-ds-text-secondary text-sm">{comment?.comment}</p>
                </div>
                <p className="text-xs text-ds-text-muted mt-1">{dayjs(comment?.createdAt)?.fromNow()}</p>
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
                <Send className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
