'use client';

import { cn } from '@/utils';
import { explorerAddress, explorerTx } from '@/utils/explorer';
import { CheckIcon, CopyIcon, ExternalLinkIcon } from 'lucide-react';
import { useState } from 'react';
import { isAddress } from 'viem';
import Identicon from './identicon';

type HexDisplayProps = {
  hex: string;
  full?: boolean;
  className?: string;
  identicon?: boolean;
  badge?: boolean;
  label?: string;
};

function HexDisplay({ hex, full, className, identicon, badge, label }: HexDisplayProps) {
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
    <span
      className={cn(
        'flex items-center gap-2 truncate',
        badge && 'border border-(--border) rounded-full gap-2 py-2 px-2',
        badge && identicon && !label && 'p-1 pr-3',
        badge && identicon && label && 'p-1 px-1.5 pr-4',
        className,
      )}
    >
      {identicon && <Identicon address={hex} size={label ? 32 : !badge ? 32 : 24} />}
      <div className="flex flex-col gap-0 truncate">
        {label && <span className="text-sm text-(--text) font-medium truncate">{label}</span>}
        <div className="flex items-center gap-1">
          <span
            className={cn(
              'truncate text-sm',
              badge && 'text-xs',
              label && 'text-(--text-ter) text-xs',
            )}
          >
            {full ? hex : hexString}
          </span>
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
        </div>
      </div>
    </span>
  );
}

export default HexDisplay;
