'use client';

import Table from '@/components/ui/table';
import Tabs from '@/components/ui/tabs';
import AutomationRow from '@/features/automations/components/automation-row';
import { useRouter } from 'next/navigation';
import { useMemo, useState, type KeyboardEvent } from 'react';
import { type Address } from 'viem';
import { useAutomations } from '../hooks/use-automations';

const TABS = ['All', 'Active', 'Paused'];

type AutomationsTableProps = {
  safe: Address;
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
              <AutomationRow automation={automation} />
            </div>
          ))
        )}
      </Table>
    </div>
  );
}

export default AutomationsTable;
