'use client';

import {
  deleteAutomation,
  type DeleteAutomationParams,
} from '@/features/automations/queries/delete-automation';
import { queryKeys } from '@/queries/keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Address } from 'viem';
import { useChainId, usePublicClient, useWriteContract } from 'wagmi';

export function useDeleteAutomation(safe?: Address) {
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const { mutateAsync: writeContract } = useWriteContract();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (params: DeleteAutomationParams) => {
      if (!publicClient) throw new Error('Wallet not connected');
      await deleteAutomation({ publicClient, writeContract }, params);
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
    removeAutomation: mutation.mutateAsync,
    submitting: mutation.isPending,
  };
}
