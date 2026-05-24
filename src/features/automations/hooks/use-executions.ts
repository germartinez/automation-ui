'use client';

import { fetchExecutions } from '@/features/automations/queries/executions';
import { queryKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';
import { type Hex } from 'viem';
import { useChainId } from 'wagmi';

export function useExecutions(hash?: Hex) {
  const chainId = useChainId();
  return useQuery({
    queryKey: queryKeys.executions(hash, chainId),
    queryFn: () => fetchExecutions(hash!, chainId),
    enabled: Boolean(hash && chainId),
    refetchInterval: 5_000,
  });
}
