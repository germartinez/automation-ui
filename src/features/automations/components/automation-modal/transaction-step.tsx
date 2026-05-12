'use client';

import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import type { TransactionDraft } from './utils';

type TransactionFieldsProps = {
  draft: TransactionDraft;
  onChange: (next: TransactionDraft) => void;
};

export default function TransactionFields({ draft, onChange }: TransactionFieldsProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-1.5">
        <Label>Target</Label>
        <Input
          value={draft.target}
          onChange={(value) => onChange({ ...draft, target: String(value) })}
          placeholder="0x..."
        />
      </div>
      <div className="grid gap-1.5">
        <Label>Value (ETH)</Label>
        <Input
          value={draft.value}
          onChange={(value) => onChange({ ...draft, value: String(value) })}
          placeholder="0"
        />
      </div>
      <div className="grid gap-1.5">
        <Label>Data</Label>
        <Input
          value={draft.data}
          onChange={(value) => onChange({ ...draft, data: String(value) })}
          placeholder="0x"
        />
        <p className="text-md text-(--text-ter)">
          Leave blank for plain ETH transfer. Hex calldata is locked at creation.
        </p>
      </div>
    </div>
  );
}
