'use client';

import { fetchAutomation } from '@/features/automations/queries/automations';
import { queryKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';
import { useChainId } from 'wagmi';

export function useAutomation(automationHash?: Hex) {
  const chainId = useChainId();
  return useQuery({
    queryKey: queryKeys.automation(automationHash, chainId),
    queryFn: () => fetchAutomation(automationHash!, chainId),
    enabled: Boolean(automationHash && chainId),
  });
}
