'use client';

import { useEffect, useState } from 'react';
import type { Hex } from 'viem';
import { nextRunFor } from '../utils/describe-trigger';

export function useLiveNextRun(trigger: Hex, isActive: boolean): Date | undefined {
  const [next, setNext] = useState(() => nextRunFor(trigger, isActive));
  const [, setTick] = useState(0);

  useEffect(() => {
    setNext(nextRunFor(trigger, isActive));
  }, [trigger, isActive]);

  useEffect(() => {
    if (!isActive) return;
    const id = setInterval(() => {
      setNext((current) => {
        if (current && Date.now() >= current.getTime()) {
          return nextRunFor(trigger, isActive);
        }
        return current;
      });
      setTick((t) => (t + 1) % 1_000_000);
    }, 1000);
    return () => clearInterval(id);
  }, [trigger, isActive]);

  return next;
}
