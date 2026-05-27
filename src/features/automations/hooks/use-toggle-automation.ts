'use client';

import {
  toggleAutomation,
  type ToggleAutomationParams,
} from '@/features/automations/queries/toggle-automation';
import { queryKeys } from '@/queries/keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Address } from 'viem';
import { useChainId, usePublicClient, useWriteContract } from 'wagmi';

export function useToggleAutomation(safe?: Address) {
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const { mutateAsync: writeContract } = useWriteContract();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (params: ToggleAutomationParams) => {
      if (!publicClient) throw new Error('Wallet not connected');
      await toggleAutomation({ publicClient, writeContract }, params);
      return params.automationHash;
    },
    onSettled: (automationHash) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.automations(safe, chainId) });
      if (automationHash) {
        queryClient.invalidateQueries({ queryKey: queryKeys.automation(automationHash, chainId) });
      }
    },
  });

  return {
    toggleAutomation: mutation.mutateAsync,
    submitting: mutation.isPending,
  };
}
