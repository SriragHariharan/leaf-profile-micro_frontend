/**
 * ProfileCoverBanner
 *
 * Renders the profile cover image (or brand gradient fallback) with an optional
 * edit overlay when viewing your own profile.
 *
 * @param coverStyle - Inline background style from useProfileHeader (image URL or gradient)
 * @param self - Whether the viewer is the profile owner
 * @param onEditCover - Opens the cover image upload modal
 */
import React from 'react';
import { Edit } from 'lucide-react';

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
      <div
        className="h-36 bg-cover bg-center sm:h-48 lg:h-56"
        style={coverStyle}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ds-text-primary/35 via-ds-text-primary/10 to-transparent" />
      {self && (
        <button
          onClick={onEditCover}
          className="absolute right-3 top-3 rounded-full border border-ds-surface-card/60 bg-ds-surface-card/90 p-2 shadow-dsSm backdrop-blur transition-colors hover:bg-ds-surface-card sm:right-4 sm:top-4"
        >
          <Edit className="h-4 w-4 text-ds-text-secondary" />
        </button>
      )}
    </div>
  );
}
