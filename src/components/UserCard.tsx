import React from 'react';
import { DEFAULT_PROFILE_IMAGE } from '../constants/constants';
import { User } from '../interfaces/User.interface';
import { Link } from 'react-router';
import { designRecipes } from 'hostApp/designRecipes';




interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <Link to={"/view-profile/" + user?.userID} className={`${designRecipes.panel} flex items-center justify-between p-4 max-w-4xl`}>
      <div className="flex items-center space-x-4">
        <img
          src={user?.profilePicture || DEFAULT_PROFILE_IMAGE}
          alt={user?.username}
          className="w-14 h-14 rounded-full object-cover border border-ds-border-strong"
        />
        <div>
          <h3 className="font-semibold text-lg text-ds-text-secondary">{user?.username}</h3>
          {
            user?.description && (
              <p className="text-sm font-extralight text-ds-text-muted line-clamp-1">
                {user?.description}
              </p>
            )
          }
        </div>
      </div>
    </Link>
  );
}
