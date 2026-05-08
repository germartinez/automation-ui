'use client';

import { fetchExecutions } from '@/features/automations/queries/executions';
import { queryKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';
import { type Hex } from 'viem';

export function useExecutions(hash?: Hex) {
  return useQuery({
    queryKey: queryKeys.executions(hash),
    queryFn: () => fetchExecutions(hash!),
    enabled: Boolean(hash),
    refetchInterval: 5_000,
  });
}
