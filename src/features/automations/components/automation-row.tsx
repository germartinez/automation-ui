'use client';

import AddressDisplay from '@/components/ui/address';
import StatusBadge from '@/components/ui/status-badge';
import { useTimezone } from '@/context/TimezoneProvider';
import type { Automation as AutomationRecord } from '@/features/automations/queries/automations';
import { type Address, type Hex, formatEther } from 'viem';
import { describeTrigger } from '../utils/describe-trigger';

type AutomationRowProps = {
  automation: AutomationRecord;
};

export default function AutomationRow({ automation }: AutomationRowProps) {
  const { title, strategy, trigger, value, to, data, isActive } = automation;
  const { timeZone } = useTimezone();

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between gap-4 text-md">
        <div className="flex-1 flex flex-col gap-1">
          <p className="font-semibold text-(--text) text-md">{title ?? 'Untitled'}</p>
          <div>
            {data !== '0x' ? 'Call ' : value ? 'Transfer ' : ''}
            {value && <span className="text-(--error-text)">{formatEther(value)} ETH</span>}
            {value && ' to '}
            {to ? <AddressDisplay address={to} /> : <span className="text-(--text-ter)">—</span>}
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <StatusBadge status={isActive ? 'active' : 'paused'} />
          <p className="text-xs text-(--text-sec)">
            {describeTrigger(strategy as Address, trigger as Hex, timeZone)}
          </p>
        </div>
      </div>
    </div>
  );
}
