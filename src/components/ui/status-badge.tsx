'use client';

import Dot from '@/components/ui/dot';
import { cn } from '@/utils';

const map: Record<string, { dot: string; bgClass: string; textClass: string; label: string }> = {
  active: {
    dot: `var(--success-dot)`,
    bgClass: 'bg-(--success-bg)',
    textClass: 'text-(--success-text)',
    label: 'Active',
  },
  pending: {
    dot: `var(--warning-dot)`,
    bgClass: 'bg-(--warning-bg)',
    textClass: 'text-(--warning-text)',
    label: 'Pending',
  },
  success: {
    dot: `var(--success-dot)`,
    bgClass: 'bg-(--success-bg)',
    textClass: 'text-(--success-text)',
    label: 'Success',
  },
  failed: {
    dot: `var(--error-dot)`,
    bgClass: 'bg-(--error-bg)',
    textClass: 'text-(--error-text)',
    label: 'Failed',
  },
  paused: {
    dot: `var(--warning-dot)`,
    bgClass: 'bg-(--warning-bg)',
    textClass: 'text-(--warning-text)',
    label: 'Paused',
  },
  scheduled: {
    dot: `var(--scheduled-dot)`,
    bgClass: 'bg-(--scheduled-bg)',
    textClass: 'text-(--scheduled-text)',
    label: 'Scheduled',
  },

  enabled: {
    dot: `var(--success-dot)`,
    bgClass: 'bg-(--success-bg)',
    textClass: 'text-(--success-text)',
    label: 'Enabled',
  },
  disabled: {
    dot: `var(--text-ter)`,
    bgClass: 'bg-(--surface)-alt',
    textClass: 'text-(--text-sec)',
    label: 'Disabled',
  },
};

type StatusBadgeProps = {
  status: string;
};

function StatusBadge({ status }: StatusBadgeProps) {
  const s = map[status] || map.pending;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] px-2 py-0.5 rounded-full text-xs font-medium',
        s.bgClass,
        s.textClass,
      )}
    >
      <Dot color={s.dot} size={5} />
      {s.label}
    </span>
  );
}

export default StatusBadge;
