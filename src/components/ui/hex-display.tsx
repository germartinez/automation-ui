'use client';

import { explorerAddress, explorerTx } from '@/utils/explorer';
import { CheckIcon, CopyIcon, ExternalLinkIcon } from 'lucide-react';
import { useState } from 'react';
import { isAddress } from 'viem';

type HexDisplayProps = {
  hex: string;
  full?: boolean;
};

function HexDisplay({ hex, full = false }: HexDisplayProps) {
  const [copied, setCopied] = useState(false);
  const isEthAddress = isAddress(hex);
  const hexString = isEthAddress
    ? `${hex.slice(0, 6)}...${hex.slice(-4)}`
    : `${hex.slice(0, 10)}...`;

  const copy = () => {
    navigator.clipboard.writeText(hex).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <span className="flex items-center gap-1">
      {full ? (
        <span className="text-sm truncate">{hex}</span>
      ) : (
        <span className="text-sm text-(--text-sec) truncate">{hexString}</span>
      )}
      <button
        onClick={copy}
        className="text-(--text-ter) hover:text-(--text) m-0 p-0 border-none rounded-none"
        aria-label={`Copy ${isEthAddress ? 'address' : 'hash'}`}
      >
        {copied ? (
          <CheckIcon size={12} color={`var(--text-ter)`} />
        ) : (
          <CopyIcon size={12} color={`var(--text-ter)`} />
        )}
      </button>
      <a
        href={isEthAddress ? explorerAddress(hex) : explorerTx(hex)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-(--text-ter) hover:text-(--text) shrink-0"
        aria-label="Open in explorer"
      >
        <ExternalLinkIcon size={12} color={`var(--text-ter)`} />
      </a>
    </span>
  );
}

export default HexDisplay;
