import type { Hex, PublicClient } from 'viem';
import type { useWriteContract } from 'wagmi';
import { AUTOMATION_MODULE_ADDRESS, automationModuleAbi } from '@/lib/contracts';

type WriteContract = ReturnType<typeof useWriteContract>['mutateAsync'];

export type DeleteAutomationContext = {
  publicClient: PublicClient;
  writeContract: WriteContract;
};

export type DeleteAutomationParams = {
  automationHash: Hex;
};

export async function deleteAutomation(
  { publicClient, writeContract }: DeleteAutomationContext,
  { automationHash }: DeleteAutomationParams,
): Promise<void> {
  const hash = await writeContract({
    address: AUTOMATION_MODULE_ADDRESS,
    abi: automationModuleAbi,
    functionName: 'deleteAutomation',
    args: [automationHash],
  });
  await publicClient.waitForTransactionReceipt({ hash });
}
