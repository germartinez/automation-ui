'use client';

import { getTimezoneOffsetMinutes } from '@/lib/recurrent';
import { formatTimezoneOffset } from '@/utils/time';
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type TimezoneOption = { value: string; label: string };

type TimezoneContextValue = {
  timeZone: string;
  setTimezone: (timeZone: string) => void;
  options: TimezoneOption[];
};

const TimezoneContext = createContext<TimezoneContextValue | undefined>(undefined);

function listTimezones(): string[] {
  const intl = Intl as typeof Intl & { supportedValuesOf?: (key: string) => string[] };
  try {
    return intl.supportedValuesOf?.('timeZone') ?? ['UTC'];
  } catch {
    return ['UTC'];
  }
}

function buildOptions(): TimezoneOption[] {
  return listTimezones()
    .map((z) => ({ z, offset: getTimezoneOffsetMinutes(z) }))
    .sort((a, b) => a.offset - b.offset || a.z.localeCompare(b.z))
    .map(({ z, offset }) => ({
      value: z,
      label: `${formatTimezoneOffset(offset)} ${z}`,
    }));
}

export function TimezoneProvider({ children }: { children: ReactNode }) {
  const [timeZone, setTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const options = useMemo(buildOptions, []);

  return (
    <TimezoneContext.Provider value={{ timeZone, setTimezone, options }}>
      {children}
    </TimezoneContext.Provider>
  );
}

export function useTimezone(): TimezoneContextValue {
  const ctx = useContext(TimezoneContext);
  if (!ctx) throw new Error('useTimezone must be used within TimezoneProvider');
  return ctx;
}
