import type { Hex, PublicClient } from 'viem';
import type { useWriteContract } from 'wagmi';
import { AUTOMATION_MODULE_ADDRESS, automationModuleAbi } from '@/lib/contracts';

type WriteContract = ReturnType<typeof useWriteContract>['mutateAsync'];

export type ToggleAutomationContext = {
  publicClient: PublicClient;
  writeContract: WriteContract;
};

export type ToggleAutomationParams = {
  automationHash: Hex;
  isActive: boolean;
};

export async function toggleAutomation(
  { publicClient, writeContract }: ToggleAutomationContext,
  { automationHash, isActive }: ToggleAutomationParams,
): Promise<void> {
  const hash = await writeContract({
    address: AUTOMATION_MODULE_ADDRESS,
    abi: automationModuleAbi,
    functionName: isActive ? 'pauseAutomation' : 'resumeAutomation',
    args: [automationHash],
  });
  await publicClient.waitForTransactionReceipt({ hash });
}
