import React from 'react';
import { Search } from 'lucide-react';
import { designRecipes } from 'hostApp/designRecipes';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  handleUserSearch: () => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder, handleUserSearch }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-ds-text-muted hover:text-ds-brand-700 cursor-pointer" size={20} onClick={handleUserSearch} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Search...'}
        className={`${designRecipes.inputBase} py-2 pl-3 pr-10`}
      />
    </div>
  );
}