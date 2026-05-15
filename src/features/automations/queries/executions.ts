import { env } from '@/config/env';
import type { Hex } from 'viem';

export type Execution = {
  txHash: Hex;
  blockNumber: bigint;
  blockTimestamp: number;
  from: string;
  gasUsed: string;
  automationHash: Hex;
  executionCount: number;
};

export async function fetchExecutions(hash: Hex): Promise<Execution[] | undefined> {
  if (!hash) return;
  try {
    const res = await fetch(`${env.automationServiceUrl}/api/v1/automations/${hash}/executions`);
    if (!res.ok) return;
    const body = await res.json();
    return body;
  } catch (error) {
    console.error(error);
    return;
  }
}
