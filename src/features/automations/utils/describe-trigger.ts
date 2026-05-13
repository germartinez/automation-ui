import { strategyLabel } from '@/lib/contracts';
import {
  decodeRecurrentTrigger,
  describeRecurrentSchedule,
  describeUtcScheduleInTz,
  isValidRecurrentSchedule,
  nextOccurrenceUtc,
  shiftScheduleToTz,
  WILDCARD,
  type RecurrentSchedule,
} from '@/lib/recurrent';
import type { Address, Hex } from 'viem';

export type CadenceKind = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'custom';

export function describeTrigger(strategy: Address, trigger: Hex, timeZone?: string): string {
  try {
    const schedule = decodeRecurrentTrigger(trigger);
    return timeZone
      ? describeUtcScheduleInTz(schedule, timeZone)
      : describeRecurrentSchedule(schedule);
  } catch {
    return strategyLabel(strategy);
  }
}

export function decodeTriggerSchedule(trigger: Hex): RecurrentSchedule | undefined {
  try {
    const schedule = decodeRecurrentTrigger(trigger);
    return isValidRecurrentSchedule(schedule) ? schedule : undefined;
  } catch {
    return undefined;
  }
}

export function getCadenceKind(schedule: RecurrentSchedule): CadenceKind {
  const hourSet = schedule.hour !== WILDCARD;
  const dowSet = schedule.dayOfWeek !== WILDCARD;
  const domSet = schedule.dayOfMonth !== WILDCARD;

  if (!hourSet && !dowSet && !domSet) return 'hourly';
  if (hourSet && !dowSet && !domSet) return 'daily';
  if (dowSet) return 'weekly';
  if (domSet) return 'monthly';
  return 'custom';
}

const DAY_SHORT = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const pad2 = (n: number) => String(n).padStart(2, '0');

function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

export function shortCadence(schedule: RecurrentSchedule, timeZone?: string): string {
  const s = timeZone ? shiftScheduleToTz(schedule, timeZone) : schedule;
  const kind = getCadenceKind(s);
  const hh = s.hour === WILDCARD ? '*' : pad2(s.hour);
  const mm = s.minute === WILDCARD ? '*' : pad2(s.minute);
  const ampm = parseInt(hh) > 12 ? 'PM' : 'AM';

  switch (kind) {
    case 'hourly':
      return `Hourly, :${mm}`;
    case 'daily':
      return `Daily, ${hh}:${mm} ${ampm}`;
    case 'weekly':
      return `Weekly, ${DAY_SHORT[s.dayOfWeek] ?? '?'}, ${hh}:${mm} ${ampm}`;
    case 'monthly':
      return `Monthly, ${ordinal(s.dayOfMonth)}, ${hh}:${mm} ${ampm}`;
    default:
      return `${hh}:${mm} ${ampm}`;
  }
}

export function scheduleToCron(schedule: RecurrentSchedule): string {
  const part = (v: number) => (v === WILDCARD ? '*' : String(v));
  return `${part(schedule.minute)} ${part(schedule.hour)} ${part(schedule.dayOfMonth)} * ${part(schedule.dayOfWeek)}`;
}

export function nextRunFor(trigger: Hex, isActive: boolean): Date | undefined {
  if (!isActive) return;
  const schedule = decodeTriggerSchedule(trigger);
  if (!schedule) return;
  return nextOccurrenceUtc(schedule);
}
