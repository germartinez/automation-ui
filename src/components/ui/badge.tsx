'use client';

import Dot from '@/components/ui/dot';
import { cn } from '@/utils';

type Status = 'warning' | 'success' | 'error' | 'other' | 'disabled';

const statusMap: Record<Status, { dot: string; bgClass: string; textClass: string }> = {
  warning: {
    dot: `var(--warning-dot)`,
    bgClass: 'bg-(--warning-bg)',
    textClass: 'text-(--warning-text)',
  },
  success: {
    dot: `var(--success-dot)`,
    bgClass: 'bg-(--success-bg)',
    textClass: 'text-(--success-text)',
  },
  error: {
    dot: `var(--error-dot)`,
    bgClass: 'bg-(--error-bg)',
    textClass: 'text-(--error-text)',
  },
  other: {
    dot: `var(--other-dot)`,
    bgClass: 'bg-(--other-bg)',
    textClass: 'text-(--other-text)',
  },
  disabled: {
    dot: `var(--text-ter)`,
    bgClass: 'bg-(--surface)-alt',
    textClass: 'text-(--text-sec)',
  },
};

type BadgeProps = {
  label: string;
  status: Status;
  dot?: boolean;
};

function Badge({ label, status, dot }: BadgeProps) {
  const s = statusMap[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium',
        s.bgClass,
        s.textClass,
      )}
    >
      {dot && <Dot color={s.dot} size={7} />}
      {label}
    </span>
  );
}

export default Badge;
