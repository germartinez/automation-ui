import type { Address } from 'viem';
import { sepolia } from 'viem/chains';

type Deployment = {
  automationModule: Address;
  recurrentStrategy: Address;
};

const DEPLOYMENTS: Record<number, Deployment> = {
  [sepolia.id]: {
    automationModule: '',
    recurrentStrategy: '',
  },
};

export const DEFAULT_CHAIN_ID = sepolia.id;

export function getDeployment(chainId: number = DEFAULT_CHAIN_ID): Deployment {
  const base = DEPLOYMENTS[chainId];
  if (!base) {
    throw new Error(`No deployment configured for chain ${chainId}`);
  }
  return {
    automationModule: base.automationModule,
    recurrentStrategy: base.recurrentStrategy,
  };
}

export const AUTOMATION_MODULE_ADDRESS = getDeployment().automationModule;
export const RECURRENT_STRATEGY_ADDRESS = getDeployment().recurrentStrategy;
