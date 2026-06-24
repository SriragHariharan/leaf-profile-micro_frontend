import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { designRecipes } from "@srirag/leaf-design-system"

const ReportModal = ({ isOpen, onClose, onSubmit }: any) => {
    const [issue, setIssue] = useState('fakeAccount');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('low');

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit({ issue, description, priority });
        // onClose();
    };

    return (
        <div className={designRecipes.modalOverlay}>
        <div className={designRecipes.modalContainer}>
            <div className={designRecipes.modalHeader}>
                <div className="flex items-center gap-2">
                    <div className="rounded-full bg-ds-state-dangerSoft p-2 text-ds-state-danger">
                        <AlertTriangle className="h-4 w-4" />
                    </div>
                    <h2 className="text-lg font-semibold text-ds-text-primary">Report User</h2>
                </div>
                <button onClick={onClose} className={designRecipes.iconButton}>
                    <X className="h-5 w-5" />
                </button>
            </div>
            <div className="space-y-4 p-5">
            <div>
                <label className="mb-1.5 block text-sm font-medium text-ds-text-secondary">Issue Type</label>
                <select
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className={designRecipes.inputBase}
                >
                <option value="fakeAccount">Fake Account</option>
                <option value="harassment">Harassment</option>
                <option value="spam">Spam</option>
                <option value="other">Other</option>
                </select>
            </div>
            <div>
                <label className="mb-1.5 block text-sm font-medium text-ds-text-secondary">Description</label>
                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${designRecipes.inputBase} resize-none`}
                />
            </div>
            <div>
                <label className="mb-1.5 block text-sm font-medium text-ds-text-secondary">Priority</label>
                <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={designRecipes.inputBase}
                >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                </select>
            </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-ds-border-subtle px-5 py-4">
            <button
                onClick={onClose}
                className={designRecipes.buttonSecondary}
            >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                className={`${designRecipes.statusDanger} px-4 py-2 justify-center`}
            >
                Submit Report
            </button>
            </div>
        </div>
        </div>
    );
};

export default ReportModal;