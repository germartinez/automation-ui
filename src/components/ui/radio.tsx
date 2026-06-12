'use client';

import { cn } from '@/utils';

export type RadioOption<T extends string> = {
  value: T;
  title: string;
  description?: string;
  disabled?: boolean;
};

type RadioProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: RadioOption<T>[];
  className?: string;
};

function Radio<T extends string>({ value, onChange, options, className }: RadioProps<T>) {
  return (
    <div className={cn('grid gap-2', className)}>
      {options.map((option) => {
        const active = !option.disabled && value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={option.disabled}
            aria-disabled={option.disabled}
            onClick={() => !option.disabled && onChange(option.value)}
            className={cn(
              'flex items-center gap-4 text-left rounded-xl px-4 py-2 transition-colors duration-150',
              active
                ? 'bg-(--accent-subtle) border border-(--accent-subtle)'
                : 'border border-(--border)',
              option.disabled && 'cursor-auto opacity-50',
            )}
          >
            <span
              className={cn(
                'w-3 h-3 rounded-full border',
                active ? 'border-(--accent) bg-(--accent)' : 'border-(--border)',
              )}
            />
            <div className="flex flex-col">
              <span className="font-medium text-(--text)">{option.title}</span>
              {option.description && (
                <p className="text-(--text-sec) text-sm">{option.description}</p>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default Radio;
