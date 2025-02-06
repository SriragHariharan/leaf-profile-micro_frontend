import React, { useState, ChangeEvent } from "react";
import useAxiosInstance from "../axios/axiosInstance";
import useStore from "hostApp/GlobalStore";

interface ModalProps {
  closeModal: () => void;
}

const ProfileImgUploadModal: React.FC<ModalProps> = ({ closeModal }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
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
    const formData = new FormData();
    formData.append("picture", file);

    // Make the API call
    axiosInstance.post("/profile/picture/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(resp => {
      console.log(resp.data?.data?.url);
      window.alert("Profile picture updated successfully")
      setProfilePic(resp.data?.data?.url)
    })
    .catch(err => console.log(err));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h2 className="text-lg font-semibold">Upload Profile Image</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        <div className="p-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full px-4 py-2 mb-4 text-sm text-gray-700 border rounded focus:outline-none"
          />
          {selectedImage && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700">Preview:</p>
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-auto mt-2 rounded-md"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end px-4 py-2 border-t">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 ml-2 text-sm text-white bg-green-500 rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileImgUploadModal;
