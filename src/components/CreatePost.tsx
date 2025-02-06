import React, { useState } from 'react';
import { Image } from 'lucide-react';
import CreatePostModal from '../modals/CreatePostModal';

import useStore from "hostApp/GlobalStore";
import { DEFAULT_PROFILE_IMAGE } from '../constants/constants';




const CreatePost: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { profilePic } = useStore();

  return (
    <>
      <div
        className="bg-white rounded-lg p-4 mb-4 shadow cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center space-x-4">
          <img
            src={ profilePic === "null" ? DEFAULT_PROFILE_IMAGE : profilePic }
            // alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 bg-gray-100 rounded-full py-2 px-4">
            <p className="text-gray-500">What's on your mind</p>
          </div>
          <button className="text-green-600 hover:bg-green-50 p-2 rounded-full">
            <Image size={20} />
          </button>
        </div>
      </div>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default CreatePost;