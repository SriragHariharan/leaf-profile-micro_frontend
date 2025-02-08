import '../index.scss';
import React, { useState } from 'react';
import { Search, Bookmark } from 'lucide-react';
import useAxiosInstance from '../axios/axiosInstance';
import FeedCard from '../components/FeedCard';
import SavedFeedCard from '../components/SavedFeedCard';
import { Toaster, showErrorToast } from 'authMF/toastFunction';

type User = {
  userID: string;
  username: string;
  profilepic?: string;
};

type Post = {
  id: string;
  content: string;
  imageURL?: string;
  createdAt: string;
  user: User;
  userID: string
  postID: string
  post: {
    content: string,
    imageURL: string | null
    createdAt: Date | string
  }
};

function SearchPost() {
    const axiosInstance = useAxiosInstance();
    const [searchQuery, setSearchQuery] = useState("");
    const [showSaved, setShowSaved] = useState(false); // State to toggle between saved posts and search results
    const [searchedPosts, setSearchedPosts] = useState<Post[]>([]);
    const [savedPosts, setSavedPosts] = useState<Post[]>([]); // State to store saved posts

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        console.log(searchQuery);
        axiosInstance.post("../post/search?query=" + searchQuery)
            .then(resp => {
                setSearchedPosts(resp?.data?.data?.posts);
                setShowSaved(false); // Show search results
            })
            .catch(_err => showErrorToast("Unable to search for posts"));
    };

    const handleSavedPosts = () => {
        axiosInstance.get("../post/save")
        .then(resp => {
            setSavedPosts(resp?.data?.data?.posts);
            setShowSaved(true);
        })
        .catch(err => showErrorToast(err?.response?.data?.message ?? "Unable to save post"));
    };

    return (
        <div>
            <Toaster />
            {/* Post search bar */}
            <div className="sticky top-0 bg-white shadow-sm md:max-w-4xl m-auto">
                <div className="mx-auto px-4 py-3">
                    <div className="flex items-center gap-3">
                        {/* Search form */}
                        <form onSubmit={handleSearch} className="relative flex-1 flex">
                            <input
                                type="text"
                                placeholder="Search posts..."
                                className="w-full pl-10 pr-16 py-2 rounded-full border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                onClick={handleSearch}
                                type="submit"
                                className="absolute right-0 flex h-full bg-green-300 text-white rounded-full text-sm font-medium p-4 items-center"
                            >
                                <Search className="text-black w-5 h-5" />
                            </button>
                        </form>

                        {/* Saved posts button */}
                        <button
                            onClick={handleSavedPosts}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full bg-green-300`}
                            title="Saved posts"
                        >
                            <Bookmark className="w-5 h-5" />
                            <span className="hidden sm:inline">Saved</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Search results or saved posts */}
            <div className="md:max-w-4xl m-auto mt-6 px-4">
                {showSaved ? (
                    // Show saved posts in SavedFeedCard
                    savedPosts?.length > 0 ? (
                        savedPosts.map((post) => (
                            <SavedFeedCard
                                key={post?.id}
                                postID={post?.postID}
                                username={post?.user?.username}
                                userImage={post?.user?.profilepic}
                                content={post?.post?.content}
                                imageURL={post?.post?.imageURL}
                                createdAt={post?.post?.createdAt}
                                userID={post?.userID}
                            />
                        ))
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-gray-500">No saved posts found.</p>
                        </div>
                    )
                ) : (
                    // Show search results in FeedCard
                    searchedPosts?.length > 0 ? (
                        searchedPosts.map((post) => (
                            <FeedCard
                                key={post?.id}
                                postID={post?.id}
                                username={post?.user?.username}
                                userImage={post?.user?.profilepic}
                                content={post?.content}
                                image={post?.imageURL}
                                timestamp={post?.createdAt}
                            />
                        ))
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-gray-500">No results found.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default SearchPost;