'use client';

import { fetchAutomation } from '@/features/automations/queries/automations';
import { queryKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';

export function useAutomation(automationHash?: Hex) {
  return useQuery({
    queryKey: queryKeys.automation(automationHash),
    queryFn: () => fetchAutomation(automationHash),
    enabled: Boolean(automationHash),
  });
}
