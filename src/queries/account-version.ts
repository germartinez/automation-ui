import { safeAbi } from '@/lib/contracts';
import type { PublicClient } from 'viem';
import { type Address } from 'viem';

export type AccountVersion =
  | { status: 'incompatible' }
  | { status: 'unsupported-version'; version: string }
  | { status: 'ok'; version: string };

function compareSemver(a: string, b: string): number {
  const pa = a.split('.').map((x) => parseInt(x, 10));
  const pb = b.split('.').map((x) => parseInt(x, 10));
  for (let i = 0; i < 3; i++) {
    const x = pa[i] ?? 0;
    const y = pb[i] ?? 0;
    if (x !== y) return x - y;
  }
  return 0;
}

export async function fetchAccountVersion(
  publicClient: PublicClient,
  address: Address,
): Promise<AccountVersion> {
  try {
    const version = (await publicClient.readContract({
      address,
      abi: safeAbi,
      functionName: 'VERSION',
    })) as string;
    if (compareSemver(version, '1.3.0') < 0) {
      return { status: 'unsupported-version', version };
    }
    return { status: 'ok', version };
  } catch {
    return {
      status: 'incompatible',
    };
  }
}
