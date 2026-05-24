import { type Address, type Hex } from 'viem';

export const queryKeys = {
  automations: (safe?: Address, chainId?: number) =>
    ['automations', safe?.toLowerCase(), chainId] as const,
  automation: (hash?: Hex, chainId?: number) =>
    ['automation', hash?.toLowerCase(), chainId] as const,
  accountVersion: (address?: Address, chainId?: number) =>
    ['account-version', address?.toLowerCase(), chainId] as const,
  executions: (hash?: Hex, chainId?: number) =>
    ['executions', hash?.toLowerCase(), chainId] as const,
  missingExecutions: (hash?: Hex, chainId?: number) =>
    ['missing-executions', hash?.toLowerCase(), chainId] as const,
};
