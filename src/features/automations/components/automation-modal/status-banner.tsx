'use client';

import { AlertTriangleIcon, CalendarClockIcon, CheckCircle2Icon } from 'lucide-react';

type StatusBannerProps = {
  state: 'error' | 'success' | 'info';
  message: string;
};

export default function StatusBanner({ state, message }: StatusBannerProps) {
  const styles =
    state === 'error'
      ? 'bg-(--error-bg) text-(--error-text) border-(--error-text)/20'
      : state === 'success'
        ? 'bg-(--success-bg) text-(--success-text) border-(--success-text)/20'
        : 'bg-(--scheduled-bg) text-(--scheduled-text) border-(--scheduled-text)/20';
  const Icon =
    state === 'error'
      ? AlertTriangleIcon
      : state === 'success'
        ? CheckCircle2Icon
        : CalendarClockIcon;
  return (
    <div className={`flex items-start gap-3 rounded border p-3 mb-4 text-md ${styles}`}>
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
