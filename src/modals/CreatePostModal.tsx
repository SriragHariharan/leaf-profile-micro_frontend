import React, { useEffect, useState } from 'react';
import { X, Image, Loader, Sparkles } from 'lucide-react';
import useAxiosInstance from '../axios/axiosInstance';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { showErrorToast, Toaster } from 'authMF/toastFunction';
import { designRecipes } from 'hostApp/designRecipes';

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
    <div className={designRecipes.modalOverlay}>
      <Toaster />
      <div className={`${designRecipes.modalContainer} max-w-2xl`}>
        <div className={designRecipes.modalHeader}>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-ds-brand-50 p-2 text-ds-brand-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-ds-text-primary">Create Post</h3>
              <p className="text-xs text-ds-text-muted">Share an update with your network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={designRecipes.iconButton}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <textarea
            className={`${designRecipes.inputBase} h-36 resize-none py-3`}
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
            className="flex cursor-pointer items-center justify-between rounded-xl border border-ds-brand-100 bg-ds-brand-50/60 px-4 py-3 transition-colors hover:bg-ds-brand-50"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-ds-brand-700">
              <Image size={18} />
              Add Photo
            </span>
            <span className="text-xs text-ds-brand-600">JPG, PNG, WEBP</span>
          </label>

          {selectedFile && previewUrl && (
            <div className="rounded-xl border border-ds-border-subtle bg-ds-surface-card p-3">
              <div className="mb-2 flex items-center justify-between">
                <p className="truncate text-sm font-medium text-ds-text-secondary">{selectedFile.name}</p>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="rounded-full bg-ds-surface-card p-1.5 text-ds-state-danger shadow-dsSm ring-1 ring-ds-border-subtle transition-colors hover:bg-ds-state-dangerSoft"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="relative h-56 w-full overflow-hidden rounded-lg border border-ds-border-subtle">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-ds-surface-muted py-2 text-sm text-ds-text-secondary">
              <Loader size={16} className="animate-spin" />
              Posting your update...
            </div>
          )}

          <button
            className={`${designRecipes.buttonPrimary} flex w-full items-center justify-center py-2.5 disabled:cursor-not-allowed`}
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