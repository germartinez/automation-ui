'use client';

import {
  createAutomation,
  type CreateAutomationParams,
  type CreateAutomationStage,
} from '@/features/automations/queries/create-automation';
import { queryKeys } from '@/queries/keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useChainId, usePublicClient, useWriteContract } from 'wagmi';

export function useCreateAutomation() {
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const { mutateAsync: writeContract } = useWriteContract();
  const queryClient = useQueryClient();
  const [stage, setStage] = useState<CreateAutomationStage>();

  const mutation = useMutation({
    mutationFn: async (params: CreateAutomationParams) => {
      if (!publicClient) throw new Error('Wallet not connected');
      await createAutomation({ publicClient, writeContract, onStage: setStage }, params);
      return params.safe;
    },
    onSettled: (safe) => {
      setStage(undefined);
      queryClient.invalidateQueries({ queryKey: queryKeys.automations(safe, chainId) });
    },
  });

  return {
    createAutomation: mutation.mutateAsync,
    submitting: mutation.isPending,
    stage,
  };
}
