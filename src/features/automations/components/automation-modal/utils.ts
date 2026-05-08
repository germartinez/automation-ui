import {
  buildScheduleFromState,
  buildScheduleFromStateInTz,
  isValidRecurrentSchedule,
  type RecurrentBuilderState,
  type RecurrentSchedule,
} from '@/lib/recurrent';
import { isAddress, isHex, parseEther } from 'viem';

export type WhenDraft = {
  kind: 'recurrent';
  builder: RecurrentBuilderState;
};

export type TransactionDraft = {
  target: string;
  value: string;
  data: string;
};

export const defaultWhen: WhenDraft = {
  kind: 'recurrent',
  builder: {
    frequency: 'weekly',
    hour: 9,
    minute: 0,
    dayOfWeek: 1,
  },
};

export const defaultTransaction: TransactionDraft = {
  target: '',
  value: '0',
  data: '0x',
};

export function scheduleFromDraft(draft: WhenDraft, timeZone?: string): RecurrentSchedule {
  return timeZone
    ? buildScheduleFromStateInTz(draft.builder, timeZone)
    : buildScheduleFromState(draft.builder);
}

export function whenComplete(draft: WhenDraft): boolean {
  return isValidRecurrentSchedule(buildScheduleFromState(draft.builder));
}

function isValidEth(value: string): boolean {
  if (!value) return true;
  try {
    parseEther(value);
    return true;
  } catch {
    return false;
  }
}

export function transactionComplete(draft: TransactionDraft): boolean {
  const targetValid = isAddress(draft.target);
  const valueValid = isValidEth(draft.value);
  const dataValid = !draft.data || (isHex(draft.data) && draft.data.length % 2 === 0);
  return targetValid && valueValid && dataValid;
}

export function titleComplete(title: string): boolean {
  return title.trim().length > 0;
}
