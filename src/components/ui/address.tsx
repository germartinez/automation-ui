'use client';

import Button from '@/components/ui/button';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';

type AddressDisplayProps = {
  address: string;
  full?: boolean;
};

function AddressDisplay({ address, full = false }: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);
  const short = `${address.slice(0, 6)}...${address.slice(-4)}`;

  const copy = () => {
    navigator.clipboard.writeText(address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <span className="inline-flex items-center gap-1">
      {full ? (
        <>
          <span className="text-sm text-(--text-sec) hidden md:inline">{address}</span>
          <span className="text-sm text-(--text-sec) md:hidden">{short}</span>
        </>
      ) : (
        <span className="text-sm text-(--text-sec)">{short}</span>
      )}
      <Button
        variant="secondary"
        onClick={copy}
        size="sm"
        className="p-0! border-none rounded-full"
      >
        {copied ? (
          <CheckIcon size={12} color={`var(--text-ter)`} />
        ) : (
          <CopyIcon size={12} color={`var(--text-ter)`} />
        )}
      </Button>
    </span>
  );
}

export default AddressDisplay;
