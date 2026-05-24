import { env } from '@/config/env';
import { Hex, type Address } from 'viem';

export type Automation = {
  automationHash: string;
  safe: string;
  strategy: string;
  chainId: bigint;
  to: string;
  value: bigint;
  data: string;
  trigger: string;
  salt: string;
  title: string;
  isActive: boolean;
  createdAtBlock: number;
  updatedAtBlock: number;
  lastExecuted: number;
  executionCount: number;
};

export async function fetchAutomations(
  safe: Address,
  chainId: number,
): Promise<Automation[] | undefined> {
  if (!safe || !chainId) return;
  try {
    const res = await fetch(
      `${env.automationServiceUrl}/api/v1/automations?safe=${safe.toLowerCase()}&chainId=${chainId}`,
    );
    if (!res.ok) return;
    const body = (await res.json()) as { automations: Automation[] };
    return body.automations;
  } catch (error) {
    console.error(error);
    return;
  }
}

export async function fetchAutomation(
  automationHash: Hex,
  chainId: number,
): Promise<Automation | undefined> {
  if (!automationHash || !chainId) return;
  try {
    const res = await fetch(
      `${env.automationServiceUrl}/api/v1/automations/${automationHash}?chainId=${chainId}`,
    );
    if (!res.ok) return;
    const body = await res.json();
    return body;
  } catch (error) {
    console.error(error);
    return;
  }
}
