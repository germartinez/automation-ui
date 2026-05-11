'use client';

import AddressDisplay from '@/components/ui/address';
import Card from '@/components/ui/card';
import StatusBadge from '@/components/ui/status-badge';
import { useTimezone } from '@/context/TimezoneProvider';
import type { Automation as AutomationRecord } from '@/features/automations/queries/automations';
import { type Address, type Hex, formatEther } from 'viem';
import { describeTrigger } from '../utils/describe-trigger';

type AutomationCardProps = {
  automation: AutomationRecord;
};

export default function AutomationCard({ automation }: AutomationCardProps) {
  const { strategy, trigger, value, to, data, isActive } = automation;
  const { timeZone } = useTimezone();

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between gap-4 text-md">
        <div className="flex flex-col gap-2 items-start">
          <StatusBadge status={isActive ? 'active' : 'paused'} />
          <p className="text-xs text-(--text-sec)">
            {describeTrigger(strategy as Address, trigger as Hex, timeZone)}
          </p>
        </div>
      </div>
      <Card className="p-4 gap-2 flex flex-col mt-2 border-none bg-(--surface-alt)">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-(--text-sec)">DESTINATION:</p>
          {to ? <AddressDisplay address={to} full /> : <span>—</span>}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-(--text-sec)">VALUE:</p>
          {value ? <p>{formatEther(value)} ETH</p> : <p>—</p>}
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-(--text-sec)">DATA:</p>
          {data ? <p>{data}</p> : <p>—</p>}
        </div>
      </Card>
    </div>
  );
}
