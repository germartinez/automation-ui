import type { Automation } from '@/features/automations/queries/automations';
import type { Execution } from '@/features/automations/queries/executions';
import { expectedOccurrencesBetween } from '@/lib/recurrent';
import type { Hex, PublicClient } from 'viem';
import { decodeTriggerSchedule } from './describe-trigger';

export type MissingExecution = {
  scheduledAt: number;
  blockNumber: bigint;
};

const WINDOW_SEC = 10 * 60;

export async function findMissingExecutions(
  automation: Automation,
  executions: Execution[],
  publicClient: PublicClient,
): Promise<MissingExecution[]> {
  const schedule = decodeTriggerSchedule(automation.trigger as Hex);
  if (!schedule) return [];

  const createdBlockNum = BigInt(automation.createdAtBlock);
  const [createdBlock, latestBlock] = await Promise.all([
    publicClient.getBlock({ blockNumber: createdBlockNum }),
    publicClient.getBlock(),
  ]);

  const createdAtSec = Number(createdBlock.timestamp);
  const latestSec = Number(latestBlock.timestamp);
  const blockSpan = Number(latestBlock.number - createdBlockNum);
  const blockTime = blockSpan > 0 ? (latestSec - createdAtSec) / blockSpan : 12;

  const occurrences = expectedOccurrencesBetween(schedule, createdAtSec, latestSec);
  const actual = executions.map((e) => e.blockTimestamp).sort((a, b) => a - b);

  const missing: MissingExecution[] = [];
  for (const occ of occurrences) {
    const occSec = Math.floor(occ.getTime() / 1000);
    const matched = actual.some((t) => t >= occSec && t <= occSec + WINDOW_SEC);
    if (matched) continue;

    const deltaBlocks = Math.max(0, Math.floor((occSec - createdAtSec) / blockTime));
    missing.push({
      scheduledAt: occSec,
      blockNumber: createdBlockNum + BigInt(deltaBlocks),
    });
  }
  return missing;
}
