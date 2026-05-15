'use client';

import Badge from '@/components/ui/badge';
import { useTimezone } from '@/context/TimezoneProvider';
import type { MissingExecution } from '@/features/automations/utils/find-missing-executions';
import { cn } from '@/utils';
import { formatDateTime, timeAgo } from '@/utils/time';

type Props = {
  missing: MissingExecution;
  gridCols: string;
};

export default function ExecutionRowMissing({ missing, gridCols }: Props) {
  const { timeZone } = useTimezone();

  const date = new Date(missing.scheduledAt * 1000);

  return (
    <div className={cn('grid items-center gap-4 p-4 group', gridCols)}>
      <span className="text-md text-(--text-ter) tabular-nums"></span>

      <span className="text-md text-(--error-text) truncate tabular-nums"></span>

      <span className="text-md text-(--text-ter) tabular-nums"></span>

      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-(--error-text) truncate">
          {formatDateTime(date, timeZone)}
        </span>
        <span className="text-xs text-(--text-ter) truncate">{timeAgo(date)}</span>
      </div>

      <span className="text-md text-(--text-ter) tabular-nums"></span>

      <div className="truncate text-md text-(--text-ter)"></div>

      <div className="flex justify-start">
        <Badge dot label="Missing" status="error" />
      </div>
    </div>
  );
}
