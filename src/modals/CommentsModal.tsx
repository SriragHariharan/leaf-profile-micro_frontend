import React, { useEffect, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import useAxiosInstance from '../axios/axiosInstance';
import { showErrorToast, showSuccessToast } from 'authMF/toastFunction';
import { DEFAULT_PROFILE_IMAGE } from '../constants/constants';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]">
      <div className="flex h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-50 p-2 text-green-600">
              <MessageCircle className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50/30 p-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img
                src={comment?.user?.profilepic ?? DEFAULT_PROFILE_IMAGE}
                alt={comment.username}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
              />
              <div className="flex-1">
                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                  <h4 className="font-semibold text-sm">{comment?.user?.username}</h4>
                  <p className="text-gray-700 text-sm">{comment?.comment}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{dayjs(comment?.createdAt)?.fromNow()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 p-4">
          <div className="flex gap-3">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              />
              <button 
                onClick={handleAddComment}
                className="rounded-xl bg-green-600 px-3 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
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
