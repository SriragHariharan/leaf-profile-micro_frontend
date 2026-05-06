import React, { useEffect, useState } from 'react';
import { X, Image, Loader, Sparkles } from 'lucide-react';
import useAxiosInstance from '../axios/axiosInstance';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { showErrorToast, Toaster } from 'authMF/toastFunction';

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const axiosInstance = useAxiosInstance();

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleAddPost = () => {
    setIsLoading(true);
    console.log(content, selectedFile);
    const formData = new FormData();
    formData.append('content', content);
    if (selectedFile) {
      formData.append('picture', selectedFile);
    }

    axiosInstance.post("../post", formData, 
      { headers: { "Content-Type": "multipart/form-data" } }
    ).then(_resp => {
      onClose();
    })
    .catch(_err => showErrorToast("Unable to add post"))
    .finally(() => {
      setIsLoading(false);
    });
  };

  const isPostDisabled = isLoading || (!content.trim() && !selectedFile);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]">
      <Toaster />
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-50 p-2 text-green-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Create Post</h3>
              <p className="text-xs text-gray-500">Share an update with your network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <textarea
            className="h-36 w-full resize-none rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="file-upload"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="flex cursor-pointer items-center justify-between rounded-xl border border-green-100 bg-green-50/60 px-4 py-3 transition-colors hover:bg-green-50"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-green-700">
              <Image size={18} />
              Add Photo
            </span>
            <span className="text-xs text-green-600">JPG, PNG, WEBP</span>
          </label>

          {selectedFile && previewUrl && (
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="truncate text-sm font-medium text-gray-700">{selectedFile.name}</p>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="rounded-full bg-white p-1.5 text-red-500 shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-red-50"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="relative h-56 w-full overflow-hidden rounded-lg border border-gray-100">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-50 py-2 text-sm text-gray-600">
              <Loader size={16} className="animate-spin" />
              Posting your update...
            </div>
          )}

          <button
            className="flex w-full items-center justify-center rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
            onClick={handleAddPost}
            disabled={isPostDisabled}
          >
            {isLoading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;