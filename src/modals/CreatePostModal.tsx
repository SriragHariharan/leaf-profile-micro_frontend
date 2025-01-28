import React, { useState } from 'react';
import { X, Image } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
            multiple
            accept="image/*,video/*"
            className="hidden"
            id="file-upload"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="flex items-center space-x-2 text-green-600 cursor-pointer"
          >
            <Image size={20} />
            <span>Add Photos/Videos</span>
          </label>
        </div>

        {/* Preview Section */}
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden border">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() =>
                    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
                  }
                  className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-1 shadow"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Post Button */}
        <button
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          onClick={() => {
            // Handle post creation
            onClose();
          }}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePostModal;
