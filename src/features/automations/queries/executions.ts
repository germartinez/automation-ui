import type { Hex } from 'viem';

export type Execution = {
  automationHash: Hex;
  txHash: Hex;
  blockNumber: number;
  timestamp: number;
  executionCount: number;
};

const SERVICE_URL = process.env.NEXT_PUBLIC_AUTOMATION_SERVICE_URL ?? 'http://localhost:3001';

export async function fetchExecutions(hash: Hex): Promise<Execution[]> {
  if (!hash) return [];
  const res = await fetch(`${SERVICE_URL}/automations/${hash}/executions`);
  if (!res.ok) return [];
  const body = (await res.json()) as { executions: Execution[] };
  return body.executions ?? [];
}
