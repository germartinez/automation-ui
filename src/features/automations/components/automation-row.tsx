'use client';

import Badge from '@/components/ui/badge';
import HexDisplay from '@/components/ui/hex-display';
import Spinner from '@/components/ui/spinner';
import { useTimezone } from '@/context/TimezoneProvider';
import { useDeleteAutomation } from '@/features/automations/hooks/use-delete-automation';
import { useLiveNextRun } from '@/features/automations/hooks/use-live-next-run';
import { useToggleAutomation } from '@/features/automations/hooks/use-toggle-automation';
import type { Automation as AutomationRecord } from '@/features/automations/queries/automations';
import { decodeTriggerSchedule, shortCadence } from '@/features/automations/utils/describe-trigger';
import { cn } from '@/utils';
import { timeUntil } from '@/utils/time';
import { MoreHorizontalIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type Address, type Hex, formatEther } from 'viem';
import AutomationIcon from './automation-icon';

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

function LiveAutomationIcon({ trigger, isActive }: { trigger: Hex; isActive: boolean }) {
  const next = useLiveNextRun(trigger as Hex, isActive);
  const soon = next ? next.getTime() - Date.now() < SOON_THRESHOLD_MS : false;
  const avatarTone = !isActive ? 'muted' : soon ? 'warn' : 'accent';

  return <AutomationIcon kind="recurrent" tone={avatarTone} />;
}

function LiveNextExecution({ trigger, isActive }: { trigger: Hex; isActive: boolean }) {
  const { timeZone } = useTimezone();
  const next = useLiveNextRun(trigger as Hex, isActive);
  const soon = next ? next.getTime() - Date.now() < SOON_THRESHOLD_MS : false;
  if (!next) return null;

  return (
    <>
      <div className="flex justify-start truncate">
        <Badge
          label={next ? timeUntil(next) : 'Paused'}
          status={!isActive ? 'disabled' : soon ? 'warning' : 'success'}
        />
      </div>
      {next && (
        <span className="text-xs text-(--text-ter) truncate">{formatWhen(next, timeZone)}</span>
      )}
    </>
  );
}

type AutomationRowProps = {
  automation: AutomationRecord;
  gridCols: string;
};

export default function AutomationRow({ automation, gridCols }: AutomationRowProps) {
  const { title, trigger, value, to, isActive, safe, automationHash } = automation;
  const { timeZone } = useTimezone();
  const router = useRouter();
  const { toggle, submitting: toggling } = useToggleAutomation(safe as Address);
  const { remove, submitting: removing } = useDeleteAutomation(safe as Address);
  const [menuOpen, setMenuOpen] = useState(false);
  const submitting = toggling || removing;

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    try {
      await toggle({ automationHash: automationHash as Hex, isActive });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    try {
      await remove({ automationHash: automationHash as Hex });
    } catch (err) {
      console.error(err);
    }
  };

  const schedule = decodeTriggerSchedule(trigger as Hex);
  const cadenceLine = schedule ? shortCadence(schedule, timeZone) : 'Custom';

  return (
    <div
      className={cn(
        'grid items-center gap-4 p-4 group transition-[background-color] duration-100 hover:bg-(--surface-alt) cursor-pointer',
        gridCols,
        !isActive && 'opacity-80',
      )}
      onClick={() => router.push(`/automations/${automation.automationHash}`)}
    >
      <LiveAutomationIcon trigger={trigger as Hex} isActive={isActive} />

      <div className="flex flex-col gap-0.5">
        <p className="font-medium text-(--text) text-md truncate">{title ?? 'Untitled'}</p>
        <p className="text-xs text-(--text-ter) truncate">{cadenceLine}</p>
      </div>

      <div className="flex flex-col gap-0.5">
        <LiveNextExecution trigger={trigger as Hex} isActive={isActive} />
      </div>

      <HexDisplay hex={to} identicon />

      <div className={cn('truncate text-sm', value > 0n ? 'text-(--error-text)' : 'text-(--text)')}>
        {value > 0n ? '-' : ''}
        {formatEther(value)} ETH
      </div>

      <div className="flex justify-start">
        <Badge
          dot
          label={isActive ? 'Active' : 'Paused'}
          status={isActive ? 'success' : 'disabled'}
        />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
          aria-label="More options"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          className={cn(
            'relative z-20 grid w-7 h-7 place-items-center rounded-md text-(--text-ter)',
            'opacity-40 group-hover:opacity-100 transition-opacity duration-100',
            'hover:bg-(--surface) hover:text-(--text)',
            (menuOpen || submitting) && 'opacity-100',
          )}
        >
          {submitting ? (
            <Spinner size={14} color="var(--text-ter)" />
          ) : (
            <MoreHorizontalIcon size={16} />
          )}
        </button>
        {menuOpen && (
          <>
            <div
              aria-hidden
              className="fixed inset-0 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
              }}
            />
            <div
              role="menu"
              className={cn(
                'absolute right-0 top-full mt-1 z-20 min-w-36 p-1',
                'rounded-md border border-(--border) bg-(--surface) shadow-md',
              )}
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleToggle}
                disabled={submitting}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm text-(--text)',
                  'hover:bg-(--surface-alt) disabled:opacity-50 disabled:cursor-not-allowed',
                )}
              >
                {isActive ? 'Pause' : 'Resume'}
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleRemove}
                disabled={submitting}
                className={cn(
                  'w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm text-(--error-text)',
                  'hover:bg-(--surface-alt) disabled:opacity-50 disabled:cursor-not-allowed',
                )}
              >
                Remove
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
