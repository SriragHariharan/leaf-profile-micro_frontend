import React from 'react';
import { User } from '../interfaces/User.interface';
import UserCard from './UserCard';
import { designRecipes } from 'hostApp/designRecipes';

interface FriendRequestsProps {
  users: User[];
  loading?: boolean;
}

function FriendRequests({ users, loading = false }: FriendRequestsProps) {
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
          <UserCard
            key={user?.userID ?? (user?.Profile as User)?.userID}
            user={user?.Profile as User}
          />
        ))
      ) : (
        <p className="py-10 text-center text-sm text-ds-text-muted">
          No pending friend requests.
        </p>
      )}
    </div>
  );
}

export default FriendRequests;
