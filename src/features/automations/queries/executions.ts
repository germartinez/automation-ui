import { env } from '@/config/env';
import type { Hex } from 'viem';

export type Execution = {
  automationHash: Hex;
  txHash: Hex;
  blockNumber: number;
  timestamp: number;
  executionCount: number;
};

export async function fetchExecutions(hash: Hex): Promise<Execution[] | undefined> {
  if (!hash) return;
  try {
    const res = await fetch(`${env.automationServiceUrl}/automations/${hash}/executions`);
    if (!res.ok) return;
    const body = (await res.json()) as { executions: Execution[] };
    return body.executions;
  } catch (error) {
    console.error(error);
    return;
  }
}
