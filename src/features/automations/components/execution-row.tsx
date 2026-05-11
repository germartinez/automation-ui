'use client';

import StatusBadge from '@/components/ui/status-badge';
import { useTimezone } from '@/context/TimezoneProvider';
import type { Execution } from '@/features/automations/queries/executions';
import { explorerTx } from '@/utils/explorer';
import { formatDateTime, timeAgo } from '@/utils/time';
import { ExternalLinkIcon } from 'lucide-react';

type Props = { execution: Execution };

export default function ExecutionRow({ execution }: Props) {
  const { timeZone } = useTimezone();
  const date = execution.timestamp ? new Date(execution.timestamp * 1000) : undefined;

  return (
    <tr className="border-t border-(--border)">
      <td className="p-4 text-(--text-sec) w-1/6">{execution.executionCount}</td>
      <td className="p-4 text-md w-2/6">
        <a
          href={explorerTx(execution.txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-(--text) hover:text-(--accent)"
        >
          {execution.txHash.slice(0, 10)}...{execution.txHash.slice(-4)}
          <ExternalLinkIcon size={12} />
        </a>
      </td>
      <td className="p-4 text-(--text) w-2/6">
        <div className="flex flex-col">
          <span>{date && formatDateTime(date, timeZone)}</span>
          <span className="text-xs text-(--text-sec)">{date && timeAgo(date)}</span>
        </div>
      </td>
      <td className="p-4 text-(--text) w-1/6">
        <StatusBadge status="success" />
      </td>
    </tr>
  );
}
