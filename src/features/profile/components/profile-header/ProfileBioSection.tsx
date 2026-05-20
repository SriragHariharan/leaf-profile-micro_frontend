/**
 * ProfileBioSection
 *
 * Renders the profile description (bio) inside a muted card.
 * Owners see an edit button that opens EditProfileModal for the description field.
 *
 * @param description - Bio text to display
 * @param self - Whether the viewer is the profile owner
 * @param onEditDescription - Opens EditProfileModal for description
 */
import React from 'react';
import { Edit } from 'lucide-react';

type ProfileBioSectionProps = {
  description: string;
  self: boolean;
  onEditDescription: () => void;
};

export default function ProfileBioSection({
  description,
  self,
  onEditDescription,
}: ProfileBioSectionProps) {
  return (
    <div className="mt-5 rounded-xl border border-ds-border-subtle bg-ds-surface-muted/60 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="max-w-3xl text-sm leading-relaxed text-ds-text-secondary sm:text-base">
          {description}
        </p>
        {self && (
          <button
            onClick={onEditDescription}
            className="shrink-0 rounded-md p-2 text-ds-text-muted transition-colors hover:bg-ds-surface-card hover:text-ds-brand-600"
          >
            <Edit className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
