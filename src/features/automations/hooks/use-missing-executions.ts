'use client';

import type { Automation } from '@/features/automations/queries/automations';
import type { Execution } from '@/features/automations/queries/executions';
import { findMissingExecutions } from '@/features/automations/utils/find-missing-executions';
import { queryKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';
import type { Hex } from 'viem';
import { usePublicClient } from 'wagmi';

export function useMissingExecutions(automation?: Automation, executions?: Execution[]) {
  const publicClient = usePublicClient();
  return useQuery({
    queryKey: [
      ...queryKeys.missingExecutions(automation?.automationHash as Hex | undefined),
      executions?.length ?? 0,
    ],
    queryFn: () => findMissingExecutions(automation!, executions ?? [], publicClient!),
    enabled: Boolean(automation && publicClient && executions),
  });
}
