/**
 * ProfileBioSection
 *
 * Renders the profile description (bio) inside a muted card.
 */
import React from 'react';
import { Edit } from 'lucide-react';
import { designRecipes } from "@srirag/leaf-design-system"

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
    <div className={designRecipes.profileBioCard}>
      <div className="flex items-start justify-between gap-3">
        <p className="max-w-3xl text-sm leading-relaxed text-ds-text-secondary sm:text-base">
          {description}
        </p>
        {self && (
          <button
            onClick={onEditDescription}
            className={`shrink-0 ${designRecipes.profileMetaEditBtn} p-2 hover:bg-ds-surface-card`}
          >
            <Edit className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
