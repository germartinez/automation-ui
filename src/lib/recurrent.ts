import { decodeAbiParameters, encodeAbiParameters, type Hex } from 'viem';

export const WILDCARD = 255;

export type RecurrentSchedule = {
  hour: number;
  minute: number;
  dayOfWeek: number;
  dayOfMonth: number;
  month: number;
};

const RECURRENT_SCHEDULE_PARAMS = [
  {
    type: 'tuple',
    components: [
      { name: 'hour', type: 'uint8' },
      { name: 'minute', type: 'uint8' },
      { name: 'dayOfWeek', type: 'uint8' },
      { name: 'dayOfMonth', type: 'uint8' },
      { name: 'month', type: 'uint8' },
    ],
  },
] as const;

export function encodeRecurrentTrigger(s: RecurrentSchedule): Hex {
  return encodeAbiParameters(RECURRENT_SCHEDULE_PARAMS, [s]);
}

export function decodeRecurrentTrigger(trigger: Hex): RecurrentSchedule {
  const [decoded] = decodeAbiParameters(RECURRENT_SCHEDULE_PARAMS, trigger);
  return decoded as RecurrentSchedule;
}

export function isValidRecurrentSchedule(s: RecurrentSchedule): boolean {
  if (s.hour !== WILDCARD && (s.hour < 0 || s.hour > 23)) return false;
  if (s.minute !== WILDCARD && (s.minute < 0 || s.minute > 59)) return false;
  if (s.month !== WILDCARD && (s.month < 1 || s.month > 12)) return false;
  if (s.dayOfWeek !== WILDCARD && (s.dayOfWeek < 1 || s.dayOfWeek > 7)) return false;
  if (s.dayOfMonth !== WILDCARD) {
    if (s.dayOfMonth < 1 || s.dayOfMonth > 31) return false;
    if (s.month !== WILDCARD) {
      if (s.month === 2 && s.dayOfMonth > 29) return false;
      if (
        s.dayOfMonth === 31 &&
        (s.month === 4 || s.month === 6 || s.month === 9 || s.month === 11)
      ) {
        return false;
      }
    }
  }
  if (
    s.hour === WILDCARD &&
    s.minute === WILDCARD &&
    s.dayOfWeek === WILDCARD &&
    s.dayOfMonth === WILDCARD &&
    s.month === WILDCARD
  ) {
    return false;
  }
  return true;
}

const DAY_NAMES = ['', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = [
  '',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

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

const pad2 = (n: number) => String(n).padStart(2, '0');

export function describeRecurrentSchedule(s: RecurrentSchedule, tzLabel: string = 'UTC'): string {
  const hourSet = s.hour !== WILDCARD;
  const minSet = s.minute !== WILDCARD;

  let timeClause: string;
  if (hourSet && minSet) timeClause = `At ${pad2(s.hour)}:${pad2(s.minute)}`;
  else if (minSet) timeClause = `Every hour at :${pad2(s.minute)}`;
  else if (hourSet) timeClause = `Every minute of ${pad2(s.hour)}:00`;
  else timeClause = 'Every minute';

  const dowSet = s.dayOfWeek !== WILDCARD;
  const domSet = s.dayOfMonth !== WILDCARD;

  let dayClause: string;
  if (dowSet && domSet) {
    dayClause = `on ${DAY_NAMES[s.dayOfWeek]} the ${ordinal(s.dayOfMonth)}`;
  } else if (dowSet) {
    dayClause = `on ${DAY_NAMES[s.dayOfWeek]}`;
  } else if (domSet) {
    dayClause = `on the ${ordinal(s.dayOfMonth)}`;
  } else {
    dayClause = 'every day';
  }

  const monthClause = s.month !== WILDCARD ? ` in ${MONTH_NAMES[s.month]}` : '';

  return `${timeClause} ${dayClause}${monthClause}`;
}

function isoDowUtc(d: Date): number {
  const dow = d.getUTCDay();
  return dow === 0 ? 7 : dow;
}

export function nextOccurrenceUtc(s: RecurrentSchedule, from: Date = new Date()): Date | undefined {
  const d = new Date(from.getTime());
  d.setUTCSeconds(0, 0);
  d.setUTCMinutes(d.getUTCMinutes() + 1);

  const limit = 60 * 24 * 366;
  for (let i = 0; i < limit; i++) {
    if (s.month !== WILDCARD && d.getUTCMonth() + 1 !== s.month) {
      d.setUTCMinutes(d.getUTCMinutes() + 1);
      continue;
    }
    if (s.dayOfMonth !== WILDCARD && d.getUTCDate() !== s.dayOfMonth) {
      d.setUTCMinutes(d.getUTCMinutes() + 1);
      continue;
    }
    if (s.dayOfWeek !== WILDCARD && isoDowUtc(d) !== s.dayOfWeek) {
      d.setUTCMinutes(d.getUTCMinutes() + 1);
      continue;
    }
    if (s.hour !== WILDCARD && d.getUTCHours() !== s.hour) {
      d.setUTCMinutes(d.getUTCMinutes() + 1);
      continue;
    }
    if (s.minute !== WILDCARD && d.getUTCMinutes() !== s.minute) {
      d.setUTCMinutes(d.getUTCMinutes() + 1);
      continue;
    }
    return d;
  }
  return;
}

export type Frequency = 'hourly' | 'daily' | 'weekly' | 'monthly';

export type RecurrentBuilderState =
  | { frequency: 'hourly'; minute: number }
  | { frequency: 'daily'; hour: number; minute: number }
  | { frequency: 'weekly'; hour: number; minute: number; dayOfWeek: number }
  | { frequency: 'monthly'; hour: number; minute: number; dayOfMonth: number };

const BUILDER_DEFAULTS = {
  hour: 9,
  minute: 0,
  dayOfWeek: 1,
  dayOfMonth: 1,
} as const;

export function withFrequency(
  state: RecurrentBuilderState,
  frequency: Frequency,
): RecurrentBuilderState {
  const hour = 'hour' in state ? state.hour : BUILDER_DEFAULTS.hour;
  const minute = state.minute;
  switch (frequency) {
    case 'hourly':
      return { frequency, minute };
    case 'daily':
      return { frequency, hour, minute };
    case 'weekly':
      return {
        frequency,
        hour,
        minute,
        dayOfWeek: 'dayOfWeek' in state ? state.dayOfWeek : BUILDER_DEFAULTS.dayOfWeek,
      };
    case 'monthly':
      return {
        frequency,
        hour,
        minute,
        dayOfMonth: 'dayOfMonth' in state ? state.dayOfMonth : BUILDER_DEFAULTS.dayOfMonth,
      };
  }
}

export function getTimezoneOffsetMinutes(timeZone: string, at: Date = new Date()): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const map: Record<string, string> = {};
  for (const p of dtf.formatToParts(at)) map[p.type] = p.value;
  let hour = Number(map.hour);
  if (hour === 24) hour = 0;
  const asUTC = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    hour,
    Number(map.minute),
    Number(map.second),
  );
  return Math.round((asUTC - at.getTime()) / 60000);
}

function shiftHourMinute(
  hour: number,
  minute: number,
  deltaMin: number,
): { hour: number; minute: number; dayShift: number } {
  const total = hour * 60 + minute + deltaMin;
  const dayShift = Math.floor(total / 1440);
  const within = ((total % 1440) + 1440) % 1440;
  return { hour: Math.floor(within / 60), minute: within % 60, dayShift };
}

function shiftDayOfWeek(dow: number, dayShift: number): number {
  return ((((dow - 1 + dayShift) % 7) + 7) % 7) + 1;
}

function shiftDayOfMonth(dom: number, dayShift: number): number {
  return ((((dom - 1 + dayShift) % 31) + 31) % 31) + 1;
}

export function buildScheduleFromStateInTz(
  s: RecurrentBuilderState,
  timeZone: string,
): RecurrentSchedule {
  const delta = -getTimezoneOffsetMinutes(timeZone);
  switch (s.frequency) {
    case 'hourly': {
      const minute = (((s.minute + delta) % 60) + 60) % 60;
      return { hour: WILDCARD, minute, dayOfWeek: WILDCARD, dayOfMonth: WILDCARD, month: WILDCARD };
    }
    case 'daily': {
      const { hour, minute } = shiftHourMinute(s.hour, s.minute, delta);
      return { hour, minute, dayOfWeek: WILDCARD, dayOfMonth: WILDCARD, month: WILDCARD };
    }
    case 'weekly': {
      const { hour, minute, dayShift } = shiftHourMinute(s.hour, s.minute, delta);
      return {
        hour,
        minute,
        dayOfWeek: shiftDayOfWeek(s.dayOfWeek, dayShift),
        dayOfMonth: WILDCARD,
        month: WILDCARD,
      };
    }
    case 'monthly': {
      const { hour, minute, dayShift } = shiftHourMinute(s.hour, s.minute, delta);
      return {
        hour,
        minute,
        dayOfWeek: WILDCARD,
        dayOfMonth: shiftDayOfMonth(s.dayOfMonth, dayShift),
        month: WILDCARD,
      };
    }
  }
}

export function shiftScheduleToTz(s: RecurrentSchedule, timeZone: string): RecurrentSchedule {
  const delta = getTimezoneOffsetMinutes(timeZone);
  const hourSet = s.hour !== WILDCARD;
  const minuteSet = s.minute !== WILDCARD;

  let newHour = s.hour;
  let newMinute = s.minute;
  let dayShift = 0;

  if (hourSet && minuteSet) {
    const r = shiftHourMinute(s.hour, s.minute, delta);
    newHour = r.hour;
    newMinute = r.minute;
    dayShift = r.dayShift;
  } else if (minuteSet) {
    newMinute = (((s.minute + delta) % 60) + 60) % 60;
  } else if (hourSet) {
    const total = s.hour * 60 + delta;
    dayShift = Math.floor(total / 1440);
    const within = ((total % 1440) + 1440) % 1440;
    newHour = Math.floor(within / 60);
  }

  let newDayOfWeek = s.dayOfWeek;
  let newDayOfMonth = s.dayOfMonth;
  if (dayShift !== 0) {
    if (s.dayOfWeek !== WILDCARD) newDayOfWeek = shiftDayOfWeek(s.dayOfWeek, dayShift);
    if (s.dayOfMonth !== WILDCARD) newDayOfMonth = shiftDayOfMonth(s.dayOfMonth, dayShift);
  }

  return {
    hour: newHour,
    minute: newMinute,
    dayOfWeek: newDayOfWeek,
    dayOfMonth: newDayOfMonth,
    month: s.month,
  };
}

export function describeUtcScheduleInTz(s: RecurrentSchedule, timeZone: string): string {
  return describeRecurrentSchedule(shiftScheduleToTz(s, timeZone), timeZone);
}

export function buildScheduleFromState(s: RecurrentBuilderState): RecurrentSchedule {
  switch (s.frequency) {
    case 'hourly':
      return {
        hour: WILDCARD,
        minute: s.minute,
        dayOfWeek: WILDCARD,
        dayOfMonth: WILDCARD,
        month: WILDCARD,
      };
    case 'daily':
      return {
        hour: s.hour,
        minute: s.minute,
        dayOfWeek: WILDCARD,
        dayOfMonth: WILDCARD,
        month: WILDCARD,
      };
    case 'weekly':
      return {
        hour: s.hour,
        minute: s.minute,
        dayOfWeek: s.dayOfWeek,
        dayOfMonth: WILDCARD,
        month: WILDCARD,
      };
    case 'monthly':
      return {
        hour: s.hour,
        minute: s.minute,
        dayOfWeek: WILDCARD,
        dayOfMonth: s.dayOfMonth,
        month: WILDCARD,
      };
  }
}
