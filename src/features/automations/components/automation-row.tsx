'use client';

import Badge from '@/components/ui/badge';
import { useTimezone } from '@/context/TimezoneProvider';
import type { Automation as AutomationRecord } from '@/features/automations/queries/automations';
import { cn } from '@/utils';
import { timeUntil } from '@/utils/time';
import { MoreHorizontalIcon } from 'lucide-react';
import { type Hex, formatEther } from 'viem';
import Identicon from '../../../components/ui/identicon';
import { decodeTriggerSchedule, nextRunFor, shortCadence } from '../utils/describe-trigger';
import AutomationIcon from './automation-icon';

type AutomationRowProps = {
  automation: AutomationRecord;
  onMore?: (hash: string) => void;
};

const SOON_THRESHOLD_MS = 60 * 60 * 1000; // 1 hour

function formatWhen(date: Date, timeZone?: string): string {
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
  });
}

export default function AutomationRow({ automation, onMore }: AutomationRowProps) {
  const { title, trigger, value, to, isActive } = automation;
  const { timeZone } = useTimezone();

  const schedule = decodeTriggerSchedule(trigger as Hex);
  const cadenceLine = schedule ? shortCadence(schedule, timeZone) : 'Custom';
  const next = nextRunFor(trigger as Hex, isActive);
  const soon = next ? next.getTime() - Date.now() < SOON_THRESHOLD_MS : false;

  const avatarTone = !isActive ? 'muted' : soon ? 'warn' : 'accent';

  return (
    <div
      className={cn(
        'grid grid-cols-[44px_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.6fr)_minmax(0,1fr)_90px_28px] items-center gap-4 p-4 group',
        !isActive && 'opacity-80',
      )}
    >
      <AutomationIcon kind="recurrent" tone={avatarTone} />

      <div className="flex flex-col gap-0.5">
        <p className="font-semibold text-(--text) text-md truncate">{title ?? 'Untitled'}</p>
        <p className="text-xs text-(--text-ter) truncate">{cadenceLine}</p>
      </div>

      <div className="flex items-center gap-2">
        <Identicon address={to} />
        <div className="flex flex-col gap-0.5 truncate">
          <span className="text-sm text-(--text) font-medium truncate">something.eth</span>
          <span className="text-xs text-(--text-ter) truncate">
            {to.slice(0, 8)}...{to.slice(-6)}
          </span>
        </div>
      </div>

      <div className="flex font-md truncate">
        <div className={cn('text-sm', value > 0n ? 'text-(--error-text)' : 'text-(--text-ter)')}>
          {value > 0n ? '-' : ''}
          {formatEther(value)} ETH
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="flex justify-start truncate">
          <NextRunChip next={next} soon={soon} paused={!isActive} />
        </div>
        {next && (
          <span className="text-xs text-(--text-ter) truncate">{formatWhen(next, timeZone)}</span>
        )}
      </div>

      <div className="flex justify-start">
        <Badge
          dot
          label={isActive ? 'Active' : 'Paused'}
          status={isActive ? 'success' : 'disabled'}
        />
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMore?.(automation.automationHash);
        }}
        aria-label="More options"
        className={cn(
          'grid w-7 h-7 place-items-center rounded-md text-(--text-ter)',
          'opacity-40 group-hover:opacity-100 transition-opacity duration-100',
          'hover:bg-(--surface) hover:text-(--text)',
        )}
      >
        <MoreHorizontalIcon size={16} />
      </button>
    </div>
  );
}

function NextRunChip({
  next,
  soon,
  paused,
}: {
  next: Date | undefined;
  soon: boolean;
  paused: boolean;
}) {
  if (paused) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-(--surface-alt) text-(--text-ter)">
        Paused
      </span>
    );
  }
  if (!next) {
    return (
      <span className="inline-flex items-centerpx-2 py-0.5 rounded-full text-xs font-medium bg-(--surface-alt) text-(--text-ter)">
        —
      </span>
    );
  }
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium tabular-nums',
        soon ? 'bg-(--warning-bg) text-(--warning-text)' : 'bg-(--surface-alt) text-(--text-ter)',
      )}
    >
      {timeUntil(next)}
    </span>
  );
}
