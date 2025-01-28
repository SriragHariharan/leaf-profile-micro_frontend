import React from 'react';
import '../index.scss';
import CreatePost from '../components/CreatePost';

function Feed() {
  return (
    <div className="flex items-start justify-center min-h-screen">
      <div className="max-w-3xl w-full lg:mt-10">
        <CreatePost />
      </div>
    </div>
  );
}

export default Feed;
