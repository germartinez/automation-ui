'use client';

import Badge from '@/components/ui/badge';
import HexDisplay from '@/components/ui/hex-display';
import { useTimezone } from '@/context/TimezoneProvider';
import type { Execution } from '@/features/automations/queries/executions';
import { cn } from '@/utils';
import { formatEtherShort } from '@/utils/format';
import { formatDateTime, timeAgo } from '@/utils/time';

type ExecutionRowProps = { execution: Execution; gridCols: string };

export default function ExecutionRow({ execution, gridCols }: ExecutionRowProps) {
  const { timeZone } = useTimezone();
  const date = execution.blockTimestamp ? new Date(execution.blockTimestamp * 1000) : undefined;

  return (
    <div className={cn('grid items-center gap-4 p-4 group', gridCols)}>
      <span className="text-md text-(--text-ter) truncate tabular-nums">
        {execution.executionCount}
      </span>

      <span className="text-md text-(--text) truncate tabular-nums">
        {execution.blockNumber.toString()}
      </span>

      <HexDisplay hex={execution.txHash} />

      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-(--text) truncate">
          {date && formatDateTime(date, timeZone)}
        </span>
        <span className="text-xs text-(--text-ter) truncate">{date && timeAgo(date)}</span>
      </div>

      <HexDisplay hex={execution.from} identicon />

      <div className="truncate text-md text-(--text)">
        {formatEtherShort(BigInt(execution.gasUsed))} ETH
      </div>

      <div className="flex justify-start">
        <Badge dot label="Executed" status="success" />
      </div>
    </div>
  );
}
