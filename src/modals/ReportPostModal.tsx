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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-red-50 p-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Report Post</h2>
          </div>
          <button
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-700">Select a reason for reporting</p>
            <select
              className="w-full rounded-xl border border-gray-200 bg-gray-50/70 p-2.5 text-sm text-gray-900 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Select a reason</option>
              <option value="spam">Spam</option>
              <option value="adult_content">Adult content</option>
              <option value="irrelevant_content">Irrelevant content</option>
              <option value="other">Other</option>
            </select>
          </div>

          {reason === "other" && (
            <textarea
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/70 p-3 text-sm text-gray-900 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the reason for reporting..."
              rows={4}
            />
          )}

          <div className="flex gap-3">
            <button
              className="w-full rounded-xl border border-gray-200 p-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="w-full rounded-xl bg-red-600 p-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
              onClick={handleReportPost}
              disabled={!reason}
            >
              Report Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPostModal;
