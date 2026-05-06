import '../index.scss';
import React, { useState } from 'react';
import { Search, Bookmark } from 'lucide-react';
import useAxiosInstance from '../axios/axiosInstance';
import FeedCard from '../components/FeedCard';
import SavedFeedCard from '../components/SavedFeedCard';
import { Toaster, showErrorToast } from 'authMF/toastFunction';
import { designRecipes } from 'hostApp/designRecipes';

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
            <div className="sticky top-0 bg-ds-surface-card shadow-dsSm md:max-w-4xl m-auto">
                <div className="mx-auto px-4 py-3">
                    <div className="flex items-center gap-3">
                        {/* Search form */}
                        <form onSubmit={handleSearch} className="relative flex-1 flex">
                            <input
                                type="text"
                                placeholder="Search posts..."
                                className={`${designRecipes.inputBase} rounded-full py-2 pl-10 pr-16`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                onClick={handleSearch}
                                type="submit"
                                className={`${designRecipes.buttonPrimary} absolute right-0 flex h-full items-center rounded-full p-4 text-sm font-medium`}
                            >
                                <Search className="text-ds-text-primary w-5 h-5" />
                            </button>
                        </form>

                        {/* Saved posts button */}
                        <button
                            onClick={handleSavedPosts}
                            className={`${designRecipes.buttonPrimary} flex items-center gap-2 rounded-full px-4`}
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
                            <FeedCard
                                key={post?.id}
                                postID={post?.postID}
                                username={post?.user?.username}
                                userImage={post?.user?.profilepic}
                                content={post?.post?.content}
                                image={post?.post?.imageURL}
                                createdAt={post?.post?.createdAt}
                                userID={post?.userID}
                                type='save'
                            />
                        ))
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-ds-text-muted">No saved posts found.</p>
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
                                type={"common"}
                            />
                        ))
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-ds-text-muted">No results found.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default SearchPost;