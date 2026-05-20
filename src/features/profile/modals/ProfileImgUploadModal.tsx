import React, { useState, ChangeEvent } from "react";
import useAxiosInstance from '../../../axios/axiosInstance';
import useStore from "hostApp/GlobalStore";
import { showErrorToast, showSuccessToast } from "authMF/toastFunction";
import { ImagePlus, Loader2, X } from "lucide-react";
import { designRecipes } from "hostApp/designRecipes";

interface ModalProps {
  closeModal: () => void;
}

const ProfileImgUploadModal: React.FC<ModalProps> = ({ closeModal }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const axiosInstance = useAxiosInstance();
  const { setProfilePic } = useStore();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // For preview
      setFile(file); // For uploading
    }
  };

  const handleSave = async () => {
    if (!file) {
      alert("Please select an image to upload.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("picture", file);

    // Make the API call
    axiosInstance.post("/profile/picture/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(resp => {
      console.log(resp.data?.data?.url);
      showSuccessToast("Profile picture updated successfully")
      setProfilePic(resp.data?.data?.url)
      closeModal(); // Close the modal after successful update
    })
    .catch(_err => showErrorToast("Unable to update profile picture"))
    .finally(() => setIsLoading(false));
  };

  return (
    <div className={designRecipes.modalOverlay}>
      <div className={designRecipes.modalContainer}>
        <div className={designRecipes.modalHeader}>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-ds-brand-50 p-2 text-ds-brand-600">
              <ImagePlus className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-ds-text-primary">Upload Profile Image</h2>
          </div>
          <button onClick={closeModal} className={designRecipes.iconButton}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-5">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full rounded-xl border border-ds-border-subtle bg-ds-surface-muted/70 px-4 py-2.5 text-sm text-ds-text-secondary outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-ds-brand-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ds-brand-700 focus:border-ds-brand-500 focus:bg-ds-surface-card focus:ring-2 focus:ring-ds-brand-500/20"
          />
          {selectedImage && (
            <div className="rounded-xl border border-ds-border-subtle bg-ds-surface-card p-3">
              <p className="text-sm font-semibold text-ds-text-secondary">Preview</p>
              <img
                src={selectedImage}
                alt="Preview"
                className="mt-2 h-56 w-full rounded-lg object-cover"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-ds-border-subtle px-5 py-4">
          <button
            onClick={closeModal}
            className={designRecipes.buttonSecondary}
          >
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`${designRecipes.buttonPrimary} inline-flex items-center px-4 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </div>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileImgUploadModal;