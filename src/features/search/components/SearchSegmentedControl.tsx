import React from 'react';
import { clsx } from 'clsx';
import { designRecipes } from 'hostApp/designRecipes';
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
        'inline-flex rounded-dsPill border border-ds-border-subtle bg-ds-surface-muted p-1',
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
              'rounded-dsPill px-4 py-1.5 text-sm font-medium transition-all duration-ds',
              isActive ? designRecipes.navItemActive : designRecipes.navItemIdle,
              'border-0 shadow-none hover:translate-y-0'
            )}
          >
            {segment.label}
          </button>
        );
      })}
    </div>
  );
}
