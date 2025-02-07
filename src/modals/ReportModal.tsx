import React, { useState } from 'react';

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Report User</h2>
            <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Issue Type</label>
                <select
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                <option value="fakeAccount">Fake Account</option>
                <option value="harassment">Harassment</option>
                <option value="spam">Spam</option>
                <option value="other">Other</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                </select>
            </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
            <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
                Cancel
            </button>
            <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
                Submit Report
            </button>
            </div>
        </div>
        </div>
    );
};

export default ReportModal;