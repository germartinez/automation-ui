'use client';

import { fetchAutomations } from '@/features/automations/queries/automations';
import { queryKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';
import { type Address } from 'viem';

export function useAutomations(safe?: Address) {
  return useQuery({
    queryKey: queryKeys.automations(safe),
    queryFn: () => fetchAutomations(safe),
    enabled: Boolean(safe),
  });
}
