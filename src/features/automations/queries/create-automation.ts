import type { PublicClient } from 'viem';
import { type Address, type Hex } from 'viem';
import type { useWriteContract } from 'wagmi';
import {
  AUTOMATION_MODULE_ADDRESS,
  RECURRENT_STRATEGY_ADDRESS,
  automationModuleAbi,
  safeAbi,
} from '@/lib/contracts';

export type CreateAutomationStage = 'enabling-module' | 'creating';

export type CreateAutomationParams = {
  safe: Address;
  to: Address;
  value: bigint;
  data: Hex;
  trigger: Hex;
  salt?: Hex;
  title: string;
};

type WriteContract = ReturnType<typeof useWriteContract>['mutateAsync'];

export type CreateAutomationContext = {
  publicClient: PublicClient;
  writeContract: WriteContract;
  onStage?: (stage: CreateAutomationStage | undefined) => void;
};

export async function createAutomation(
  { publicClient, writeContract, onStage }: CreateAutomationContext,
  params: CreateAutomationParams,
): Promise<void> {
  const salt = (params.salt ??
    '0x0000000000000000000000000000000000000000000000000000000000000000') as Hex;

  const enabled = (await publicClient.readContract({
    address: params.safe,
    abi: safeAbi,
    functionName: 'isModuleEnabled',
    args: [AUTOMATION_MODULE_ADDRESS],
  })) as boolean;

  if (!enabled) {
    onStage?.('enabling-module');
    const enableHash = await writeContract({
      address: params.safe,
      abi: safeAbi,
      functionName: 'enableModule',
      args: [AUTOMATION_MODULE_ADDRESS],
    });
    await publicClient.waitForTransactionReceipt({ hash: enableHash });
  }

  onStage?.('creating');
  const createHash = await writeContract({
    address: AUTOMATION_MODULE_ADDRESS,
    abi: automationModuleAbi,
    functionName: 'createAutomation',
    args: [
      RECURRENT_STRATEGY_ADDRESS,
      params.to,
      params.value,
      params.data,
      params.trigger,
      salt,
      params.title,
    ],
  });
  await publicClient.waitForTransactionReceipt({ hash: createHash });
  onStage?.(undefined);
}
