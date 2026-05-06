import React, { useState } from 'react';
import { Image } from 'lucide-react';
import CreatePostModal from '../modals/CreatePostModal';
import { designRecipes } from 'hostApp/designRecipes';

import useStore from "hostApp/GlobalStore";
import { DEFAULT_PROFILE_IMAGE } from '../constants/constants';




const CreatePost: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { profilePic } = useStore();
  const profileImageSrc = profilePic === "null" ? DEFAULT_PROFILE_IMAGE : profilePic;

  return (
    <>
      <div
        className={`${designRecipes.panel} group mb-4 cursor-pointer bg-ds-surface-card p-4 transition-all duration-ds hover:-translate-y-0.5 hover:shadow-dsMd`}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center gap-3">
          <img
            src={profileImageSrc}
            alt="Profile"
            className="h-11 w-11 rounded-full object-cover ring-2 ring-ds-surface-card shadow-dsSm"
          />
          <div className="flex-1 rounded-full border border-ds-border-subtle bg-gradient-to-r from-ds-surface-muted to-ds-surface-card px-4 py-2.5 shadow-inner transition-colors group-hover:border-ds-border-strong">
            <p className="text-sm font-medium text-ds-text-muted">What&apos;s on your mind?</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-ds-brand-100 bg-ds-brand-50/70 p-2.5 text-ds-brand-600 transition-all hover:bg-ds-brand-100 hover:text-ds-brand-700 focus:outline-none focus:ring-2 focus:ring-ds-brand-500/30"
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