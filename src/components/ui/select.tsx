'use client';

import { cn } from '@/utils';

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  size?: 'sm' | 'md';
};

function Select({ value, onChange, options, size = 'md' }: SelectProps) {
  const sizeClass = {
    sm: 'text-xs p-2',
    md: 'text-sm p-3',
  }[size];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'rounded-lg border border-(--border) bg-(--surface) text-(--text) cursor-pointer appearance-none',
        sizeClass,
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export default Select;
