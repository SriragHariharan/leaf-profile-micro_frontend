/**
 * ProfileCoverBanner
 *
 * Renders the profile cover image (or brand gradient fallback) with an optional
 * edit overlay when viewing your own profile.
 */
import React from 'react';
import { Edit } from 'lucide-react';
import { designRecipes } from 'hostApp/designRecipes';

type ProfileCoverBannerProps = {
  coverStyle: React.CSSProperties;
  self: boolean;
  onEditCover: () => void;
};

export default function ProfileCoverBanner({
  coverStyle,
  self,
  onEditCover,
}: ProfileCoverBannerProps) {
  return (
    <div className="relative">
      <div className={designRecipes.profileCover} style={coverStyle} />
      <div className={designRecipes.profileCoverGradient} />
      {self && (
        <button onClick={onEditCover} className={designRecipes.profileCoverEditBtn}>
          <Edit className="h-4 w-4 text-ds-text-secondary" />
        </button>
      )}
    </div>
  );
}
