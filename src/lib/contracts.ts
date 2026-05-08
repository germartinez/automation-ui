import type { Address } from 'viem';
import { automationModuleAbi, recurrentStrategyAbi, safeAbi } from '@/config/abis';
import { AUTOMATION_MODULE_ADDRESS, RECURRENT_STRATEGY_ADDRESS } from '@/config/addresses';

export { automationModuleAbi, recurrentStrategyAbi, safeAbi };
export { AUTOMATION_MODULE_ADDRESS, RECURRENT_STRATEGY_ADDRESS };

export type StrategyKind = 'onetime' | 'recurrent' | 'conditional';

export function strategyLabel(strategy: Address): string {
  if (strategy.toLowerCase() === RECURRENT_STRATEGY_ADDRESS.toLowerCase()) return 'Recurrent';
  return 'Unknown';
}
