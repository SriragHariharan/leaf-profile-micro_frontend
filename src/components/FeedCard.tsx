import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreVertical, Bookmark, Flag, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';
import CommentsModal from './CommentsModal';

interface FeedCardProps {
  id: string;
  username: string;
  userImage: string;
  content: string;
  timestamp: string;
  image?: string;
}

export default function FeedCard({ id, username, userImage, content, timestamp, image }: FeedCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={userImage}
                alt={username}
                className="w-12 h-12 rounded-full object-cover"  // Fixed size for profile image
              />
              <div>
                <h3 className="font-semibold text-gray-900">{username}</h3>
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    Save post
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Hide from timeline
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                    <Flag className="h-4 w-4" />
                    Report post
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="mt-3 text-gray-800">{content}</p>
          
          {image && (
            <div className="mt-3 -mx-4">
              <img src={image} alt="Post" className="w-full h-96 object-contain" /> 
            </div>
          )}

          <div className="mt-4 flex items-center justify-between pt-3 border-t">
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
              <MessageCircle className="h-5 w-5" />
              <span>Comment</span>
            </button>
            
            <button className="flex items-center gap-2 text-sm hover:bg-gray-50 px-3 py-2 rounded-lg text-gray-600">
              <Share2 className="h-5 w-5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      <CommentsModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        postId={id}
      />
    </>
  );
}
