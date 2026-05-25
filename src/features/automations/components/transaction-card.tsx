'use client';

import Badge from '@/components/ui/badge';
import HexDisplay from '@/components/ui/hex-display';
import type { Automation } from '@/features/automations/queries/automations';
import { formatEther } from 'viem';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 items-start">
      <span className="text-xs font-semibold uppercase text-(--text-ter)">{label}</span>
      {children}
    </div>
  );
}

type TransactionCardProps = {
  automation: Automation;
};

export default function TransactionCard({ automation }: TransactionCardProps) {
  const { to, value, data } = automation;
  const amount = value ? formatEther(value) : '0';

  return (
    <div className="bg-(--surface) border border-(--border) rounded-xl p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase font-semibold text-(--text-ter)">Transaction</h3>
      </div>
      <div className="flex flex-col gap-6">
        <Field label="Network">
          <Badge dot status="other" label="Sepolia" />
        </Field>
        <Field label="Recipient">
          <HexDisplay hex={to} full identicon />
        </Field>
        <Field label="Value">
          <div className="flex items-baseline gap-1">
            <span className="text-xl text-(--text) tabular-nums">{amount}</span>
            <span className="text-xl text-(--text)">ETH</span>
          </div>
        </Field>
        {data && data !== '0x' && (
          <Field label="Data">
            <span className="text-xs text-(--text-ter) mt-1.5">{data}</span>
          </Field>
        )}
      </div>
    </div>
  );
}
