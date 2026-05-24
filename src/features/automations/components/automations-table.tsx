'use client';

import Table from '@/components/ui/table';
import Tabs from '@/components/ui/tabs';
import AutomationRow from '@/features/automations/components/automation-row';
import { useAutomations } from '@/features/automations/hooks/use-automations';
import { cn } from '@/utils';
import { useRouter } from 'next/navigation';
import { useMemo, useState, type KeyboardEvent } from 'react';
import { type Address } from 'viem';

const TABS = ['All', 'Active', 'Paused'];

const GRID_COLS =
  'grid-cols-[44px_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.6fr)_minmax(0,1fr)_90px_28px]';

type AutomationsTableProps = {
  safe?: Address;
};

function AutomationsTable({ safe }: AutomationsTableProps) {
  const router = useRouter();
  const { data: automations, isLoading } = useAutomations(safe);
  const [tab, setTab] = useState(0);

  const counts = useMemo(() => {
    if (!automations) return [0, 0, 0];
    return [
      automations.length,
      automations.filter((a) => a.isActive).length,
      automations.filter((a) => !a.isActive).length,
    ];
  }, [automations]);

  const filteredAutomations = useMemo(() => {
    return automations?.filter((a) => {
      if (tab === 1 && !a.isActive) return false;
      if (tab === 2 && a.isActive) return false;
      return true;
    });
  }, [automations, tab]);

  return (
    <div className="flex flex-col gap-2">
      <Tabs tabs={TABS} activeTab={tab} onTabChange={setTab} counts={counts} />
      <Table>
        {filteredAutomations && filteredAutomations.length > 0 && (
          <div
            className={cn(
              'grid items-center gap-4 p-4 text-xs uppercase font-semibold text-(--text-ter) border-b border-(--border)',
              GRID_COLS,
            )}
          >
            <span></span>
            <span className="truncate">Name</span>
            <span className="truncate">Recipient</span>
            <span className="truncate">Value</span>
            <span className="truncate">Next</span>
            <span className="truncate">Status</span>
          </div>
        )}
        {isLoading ? (
          <p className="px-4 py-8 text-center text-sm text-(--text-sec)">Loading...</p>
        ) : !filteredAutomations || filteredAutomations.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-(--text-sec)">
            {tab === 0 ? 'No automations found' : 'No automations match your filters'}
          </p>
        ) : (
          filteredAutomations.map((automation) => (
            <div
              key={automation.automationHash}
              role="button"
              tabIndex={0}
              className="cursor-pointer transition-colors duration-100 hover:bg-(--surface-alt)"
              onClick={() => router.push(`/automations/${automation.automationHash}`)}
              onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push(`/automations/${automation.automationHash}`);
                }
              }}
            >
              <AutomationRow automation={automation} gridCols={GRID_COLS} />
            </div>
          ))
        )}
      </Table>
    </div>
  );
}

export default AutomationsTable;
