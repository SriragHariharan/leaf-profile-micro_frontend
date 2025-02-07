import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { Loader2, AlertCircle, Heart, MessageSquare } from "lucide-react";
import { DEFAULT_PROFILE_IMAGE } from "../constants/constants";
import '../index.scss';

interface Post {
  id: string;
  imageURL?: string | null;
  content: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  user: {
    userID: string;
    username: string;
    profilepic?: string | null;
  };
}

const Post = () => {
  const location = useLocation();
  const postID = new URLSearchParams(location.search).get("postID");
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postID) {
      setError("Invalid Post ID");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:2000/api/v1/post/${postID}`)
      .then((resp) => {
        console.log(resp?.data?.data?.post)
        setPost(resp?.data?.data?.post);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err)
        setError(err.response?.data?.message || "Failed to fetch post");
        setLoading(false);
      });
  }, [postID]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 text-red-600 p-4 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-yellow-100 text-yellow-600 p-4 rounded-md flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Post not found.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto mt-8">
      {/* User Info */}
      <div className="flex items-center gap-4">
        <img
          src={post?.user?.profilepic || DEFAULT_PROFILE_IMAGE}
          alt={post.user.username}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-900 text-base md:text-lg">
            {post.user.username}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <p className="mt-3 text-gray-800 break-words text-base">{post.content}</p>

      {/* Post Image */}
      {post.imageURL && (
        <div className="mt-3">
          <img
            src={post.imageURL}
            alt="Post"
            className="w-full h-96 object-contain rounded-md"
          />
        </div>
      )}

      {/* Post Engagement */}
      <div className="mt-4 flex items-center justify-between text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Heart className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium">{post.likesCount} Likes</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">{post.commentsCount} Comments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
