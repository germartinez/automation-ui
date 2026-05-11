import { strategyLabel } from '@/lib/contracts';
import {
  decodeRecurrentTrigger,
  describeRecurrentSchedule,
  describeUtcScheduleInTz,
} from '@/lib/recurrent';
import type { Address, Hex } from 'viem';

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
