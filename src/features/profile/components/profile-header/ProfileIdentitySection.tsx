/**
 * ProfileIdentitySection
 *
 * Displays the profile avatar, display name, location, and join date.
 */
import React from 'react';
import { Edit, MapPin, Calendar } from 'lucide-react';
import { designRecipes } from "@srirag/leaf-design-system"

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
        <img src={profileImage} alt="Profile" className={designRecipes.profileAvatar} />
        {self && (
          <button onClick={onEditAvatar} className={designRecipes.profileEditIconBtn}>
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
            <button onClick={onEditUsername} className={designRecipes.profileMetaEditBtn}>
              <Edit className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ds-text-secondary">
          <div className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-ds-text-muted" />
            <span>{displayLocation}</span>
            {self && (
              <button onClick={onEditLocation} className={`${designRecipes.profileMetaEditBtn} p-1`}>
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
