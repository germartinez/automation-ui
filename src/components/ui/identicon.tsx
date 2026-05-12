'use client';

import makeBlockie from 'ethereum-blockies-base64';
import { useMemo } from 'react';

type IdenticonProps = {
  address?: string;
  size?: number;
};

export default function Identicon({ address, size = 32 }: IdenticonProps) {
  const src = useMemo(() => (address ? makeBlockie(address) : undefined), [address]);

  if (!src) {
    return (
      <span
        aria-hidden="true"
        className="inline-block rounded-full shrink-0 bg-(--surface-alt)"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <img
      aria-hidden="true"
      src={src}
      width={size}
      height={size}
      alt=""
      className="inline-block rounded-full shrink-0"
      style={{ width: size, height: size }}
    />
  );
}
