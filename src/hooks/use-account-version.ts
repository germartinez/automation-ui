'use client';

import { fetchAccountVersion } from '@/queries/account-version';
import { queryKeys } from '@/queries/keys';
import { useQuery } from '@tanstack/react-query';
import { type Address, isAddress } from 'viem';
import { usePublicClient } from 'wagmi';

export function useAccountVersion(address?: Address) {
  const publicClient = usePublicClient();
  const enabled = Boolean(address && isAddress(address) && publicClient);
  return useQuery({
    queryKey: queryKeys.accountVersion(address),
    queryFn: () => fetchAccountVersion(publicClient!, address!),
    enabled,
  });
}
