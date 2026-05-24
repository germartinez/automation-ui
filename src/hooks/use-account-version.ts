'use client';

import { fetchAccountVersion } from '@/queries/account-version';
import { queryKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';
import { type Address, isAddress } from 'viem';
import { useChainId, usePublicClient } from 'wagmi';

export function useAccountVersion(address?: Address) {
  const chainId = useChainId();
  const publicClient = usePublicClient({ chainId });
  return useQuery({
    queryKey: queryKeys.accountVersion(address, chainId),
    queryFn: () => fetchAccountVersion(publicClient!, address!),
    enabled: Boolean(address && isAddress(address) && publicClient && chainId),
  });
}
