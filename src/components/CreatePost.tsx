import React, { useState } from 'react';
import { Image } from 'lucide-react';
import CreatePostModal from '../modals/CreatePostModal';

import useStore from "hostApp/GlobalStore";
import { DEFAULT_PROFILE_IMAGE } from '../constants/constants';




const CreatePost: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { profilePic } = useStore();
  const profileImageSrc = profilePic === "null" ? DEFAULT_PROFILE_IMAGE : profilePic;

  return (
    <>
      <div
        className="group mb-4 cursor-pointer rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center gap-3">
          <img
            src={profileImageSrc}
            alt="Profile"
            className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-sm"
          />
          <div className="flex-1 rounded-full border border-gray-200 bg-gradient-to-r from-gray-50 to-white px-4 py-2.5 shadow-inner transition-colors group-hover:border-gray-300">
            <p className="text-sm font-medium text-gray-500">What&apos;s on your mind?</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-green-100 bg-green-50/70 p-2.5 text-green-600 transition-all hover:bg-green-100 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500/30"
          >
            <Image size={20} />
          </button>
        </div>
      </div>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default CreatePost;