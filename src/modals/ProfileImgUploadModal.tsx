import React, { useState, ChangeEvent } from "react";
import useAxiosInstance from "../axios/axiosInstance";
import useStore from "hostApp/GlobalStore";
import { showErrorToast, showSuccessToast } from "authMF/toastFunction";
import { ImagePlus, Loader2, X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-green-50 p-2 text-green-600">
              <ImagePlus className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Upload Profile Image</h2>
          </div>
          <button onClick={closeModal} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 p-5">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-2.5 text-sm text-gray-700 outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-green-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-green-700 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
          />
          {selectedImage && (
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <p className="text-sm font-semibold text-gray-700">Preview</p>
              <img
                src={selectedImage}
                alt="Preview"
                className="mt-2 h-56 w-full rounded-lg object-cover"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-4">
          <button
            onClick={closeModal}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="inline-flex items-center rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
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