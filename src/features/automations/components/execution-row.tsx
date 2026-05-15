'use client';

import Badge from '@/components/ui/badge';
import HexDisplay from '@/components/ui/hex-display';
import { useTimezone } from '@/context/TimezoneProvider';
import type { Execution } from '@/features/automations/queries/executions';
import { cn } from '@/utils';
import { formatDateTime, timeAgo } from '@/utils/time';
import { formatEther } from 'viem';

type Props = { execution: Execution; gridCols: string };

export default function ExecutionRow({ execution, gridCols }: Props) {
  const { timeZone } = useTimezone();
  const date = execution.timestamp ? new Date(execution.timestamp * 1000) : undefined;

  const gasUsed = 1000_000_000_000n; // TODO: get gas used from execution

  return (
    <div className={cn('grid items-center gap-4 p-4 group', gridCols)}>
      <span className="text-md text-(--text-ter) tabular-nums">{execution.executionCount}</span>

      <HexDisplay hex={execution.txHash} className="text-md text-(--text)" />

      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-(--text) truncate">
          {date && formatDateTime(date, timeZone)}
        </span>
        <span className="text-xs text-(--text-ter) truncate">{date && timeAgo(date)}</span>
      </div>

      <div
        className={cn(
          'truncate text-md',
          gasUsed > 0n ? 'text-(--error-text)' : 'text-(--text-ter)',
        )}
      >
        {gasUsed > 0n ? '-' : ''}
        {formatEther(gasUsed)} ETH
      </div>

      <div className="flex justify-start">
        <Badge dot label="Executed" status="success" />
      </div>
    </div>
  );
}
