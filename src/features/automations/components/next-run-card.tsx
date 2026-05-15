'use client';

import { useTimezone } from '@/context/TimezoneProvider';
import { useLiveNextRun } from '@/features/automations/hooks/use-live-next-run';
import {
  decodeTriggerSchedule,
  getCadenceKind,
  shortCadence,
} from '@/features/automations/utils/describe-trigger';
import { cn } from '@/utils';
import { formatDateTime } from '@/utils/time';
import { useEffect, useState } from 'react';
import { Hex } from 'viem';

const RUNS_PER_YEAR: Record<ReturnType<typeof getCadenceKind>, number | undefined> = {
  hourly: 24 * 365,
  daily: 365,
  weekly: 52,
  monthly: 12,
  custom: undefined,
};

const pad2 = (n: number) => String(n).padStart(2, '0');

function splitCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days, hours, minutes, seconds };
}

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className={cn('text-5xl font-medium text-(--text)')}>{value}</span>
      <span className="mt-1 text-xs uppercase text-(--text-ter)">{label}</span>
    </div>
  );
}

type NextRunCardProps = {
  isActive: boolean;
  trigger: Hex;
};

export default function NextRunCard({ isActive, trigger }: NextRunCardProps) {
  const { timeZone } = useTimezone();
  const [now, setNow] = useState(() => Date.now());
  const nextRun = useLiveNextRun(trigger, isActive);

  const schedule = decodeTriggerSchedule(trigger);

  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [isActive]);

  if (!schedule) {
    return (
      <div className="bg-(--surface) border border-(--border) rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-semibold text-(--text-ter)">Schedule</h3>
        </div>
        <p className="text-sm text-(--text-sec)">Custom trigger</p>
      </div>
    );
  }

  const kind = getCadenceKind(schedule);
  const cadence = shortCadence(schedule, timeZone);
  const runsPerYear = RUNS_PER_YEAR[kind];

  const trailing = (
    <span className="text-xs font-semibold uppercase text-(--text-ter)">{timeZone ?? 'UTC'}</span>
  );

  if (!isActive) {
    return (
      <div className="bg-(--surface) border border-(--border) rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-semibold text-(--text-ter)">Next execution</h3>
          {trailing}
        </div>
        <div className="flex flex-col gap-2 py-3">
          <span className="text-3xl font-semibold text-(--text-ter)">Paused</span>
          <span className="text-sm text-(--text-sec)">
            Resume the automation to schedule the next run.
          </span>
        </div>
      </div>
    );
  }

  if (!nextRun) {
    return (
      <div className="bg-(--surface) border border-(--border) rounded-xl p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-semibold text-(--text-ter)">Next execution</h3>
          {trailing}
        </div>
        <div className="flex flex-col gap-2 py-3">
          <span className="text-3xl font-semibold text-(--text-ter)">—</span>
          <span className="text-sm text-(--text-sec)">No upcoming execution scheduled.</span>
        </div>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = splitCountdown(nextRun.getTime() - now);

  return (
    <div className="bg-(--surface) border border-(--border) rounded-xl flex flex-col gap-4 py-4">
      <div className="flex items-center justify-between px-4">
        <h3 className="text-xs uppercase font-semibold text-(--text-ter)">Next execution</h3>
        {trailing}
      </div>
      <span className="text-md text-(--text) px-4">{formatDateTime(nextRun, timeZone)}</span>
      <div className="flex items-baseline gap-1 tabular-nums px-4">
        {days > 0 && (
          <>
            <CountdownUnit value={String(days)} label="days" />
            <span className="text-5xl font-light leading-none text-(--text-ter) self-start">:</span>
          </>
        )}
        <CountdownUnit value={pad2(hours)} label="hours" />
        <span className="text-5xl font-light leading-none text-(--text-ter) self-start">:</span>
        <CountdownUnit value={pad2(minutes)} label="minutes" />
        <span className="text-5xl font-light leading-none text-(--text-ter) self-start">:</span>
        <CountdownUnit value={pad2(seconds)} label="seconds" />
      </div>
      <div className="border-t border-(--border) pt-4 px-4 flex flex-col gap-2">
        <p className="text-md text-(--text)">{cadence}</p>
        {runsPerYear !== undefined && (
          <span className="self-start inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-(--accent-subtle) text-(--accent-text)">
            ~{runsPerYear.toLocaleString()} runs / year
          </span>
        )}
      </div>
    </div>
  );
}

/*

    <div className="bg-(--surface) border border-(--border) rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase font-semibold text-(--text-ter)">{title}</h3>
        {trailing}
      </div>
      {children}
    </div>

  */
