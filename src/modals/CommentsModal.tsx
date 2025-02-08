import React, { useEffect, useState } from 'react';
import { X, Send } from 'lucide-react';
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Comments</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img
                src={comment?.user?.profilepic ?? DEFAULT_PROFILE_IMAGE}
                alt={comment.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm">{comment?.user?.username}</h4>
                  <p className="text-gray-700 text-sm">{comment?.comment}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">{dayjs(comment?.createdAt)?.fromNow()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <div className="flex gap-3">
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-gray-50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button 
                onClick={handleAddComment}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
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
