'use client';

import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import { cn } from '@/utils';
import type { WhenDraft } from './utils';

type StrategyKind = WhenDraft['kind'] | 'onetime' | 'conditional';

type StrategyOption = {
  kind: StrategyKind;
  title: string;
  description: string;
  disabled: boolean;
};

const options: StrategyOption[] = [
  {
    kind: 'recurrent',
    title: 'Recurrent',
    description: 'Execute on a recurring schedule.',
    disabled: false,
  },
  {
    kind: 'onetime',
    title: 'One time',
    description: 'Execute once at a specific date and time.',
    disabled: true,
  },
  {
    kind: 'conditional',
    title: 'Conditional',
    description: 'Execute on off-chain conditions.',
    disabled: true,
  },
];

type WhenTypeFieldsProps = {
  draft: WhenDraft;
  onChange: (next: WhenDraft) => void;
  title: string;
  onTitleChange: (title: string) => void;
};

export default function WhenTypeFields({
  draft,
  onChange,
  title,
  onTitleChange,
}: WhenTypeFieldsProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-1.5">
        <Label>Title</Label>
        <Input
          value={title}
          onChange={(value) => onTitleChange(String(value))}
          placeholder="e.g. Weekly USDC transfer"
        />
      </div>
      <div className="grid gap-2">
        {options.map((option) => {
          const active = !option.disabled && draft.kind === option.kind;
          return (
            <button
              key={option.kind}
              type="button"
              disabled={option.disabled}
              aria-disabled={option.disabled}
              onClick={() => {
                if (option.disabled || option.kind !== 'recurrent') return;
                onChange({ ...draft, kind: option.kind });
              }}
              className={cn(
                'flex items-center gap-4 text-left rounded-xl p-4 transition-colors duration-150',
                active
                  ? 'bg-(--accent-subtle) border border-(--accent-subtle)'
                  : 'border border-(--border)',
                option.disabled && 'cursor-auto opacity-50',
              )}
            >
              <span
                className={cn(
                  'w-3 h-3 rounded-full border inline-block shrink-0',
                  active ? 'border-(--accent) bg-(--accent)' : 'border-(--border)',
                )}
              />
              <div className="flex flex-col">
                <span className="font-medium text-(--text)">{option.title}</span>
                <p className="text-(--text-sec) text-sm">{option.description}</p>
              </div>
              {option.disabled && (
                <span className="text-xs text-(--text-sec) ml-auto">Coming soon</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
