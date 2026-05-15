'use client';

import { cn } from '@/utils';
import { explorerAddress, explorerTx } from '@/utils/explorer';
import { CheckIcon, CopyIcon, ExternalLinkIcon } from 'lucide-react';
import { useState } from 'react';
import { isAddress } from 'viem';

type HexDisplayProps = {
  hex: string;
  full?: boolean;
  className?: string;
};

function HexDisplay({ hex, full = false, className }: HexDisplayProps) {
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
    <span className={cn('inline-flex items-center gap-1', className)}>
      <span className="truncate">{full ? hex : hexString}</span>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 text-(--text-ter) hover:text-(--text)"
        aria-label={`Copy ${isEthAddress ? 'address' : 'hash'}`}
      >
        {copied ? (
          <CheckIcon size={12} className="text-(--text-ter) hover:text-(--text-sec)" />
        ) : (
          <CopyIcon size={12} className="text-(--text-ter) hover:text-(--text-sec)" />
        )}
      </button>
      <a
        href={isEthAddress ? explorerAddress(hex) : explorerTx(hex)}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-(--text-ter) hover:text-(--text-sec)"
        aria-label="Open in explorer"
      >
        <ExternalLinkIcon size={12} />
      </a>
    </span>
  );
}

export default HexDisplay;
