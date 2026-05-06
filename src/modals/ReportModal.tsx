import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]">
        <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-2">
                    <div className="rounded-full bg-red-50 p-2 text-red-600">
                        <AlertTriangle className="h-4 w-4" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Report User</h2>
                </div>
                <button onClick={onClose} className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                    <X className="h-5 w-5" />
                </button>
            </div>
            <div className="space-y-4 p-5">
            <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Issue Type</label>
                <select
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50/70 p-2.5 text-sm text-gray-800 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
                >
                <option value="fakeAccount">Fake Account</option>
                <option value="harassment">Harassment</option>
                <option value="spam">Spam</option>
                <option value="other">Other</option>
                </select>
            </div>
            <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full resize-none rounded-xl border border-gray-200 bg-gray-50/70 p-2.5 text-sm text-gray-800 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
                />
            </div>
            <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Priority</label>
                <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50/70 p-2.5 text-sm text-gray-800 outline-none transition-all focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-500/20"
                >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                </select>
            </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4">
            <button
                onClick={onClose}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
                Submit Report
            </button>
            </div>
        </div>
        </div>
    );
};

export default ReportModal;