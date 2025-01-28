import React from 'react';
import { UserPlus, UserMinus } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  isFriend: boolean;
  description: string;
}


interface UserCardProps {
  user: User;
  onToggleFriend: (userId: string) => void;
}

export default function UserCard({ user, onToggleFriend }: UserCardProps) {
  return (
    <div className="bg-white p-4 shadow-md border border-gray-200 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-14 h-14 rounded-full object-cover border border-gray-300"
        />
        <div>
          <h3 className="font-semibold text-lg text-gray-500">{user.name}</h3>
          <p className="text-sm font-extralight text-gray-400 line-clamp-1">
            {user.description || 'No description available'}
          </p>
        </div>
      </div>
      <button
        onClick={() => onToggleFriend(user.id)}
        className={`p-3 rounded-lg flex items-center justify-center transition-colors duration-200 ${
          user.isFriend
            ? 'text-red-600 bg-red-50 hover:bg-red-100'
            : 'text-green-600 bg-green-50 hover:bg-green-100'
        }`}
      >
        {user.isFriend ? <UserMinus size={24} /> : <UserPlus size={24} />}
      </button>
    </div>
  );
}
