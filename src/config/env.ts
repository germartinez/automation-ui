function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export const env = {
  reownProjectId: required(
    'NEXT_PUBLIC_REOWN_PROJECT_ID',
    process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
  ),
  automationServiceUrl: required(
    'NEXT_PUBLIC_AUTOMATION_SERVICE_URL',
    process.env.NEXT_PUBLIC_AUTOMATION_SERVICE_URL,
  ),
  automationModuleAddressSepolia: required(
    'NEXT_PUBLIC_AUTOMATION_MODULE_ADDRESS_SEPOLIA',
    process.env.NEXT_PUBLIC_AUTOMATION_MODULE_ADDRESS_SEPOLIA,
  ),
  recurrentStrategyAddressSepolia: required(
    'NEXT_PUBLIC_RECURRENT_STRATEGY_ADDRESS_SEPOLIA',
    process.env.NEXT_PUBLIC_RECURRENT_STRATEGY_ADDRESS_SEPOLIA,
  ),
} as const;
