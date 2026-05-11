'use client';

import StatusBadge from '@/components/ui/status-badge';
import { useTimezone } from '@/context/TimezoneProvider';
import { formatDateTime, timeUntil } from '@/utils/time';

type Props = { nextRun: Date; index: number };

export default function PendingExecutionRow({ nextRun, index }: Props) {
  const { timeZone } = useTimezone();

  return (
    <tr className="border-t border-(--border) bg-(--warning-bg)">
      <td className="p-4 text-(--warning-text)">{index}</td>
      <td className="p-4 text-(--warning-text)">Pending</td>
      <td className="p-4 text-(--warning-text)">
        <div className="flex flex-col">
          <span>{nextRun && formatDateTime(nextRun, timeZone)}</span>
          <span className="text-xs text-(--text-sec)">{nextRun && timeUntil(nextRun)}</span>
        </div>
      </td>
      <td className="p-4 text-(--warning-text)">
        <StatusBadge status="pending" />
      </td>
    </tr>
  );
}
