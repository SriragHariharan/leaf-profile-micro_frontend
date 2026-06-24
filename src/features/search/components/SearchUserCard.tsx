import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { designRecipes } from "@srirag/leaf-design-system"
import { DEFAULT_PROFILE_IMAGE } from '../../../constants/constants';
import type { SearchUserResult } from '../types/search.types';

export default function SearchUserCard({ userID, username, profilepic }: SearchUserResult) {

  return (
    <Link
      to={`/view-profile/${userID}`}
      className={`${designRecipes.panelHover} mb-3 flex items-center gap-4 p-4`}
    >
      <img
        src={profilepic || DEFAULT_PROFILE_IMAGE}
        alt={username}
        className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-ds-border-subtle"
      />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-ds-text-primary">{username}</h3>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-ds-text-muted" aria-hidden />
    </Link>
  );
}
