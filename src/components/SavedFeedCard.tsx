import { Bookmark } from 'lucide-react'
import React, { useState } from 'react'
import { DEFAULT_PROFILE_IMAGE } from '../constants/constants'
import { Link } from 'react-router'
import dayjs from 'dayjs'
import useAxiosInstance from '../axios/axiosInstance'
import { Toaster, showSuccessToast } from 'authMF/toastFunction';

interface SavedPosts {
    postID: string
    profilepic: string | null
    username: string
    createdAt: Date | string
    content: string
    imageURL: string | null
    userID: string
}

function SavedFeedCard({postID, profilepic, username, createdAt, content, imageURL, userID }: SavedPosts) {
    const axiosInstance = useAxiosInstance();
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleContent = () => {
        setIsExpanded(!isExpanded);
    };

    const handleUnsavePost = () => {
        axiosInstance.delete("../post/save/" + postID)
        .then(_resp => showSuccessToast("Post unsaved"))
        .catch(err => console.log(err?.response?.data?.message ?? "Unable to Unsave post"));
    }

  return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden pb-4">
            <Toaster />
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <Link to={"/view-profile/" + userID} className="flex items-center gap-3">
                <img
                  src={profilepic ?? DEFAULT_PROFILE_IMAGE}
                  alt={username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                    <h3 className="font-semibold text-gray-800">{username}</h3>
                    <p className="text-sm text-gray-500">
                        {dayjs(createdAt).format('MMMM D, YYYY h:mm A')}
                    </p>
                </div>
              </Link>
              <div className="relative group">
                <button
                    onClick={handleUnsavePost}
                    className="p-2 hover:bg-gray-300 rounded-full transition-colors"
                    title='Unsave post'
                >
                    <Bookmark className="w-5 h-5 text-red-500 " />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <p className="mt-3 p-4 text-gray-800 break-words text-sm max-w-full overflow-hidden whitespace-normal">
                {isExpanded ? content : `${content.substring(0, 200)}...`}
                {content.length > 200 && (
                <button onClick={toggleContent} className="text-blue-500 ml-1">
                    {isExpanded ? 'Read less' : 'Read more...'}
                </button>
                )}
            </p>

            {/* Post Image */}
            {
                imageURL && (
                    <img 
                        src={imageURL} 
                        alt="Post" 
                        className="w-screen h-96 object-contain"
                    />
                )
            }
        </div>
  )
}

export default SavedFeedCard