import React from "react";
import { X, AlertCircle } from "lucide-react";

interface ReportPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportPost: (reason: string, description: string) => void;
}

const ReportPostModal: React.FC<ReportPostModalProps> = ({ isOpen, onClose, reportPost }) => {
  const [reason, setReason] = React.useState("");
  const [description, setDescription] = React.useState("");

  const handleReportPost = () => {
    if (!reason) return;
    reportPost(reason, description);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-lg relative transition-all transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Report Post</h2>
        </div>

        {/* Reason Selection */}
        <p className="text-gray-600 text-sm mb-2">Select a reason for reporting:</p>
        <select
          className="w-full p-3 mb-4 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          <option value="">Select a reason</option>
          <option value="spam">Spam</option>
          <option value="adult_content">Adult content</option>
          <option value="irrelevant_content">Irrelevant content</option>
          <option value="other">Other</option>
        </select>

        {/* Description for "Other" */}
        {reason === "other" && (
          <textarea
            className="w-full p-3 mb-4 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the reason for reporting..."
          />
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            className={`w-full p-3 rounded-xl font-medium text-white transition-all ${
              reason
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={handleReportPost}
            disabled={!reason}
          >
            Report Post
          </button>
          <button
            className="w-full p-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportPostModal;
