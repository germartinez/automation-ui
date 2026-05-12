'use client';

import { cn } from '@/utils';
import { CalendarIcon } from 'lucide-react';

type AutomationIconProps = {
  kind: 'recurrent';
  tone?: 'accent' | 'warn' | 'muted';
};

const ICON: Record<'recurrent', typeof CalendarIcon> = {
  recurrent: CalendarIcon,
};

const TONE: Record<NonNullable<AutomationIconProps['tone']>, string> = {
  accent: 'bg-(--accent-subtle) text-(--accent-text)',
  warn: 'bg-(--warning-bg) text-(--warning-text)',
  muted: 'bg-(--bg-muted) text-(--text-muted)',
};

export default function AutomationIcon({ kind, tone = 'muted' }: AutomationIconProps) {
  const Icon = ICON[kind];
  return (
    <div className={cn('w-10 h-10 rounded-xl grid place-items-center shrink-0', TONE[tone])}>
      <Icon size={18} />
    </div>
  );
}
