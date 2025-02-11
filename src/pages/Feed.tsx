import React, { useState, useEffect } from 'react';
import '../index.scss';
import CreatePost from '../components/CreatePost';
import FeedCard from '../components/FeedCard';
import useAxiosInstance from '../axios/axiosInstance';
import { DEFAULT_PROFILE_IMAGE } from '../constants/constants';

// Define the type for a post
interface Post {
  postID: string;
  content: string;
  imageURL: string | null;
  owner?: {
    username: string;
    profilePic?: string;
  };
}

function Feed() {
  const axiosInstance = useAxiosInstance();

  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Function to fetch posts
  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get<Post[]>(`../feed/${page}`);
      const data = response.data?.data?.feeds; 
      console.log(data);

      if (data.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...data]);
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        fetchPosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, page]);

  // Refresh feed function
  const refreshFeed = () => {
    setPosts([]); // Clear existing posts
    setPage(1); // Reset page to 1
    setHasMore(true); // Reset hasMore to true
    fetchPosts(); // Fetch posts again
  };

  console.log(posts[0], "::: final post");

  return (
    <div className="flex items-start justify-center min-h-screen">
      <div className="max-w-3xl w-full lg:mt-10">
        <CreatePost />
        
        {/* Refresh Button */}
        <button 
          onClick={refreshFeed} 
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Refresh Feed
        </button>

        {posts.map((post) => (
          <FeedCard
            key={post.postID} 
            content={post?.content} 
            image={post?.imageURL} 
            username={post?.owner?.username}
            userImage={post?.owner?.profilePic || DEFAULT_PROFILE_IMAGE}
            postID={post?.postID}
            timestamp={post?.createdAt}
            type={"common"}
            isLiked={post?.isLiked}
          />
        ))}
        
        {loading && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        )}
        
        {!hasMore && (
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-md text-center">
              <p className="text-gray-700">No more posts to load.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feed;