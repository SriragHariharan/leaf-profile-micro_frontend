import React, { useState } from 'react';
import { X, Image, Loader } from 'lucide-react'; // Import Loader from lucide-react
import useAxiosInstance from '../axios/axiosInstance';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { showSuccessToast, showErrorToast, Toaster } from 'authMF/toastFunction';

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const axiosInstance = useAxiosInstance();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleAddPost = () => {
    setIsLoading(true); // Set loading to true
    console.log(content, selectedFile);
    const formData = new FormData();
    formData.append('content', content);
    if (selectedFile) {
      formData.append('picture', selectedFile);
    }

    axiosInstance.post("../post", formData, 
      { headers: { "Content-Type": "multipart/form-data" } }
    ).then(_resp => {
      showSuccessToast("Post added successfully");
      onClose(); // Close the modal after successful post
    })
    .catch(_err => showErrorToast("Unable to add post"))
    .finally(() => {
      setIsLoading(false); // Reset loading state
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Toaster />
      <div className="bg-white rounded-lg w-full max-w-xl p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Create Post</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Textarea */}
        <textarea
          className="w-full p-4 border rounded-lg mb-4 h-32 resize-none"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* File Input */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id="file-upload"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="flex items-center space-x-2 text-green-600 cursor-pointer"
          >
            <Image size={20} />
            <span>Add Photo</span>
          </label>
        </div>

        {/* Preview Section */}
        {selectedFile && (
          <div className="mb-4">
            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="preview"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedFile(null)}
                className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-1 shadow"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center mb-4">
            <Loader size={24} className="animate-spin" />
          </div>
        )}

        {/* Post Button */}
        <button
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          onClick={handleAddPost}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default CreatePostModal;