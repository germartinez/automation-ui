import { type Address, type Hex } from 'viem';

export const queryKeys = {
  automations: (safe?: Address) => ['automations', safe?.toLowerCase()] as const,
  automation: (hash?: Hex) => ['automation', hash?.toLowerCase()] as const,
  accountVersion: (address?: Address) => ['account-version', address?.toLowerCase()] as const,
  executions: (hash?: Hex) => ['executions', hash?.toLowerCase()] as const,
  missingExecutions: (hash?: Hex) => ['missing-executions', hash?.toLowerCase()] as const,
};
