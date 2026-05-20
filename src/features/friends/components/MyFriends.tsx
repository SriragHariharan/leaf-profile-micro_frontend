import React from 'react';
import { User } from '../../../interfaces/User.interface';
import UserCard from './UserCard';
import { designRecipes } from 'hostApp/designRecipes';

interface MyFriendsProps {
  users: User[];
  loading?: boolean;
}

function MyFriends({ users, loading = false }: MyFriendsProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-ds-border-subtle border-t-ds-brand-600" />
      </div>
    );
  }

  return (
    <div className={`${designRecipes.panel} divide-y divide-ds-border-subtle`}>
      {users.length > 0 ? (
        users.map((user) => (
          <UserCard user={user?.friendProfile as User} key={user?.userID} />
        ))
      ) : (
        <p className="py-10 text-center text-sm text-ds-text-muted">
          No friends yet. Find people to connect with.
        </p>
      )}
    </div>
  );
}

export default MyFriends;
