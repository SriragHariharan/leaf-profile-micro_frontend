import React from 'react';
import { clsx } from 'clsx';
import { designRecipes } from 'hostApp/designRecipes';

export type FriendsTab = 'friends' | 'requests';

interface FriendsSegmentedControlProps {
  value: FriendsTab;
  onChange: (value: FriendsTab) => void;
  requestCount: number;
  friendsCount: number;
}

const segments: {
  value: FriendsTab;
  label: string;
  countKey: 'requestCount' | 'friendsCount';
}[] = [
  { value: 'requests', label: 'Requests', countKey: 'requestCount' },
  { value: 'friends', label: 'Friends', countKey: 'friendsCount' },
];

export default function FriendsSegmentedControl({
  value,
  onChange,
  requestCount,
  friendsCount,
}: FriendsSegmentedControlProps) {
  const counts = { requestCount, friendsCount };

  return (
    <div
      role="tablist"
      aria-label="Friends navigation"
      className="grid w-[320px] grid-cols-2 gap-1 rounded-dsPill border border-ds-border-subtle bg-ds-surface-muted p-1"
    >
      {segments.map((segment) => {
        const isActive = value === segment.value;
        const count = counts[segment.countKey];
        return (
          <button
            key={segment.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(segment.value)}
            className={clsx(
              'inline-flex items-center justify-center gap-2 rounded-dsPill px-3 py-1.5 text-sm font-medium transition-all duration-ds',
              isActive ? designRecipes.navItemActive : designRecipes.navItemIdle,
              'border-0 shadow-none hover:translate-y-0'
            )}
          >
            <span>{segment.label}</span>
            <span
              className={clsx(
                'inline-flex min-w-[1.25rem] items-center justify-center rounded-dsPill px-1.5 py-0.5 text-xs font-semibold',
                isActive
                  ? 'bg-ds-brand-100 text-ds-brand-700'
                  : 'bg-ds-surface-card text-ds-text-muted'
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

