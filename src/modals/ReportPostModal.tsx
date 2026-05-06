import React from "react";
import { X, AlertCircle } from "lucide-react";
import { designRecipes } from "hostApp/designRecipes";

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
      className={designRecipes.modalOverlay}
      onClick={onClose}
    >
      <div
        className={`${designRecipes.modalContainer} relative max-w-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={designRecipes.modalHeader}>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-ds-state-dangerSoft p-2 text-ds-state-danger">
              <AlertCircle className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-ds-text-primary">Report Post</h2>
          </div>
          <button
            className={designRecipes.iconButton}
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <p className="mb-1.5 text-sm font-medium text-ds-text-secondary">Select a reason for reporting</p>
            <select
              className={designRecipes.inputBase}
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
              className={`${designRecipes.inputBase} resize-none`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the reason for reporting..."
              rows={4}
            />
          )}

          <div className="flex gap-3">
            <button
              className={`${designRecipes.buttonSecondary} w-full`}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="w-full rounded-xl bg-ds-state-danger p-2.5 text-sm font-semibold text-ds-text-inverse transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
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
