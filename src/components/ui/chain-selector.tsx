'use client';

import { networks } from '@/context/AppProviders';
import { useAppKitNetwork } from '@reown/appkit/react';

const CHAIN_ICON_BY_ID: Record<string, string> = {
  '11155111': 'sepolia',
  '10200': 'chiado',
  '84532': 'base-sepolia',
};

function chainIconSrc(id: number | string | undefined): string | undefined {
  if (id === undefined) return;
  const key = CHAIN_ICON_BY_ID[String(id)];
  return key ? `/assets/chains/${key}.png` : undefined;
}

function ChainSelector() {
  const { chainId, switchNetwork } = useAppKitNetwork();

  if (networks.length === 0) return;

  const iconSrc = chainIconSrc(chainId);

  return (
    <div className="flex items-center gap-2 border border-(--border) rounded-full p-1 pr-2">
      {iconSrc && (
        <img
          src={iconSrc}
          alt=""
          aria-hidden="true"
          width={24}
          height={24}
          className="rounded-full shrink-0"
        />
      )}
      <select
        value={chainId !== undefined ? String(chainId) : ''}
        onChange={(e) => {
          const target = networks.find((n) => String(n.id) === e.target.value);
          if (target) switchNetwork(target);
        }}
        className="text-(--text) text-xs cursor-pointer appearance-none outline-none min-w-auto"
      >
        {networks.map((n) => (
          <option key={String(n.id)} value={String(n.id)}>
            {n.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ChainSelector;
