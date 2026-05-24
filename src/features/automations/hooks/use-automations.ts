'use client';

import { fetchAutomations } from '@/features/automations/queries/automations';
import { queryKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';
import { type Address } from 'viem';
import { useChainId } from 'wagmi';

export function useAutomations(safe?: Address) {
  const chainId = useChainId();
  return useQuery({
    queryKey: queryKeys.automations(safe, chainId),
    queryFn: () => fetchAutomations(safe!, chainId),
    enabled: Boolean(safe && chainId),
  });
}
