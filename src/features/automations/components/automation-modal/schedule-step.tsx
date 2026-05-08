'use client';

import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import Select from '@/components/ui/select';
import { useTimezone } from '@/context/TimezoneProvider';
import {
  buildScheduleFromState,
  buildScheduleFromStateInTz,
  describeRecurrentSchedule,
  isValidRecurrentSchedule,
  nextOccurrenceUtc,
  withFrequency,
  type Frequency,
  type RecurrentBuilderState,
} from '@/lib/recurrent';
import { formatDateTime, timeUntil } from '@/utils/time';
import type { WhenDraft } from './utils';

const DAY_OF_WEEK_OPTIONS = [
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
  { value: '6', label: 'Saturday' },
  { value: '7', label: 'Sunday' },
];

const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

function SchedulePreview({ state, timeZone }: { state: RecurrentBuilderState; timeZone: string }) {
  const localSchedule = buildScheduleFromState(state);

  if (!isValidRecurrentSchedule(localSchedule)) {
    return (
      <div className="text-md text-(--error-text) bg-(--surface-alt) rounded-lg p-4">
        Invalid schedule
      </div>
    );
  }

  const utcSchedule = buildScheduleFromStateInTz(state, timeZone);
  const next = nextOccurrenceUtc(utcSchedule);

  return (
    <div className="text-md text-(--text-sec) bg-(--surface-alt) rounded-lg p-4">
      <div>
        <span className="text-(--text-ter)">Schedule: </span>
        <span className="text-(--text)">{describeRecurrentSchedule(localSchedule, timeZone)}</span>
      </div>
      {next && (
        <div>
          <span className="text-(--text-ter)">Next: </span>
          <span className="text-(--text)">
            {formatDateTime(next, timeZone)} ({timeUntil(next)})
          </span>
        </div>
      )}
      {timeZone && (
        <div>
          <span className="text-(--text-ter)">Timezone: </span>
          <span className="text-(--text)">{timeZone}</span>
        </div>
      )}
    </div>
  );
}

type WhenScheduleFieldsProps = {
  draft: WhenDraft;
  onChange: (next: WhenDraft) => void;
};

export default function WhenScheduleFields({ draft, onChange }: WhenScheduleFieldsProps) {
  const state = draft.builder;
  const { timeZone } = useTimezone();

  const setBuilder = (builder: RecurrentBuilderState) => onChange({ kind: 'recurrent', builder });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Frequency</Label>
        <Select
          value={state.frequency}
          onChange={(v) => setBuilder(withFrequency(state, v as Frequency))}
          options={FREQUENCY_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
      </div>
      {state.frequency === 'weekly' && (
        <div className="flex flex-col gap-1.5">
          <Label>Day of week</Label>
          <Select
            value={String(state.dayOfWeek)}
            onChange={(v) => setBuilder({ ...state, dayOfWeek: Number(v) })}
            options={DAY_OF_WEEK_OPTIONS}
          />
        </div>
      )}
      {state.frequency === 'monthly' && (
        <div className="flex flex-col gap-1.5">
          <Label>Day of month</Label>
          <Input
            type="number"
            value={state.dayOfMonth}
            min={1}
            max={31}
            onChange={(dayOfMonth) => setBuilder({ ...state, dayOfMonth: Number(dayOfMonth) })}
          />
        </div>
      )}
      <div className="flex flex-row gap-4">
        {state.frequency !== 'hourly' && (
          <div className="flex flex-col gap-1.5 w-full">
            <Label>Hour ({timeZone})</Label>
            <Input
              type="number"
              value={state.hour}
              min={0}
              max={23}
              onChange={(hour) => setBuilder({ ...state, hour: Number(hour) })}
            />
          </div>
        )}
        <div className="flex flex-col gap-1.5 w-full">
          <Label>Minute</Label>
          <Input
            type="number"
            value={state.minute}
            min={0}
            max={59}
            onChange={(minute) => setBuilder({ ...state, minute: Number(minute) })}
          />
        </div>
      </div>
      <SchedulePreview state={state} timeZone={timeZone} />
    </div>
  );
}
