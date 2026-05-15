'use client';

import { useTimezone } from '@/context/TimezoneProvider';
import { useAutomations } from '@/features/automations/hooks/use-automations';
import { nextRunFor } from '@/features/automations/utils/describe-trigger';
import { cn } from '@/utils';
import { useEffect, useMemo, useState } from 'react';
import { type Address, type Hex, formatEther } from 'viem';
import { useBalance } from 'wagmi';

function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1_000);
  const days = Math.floor(totalSeconds / 86_400);
  if (days >= 1) {
    const hours = Math.floor((totalSeconds % 86_400) / 3_600);
    return `${days}d ${String(hours).padStart(2, '0')}h`;
  }
  const hours = Math.floor(totalSeconds / 3_600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours >= 1) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatWhen(date: Date, timeZone?: string): string {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  });
}

function useTick(intervalMs: number) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
}

type TileProps = {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
};

function Tile({ label, value, unit, highlight }: TileProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4 flex flex-col',
        highlight ? 'bg-(--accent-subtle) border-transparent' : 'bg-(--surface) border-(--border)',
      )}
    >
      <span
        className={cn(
          'text-xs uppercase font-semibold',
          highlight ? 'text-(--accent-text)' : 'text-(--text-ter)',
        )}
      >
        {label}
      </span>
      <div
        className={cn(
          'flex items-baseline gap-2 tabular-nums',
          highlight ? 'text-(--accent-text)' : 'text-(--text)',
        )}
      >
        <span className="text-2xl font-semibold">{value}</span>
        {unit && (
          <span className={cn(highlight ? 'text-(--accent-text)' : 'text-(--text-sec)')}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

type AutomationsSummaryProps = {
  safe?: Address;
};

export default function AutomationsSummary({ safe }: AutomationsSummaryProps) {
  const { data: automations, isLoading } = useAutomations(safe);
  const { timeZone } = useTimezone();
  useTick(1000);

  const { activeCount, totalCount, totalExecutions, nextEntry } = useMemo(() => {
    if (!automations)
      return { activeCount: 0, totalCount: 0, totalExecutions: 0, nextEntry: undefined };

    let active = 0;
    let executions = 0;
    let upcoming: { date: Date; title: string } | undefined;

    for (const a of automations) {
      if (a.isActive) active += 1;
      executions += a.executionCount ?? 0;

      const next = nextRunFor(a.trigger as Hex, a.isActive);
      if (next && (!upcoming || next.getTime() < upcoming.date.getTime())) {
        upcoming = { date: next, title: a.title ?? 'Untitled' };
      }
    }

    return {
      activeCount: active,
      totalCount: automations.length,
      totalExecutions: executions,
      nextEntry: upcoming,
    };
  }, [automations]);

  const { data: balance } = useBalance({ address: safe });
  const balanceEth = balance ? Number(formatEther(balance.value)).toFixed(4) : null;

  const countdown = nextEntry ? formatCountdown(nextEntry.date.getTime() - Date.now()) : '—';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Tile
        highlight
        label="Next execution"
        value={countdown}
        unit={nextEntry ? `${formatWhen(nextEntry.date, timeZone)}` : undefined}
      />
      <Tile label="Active automations" value={String(activeCount)} unit={`/ ${totalCount} total`} />
      <Tile label="Total executions" value={String(totalExecutions)} unit="runs" />
      <Tile label="Wallet balance" value={balanceEth ?? '—'} unit={balance?.symbol} />
    </div>
  );
}
