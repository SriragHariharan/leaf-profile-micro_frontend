import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreVertical, Bookmark, Flag, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import CommentsModal from '../modals/CommentsModal';
import useAxiosInstance from '../axios/axiosInstance';
import { showSuccessToast, Toaster, showErrorToast } from 'authMF/toastFunction';
import ReportPostModal from '../modals/ReportPostModal';
import { DEFAULT_PROFILE_IMAGE } from '../constants/constants';

interface FeedCardProps {
  postID: string;
  username: string;
  userImage: string | undefined | null;
  content: string;
  timestamp: string;
  image?: string | null;
  isLiked: boolean;
  isCommented: boolean;
}

export default function FeedCard({ username, userImage, content, timestamp, image, postID }: FeedCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0)
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  /* get interactions */
  const axiosInstance = useAxiosInstance();
  axiosInstance.get("../post/interaction/" + postID)
  .then(resp => {
    setLikes(Number(resp?.data?.data?.likesCount));
    setComments(Number(resp?.data?.data?.commentsCount));
  })
  .catch(err => console.log(err))

  /* share a post(copy link to clipboard) */
  const handleShare = () => {
    const shareableLink = `${window.location.origin}/post?postID=${postID}`;
    navigator.clipboard.writeText(shareableLink)
      .then(() => {
        showSuccessToast('Link copied to clipboard!');
      })
      .catch(() => {
        showErrorToast('Failed to copy link.');
      });
  };

  /* report post modal */
   const [showReportModal, setShowReportModal] = useState(false);

  const handleReportPost = (reason: string, description: string) => {
    axiosInstance.post("../post/report/" + postID, {reason, description})
      .then(_ => {
        showSuccessToast("Post reported");
        setShowReportModal(false);
      })
      .catch(_ =>showErrorToast("Unable to report post"))
  };

  /* save the post */
  const handleSavePost = () => {
    axiosInstance.post("../post/save/" + postID)
      .then(_ => {
        showSuccessToast("Post saved");
        setShowReportModal(false);
      })
      .catch(err => showErrorToast(err?.response?.data?.error?.message));
  }

  return (
    <>
      <Toaster />
      <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between flex-wrap">
            <div className="flex items-center gap-3">
              <img
                src={userImage ?? DEFAULT_PROFILE_IMAGE}
                alt={username}
                className="w-12 h-12 rounded-full object-cover"  // Fixed size for profile image
              />
              <div>
                <h3 className="font-semibold text-gray-900 text-base md:text-lg">{username}</h3>
                <p className="text-sm text-gray-500">{timestamp}</p>
              </div>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                  <button onClick={handleSavePost} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    Save post
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Hide from timeline
                  </button>
                  <button onClick={() => setShowReportModal(true)} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                    <Flag className="h-4 w-4" />
                    Report post
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="mt-3 text-gray-800 break-words text-sm max-w-full overflow-hidden whitespace-normal">
            {isExpanded ? content : `${content.substring(0, 200)}...`}
            {content.length > 200 && (
              <button onClick={toggleContent} className="text-blue-500 ml-1">
                {isExpanded ? 'Read less' : 'Read more...'}
              </button>
            )}
          </p>
          
          {image && (
            <div className="mt-3 -mx-4">
              <img 
                src={image} 
                alt="Post" 
                className="w-screen h-96 object-contain"
              /> 
            </div>
          )}

          <div className="mt-4 flex items-center justify-between pt-3 border-t flex-wrap">
            <button 
              onClick={handleLike}
              className="flex items-center gap-2 text-sm hover:bg-gray-50 px-3 py-2 rounded-lg"
            >
              <Heart 
                className={clsx(
                  "h-5 w-5 transition-colors",
                  isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
                )} 
              />
              <span>{likes} Likes</span>
            </button>
            
            <button 
              onClick={() => setShowComments(true)}
              className="flex items-center gap-2 text-sm hover:bg-gray-50 px-3 py-2 rounded-lg text-gray-600"
            >
              <MessageCircle 
                className={clsx(
                  "h-5 w-5",
                "text-gray-600"
                )}
              />
              <span>{comments} Comment</span>
            </button>
            
            <button onClick={handleShare} className="flex items-center gap-2 text-sm hover:bg-gray-50 px-3 py-2 rounded-lg text-gray-600">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>
        </ div>
      </div>

      <CommentsModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        postId={postID}
      />

      <ReportPostModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportPost={handleReportPost}
      />
    </>
  );
}
