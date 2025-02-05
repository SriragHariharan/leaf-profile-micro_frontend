import React from 'react';
import { DEFAULT_PROFILE_IMAGE } from '../constants/constants';
import { Hourglass, UserMinus, UserPlus } from 'lucide-react';
import { User } from '../interfaces/User.interface';
// import { UserPlus, UserMinus } from 'lucide-react';




interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="bg-white p-4 shadow-md border border-gray-200 flex items-center justify-between w-[768px]">
      <div className="flex items-center space-x-4">
        <img
          src={user.profilePicture || DEFAULT_PROFILE_IMAGE}
          alt={user.username}
          className="w-14 h-14 rounded-full object-cover border border-gray-300"
        />
        <div>
          <h3 className="font-semibold text-lg text-gray-500">{user.username}</h3>
          {
            user.description && (
              <p className="text-sm font-extralight text-gray-400 line-clamp-1">
                {user.description}
              </p>
            )
          }
        </div>
      </div>

      <button
        className={`p-3 rounded-lg flex items-center justify-center transition-colors duration-200 ${
          user.isFriend
            ? 'text-red-600 bg-red-50 hover:bg-red-100'
            : user.friendStatus === 'pending'
              ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
              : 'text-green-600 bg-green-50 hover:bg-green-100'
        }`}
        title={
          user.isFriend
            ? 'Unfriend'
            : user.friendStatus === 'pending'
              ? 'Friend Request Sent'
              : 'Add Friend'
        }
      >
        {user.isFriend
          ? <UserMinus size={24} />
          : user.friendStatus === 'pending'
            ? <Hourglass size={24} />
            : <UserPlus size={24} />
        }
      </button>
    </div>
  );
}
