import React, { useEffect, useState } from 'react';
import useAxiosInstance from '../axios/axiosInstance';
import FeedCard from './FeedCard';
import { showErrorToast, showSuccessToast } from 'authMF/toastFunction';
import { Post } from '../types';

interface ProfileFeedProps {
    userID: string | undefined;
    self: boolean;
}

function ProfileFeed({ userID, self }: ProfileFeedProps) {
    const userid = userID || "self";

    const axiosInstance = useAxiosInstance();

    const [posts, setPosts] = useState<any>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const fetchPosts = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await axiosInstance.get(`../feed/timeline/${userid}/?page=${page}`);
            const data = response.data?.data?.timeline; 

            if (data.length > 0) {
                setPosts((prevPosts: Post[]) => [...prevPosts, ...data]);
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

    //initial fetch
    useEffect(() => { fetchPosts() }, [userid, self]);

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
    }, [loading, hasMore, page, userid]);


    /* delete a post */
    const handleDeletePost = (postID: string) => {
        console.log("deleting the post with ID: " + postID)
        console.log(posts.filter(post => post?.id !== postID ));
        axiosInstance.delete(`../post/${postID}/delete`)
        .then(_resp => {
            setPosts(posts.filter(post => post?.id !== postID ));
            showSuccessToast("Post deleted")
        })
        .catch(_err => showErrorToast("Unable to delete post"));
    }

    return (
        <div className="mx-auto">
            {posts.map(post => (
                <FeedCard
                    key={post?.id}
                    username={post?.User?.username}
                    userImage={post?.User?.profilePic}
                    content={post?.content}
                    image={post?.imageURL}
                    postID={post?.postID}
                    timestamp={post?.createdAt}
                    type={self ? "self" : "common"}
                    handleDeletePost={handleDeletePost}
                    isLiked={post?.Timelines[0]?.isLiked}
                />
            ))}

            {loading && (
                <p className="text-center text-gray-500 py-4 animate-pulse">
                    Loading...
                </p>
            )}

            {!hasMore && (
                <div className="mt-6 p-4 bg-gray-100 text-gray-600 rounded-lg text-center">
                    <p>No more posts to load</p>
                </div>
            )}
        </div>
    );
}

export default ProfileFeed;
