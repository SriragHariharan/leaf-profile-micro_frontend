import React from 'react';
import { clsx } from 'clsx';
import { designRecipes } from "@srirag/leaf-design-system"
import type { SearchType } from '../types/search.types';

interface SearchSegmentedControlProps {
  value: SearchType;
  onChange: (value: SearchType) => void;
  disabled?: boolean;
}

const segments: { value: SearchType; label: string }[] = [
  { value: 'user', label: 'People' },
  { value: 'post', label: 'Posts' },
];

export default function SearchSegmentedControl({
  value,
  onChange,
  disabled = false,
}: SearchSegmentedControlProps) {
  return (
    <div
      role="tablist"
      aria-label="Search type"
      className={clsx(
        designRecipes.segmentedControlShell,
        disabled && 'pointer-events-none opacity-50'
      )}
    >
      {segments.map((segment) => {
        const isActive = value === segment.value;
        return (
          <button
            key={segment.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            onClick={() => onChange(segment.value)}
            className={clsx(
              designRecipes.segmentedTab,
              isActive ? designRecipes.segmentedTabActive : designRecipes.segmentedTabIdle
            )}
          >
            {segment.label}
          </button>
        );
      })}
    </div>
  );
}
