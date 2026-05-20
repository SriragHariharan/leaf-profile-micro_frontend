import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import axios from "axios";
import { Loader2, AlertCircle, Heart, MessageSquare } from "lucide-react";
import { DEFAULT_PROFILE_IMAGE, postDetailsUrl } from "../constants/constants";
import '../index.scss';
import { designRecipes } from "hostApp/designRecipes";

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
      .get(postDetailsUrl(postID))
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
        <Loader2 className="h-8 w-8 animate-spin text-ds-brand-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className={`${designRecipes.panel} flex items-center gap-2 bg-ds-state-dangerSoft p-4 text-ds-state-danger`}>
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className={`${designRecipes.panel} flex items-center gap-2 bg-ds-state-warningSoft p-4 text-ds-state-warning`}>
          <AlertCircle className="h-5 w-5" />
          Post not found.
        </div>
      </div>
    );
  }

  return (
    <div className={`${designRecipes.panel} mx-auto mt-8 max-w-2xl p-6`}>
      {/* User Info */}
      <div className="flex items-center gap-4">
        <img
          src={post?.user?.profilepic || DEFAULT_PROFILE_IMAGE}
          alt={post.user.username}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-ds-text-primary text-base md:text-lg">
            {post.user.username}
          </h3>
          <p className="text-sm text-ds-text-muted">
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <p className="mt-3 text-ds-text-primary break-words text-base">{post.content}</p>

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
      <div className="mt-4 flex items-center justify-between text-ds-text-secondary">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Heart className="h-5 w-5 text-ds-state-danger" />
            <span className="text-sm font-medium">{post.likesCount} Likes</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-5 w-5 text-ds-state-info" />
            <span className="text-sm font-medium">{post.commentsCount} Comments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
