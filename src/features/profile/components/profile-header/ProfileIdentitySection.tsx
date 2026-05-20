/**
 * ProfileIdentitySection
 *
 * Displays the profile avatar, display name, location, and join date.
 * When `self` is true, shows inline edit controls for username, location,
 * and avatar (opens respective modals via callbacks).
 *
 * @param self - Whether the viewer is the profile owner
 * @param profileImage - Resolved avatar URL (with default fallback applied upstream)
 * @param displayName - Username or fallback label
 * @param displayLocation - Location string shown with MapPin icon
 * @param displayJoinDate - Formatted join date shown with Calendar icon
 * @param onEditAvatar - Opens profile picture upload modal
 * @param onEditUsername - Opens EditProfileModal for username
 * @param onEditLocation - Opens EditProfileModal for location
 */
import React from 'react';
import { Edit, MapPin, Calendar } from 'lucide-react';

type ProfileIdentitySectionProps = {
  self: boolean;
  profileImage: string;
  displayName: string;
  displayLocation: string;
  displayJoinDate: string;
  onEditAvatar: () => void;
  onEditUsername: () => void;
  onEditLocation: () => void;
};

export default function ProfileIdentitySection({
  self,
  profileImage,
  displayName,
  displayLocation,
  displayJoinDate,
  onEditAvatar,
  onEditUsername,
  onEditLocation,
}: ProfileIdentitySectionProps) {
  return (
    <div className="flex items-center gap-4 sm:items-center">
      <div className="relative z-10 -mt-12 shrink-0 sm:-mt-16">
        <img
          src={profileImage}
          alt="Profile"
          className="h-24 w-24 rounded-full border-4 border-ds-surface-card object-cover shadow-dsMd sm:h-28 sm:w-28 lg:h-32 lg:w-32"
        />
        {self && (
          <button
            onClick={onEditAvatar}
            className="absolute bottom-1 right-1 rounded-full bg-ds-surface-card p-2 shadow-dsSm ring-1 ring-ds-border-subtle transition-colors hover:bg-ds-surface-muted"
          >
            <Edit className="h-4 w-4 text-ds-text-secondary" />
          </button>
        )}
      </div>
      <div className="min-w-0 pb-1">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tight text-ds-text-primary sm:text-3xl">
            {displayName}
          </h1>
          {self && (
            <button
              onClick={onEditUsername}
              className="rounded-md p-1.5 text-ds-text-muted transition-colors hover:bg-ds-surface-muted hover:text-ds-brand-600"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ds-text-secondary">
          <div className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-ds-text-muted" />
            <span>{displayLocation}</span>
            {self && (
              <button
                onClick={onEditLocation}
                className="rounded p-1 text-ds-text-muted transition-colors hover:bg-ds-surface-muted hover:text-ds-brand-600"
              >
                <Edit className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-ds-text-muted" />
            <span>Joined {displayJoinDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
