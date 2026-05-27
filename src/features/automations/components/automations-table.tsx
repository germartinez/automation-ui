'use client';

import Table, { TableHeader, useSorted, type Column } from '@/components/ui/table';
import Tabs from '@/components/ui/tabs';
import AutomationRow from '@/features/automations/components/automation-row';
import { useAutomations } from '@/features/automations/hooks/use-automations';
import type { Automation } from '@/features/automations/queries/automations';
import { nextRunFor } from '@/features/automations/utils/describe-trigger';
import { useMemo, useState } from 'react';
import { type Address, type Hex } from 'viem';

const TABS = ['All', 'Active', 'Paused'];

const GRID_COLS =
  'grid-cols-[44px_minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,0.6fr)_90px_28px]';

const INFINITE_DATE = new Date(8640000000000000);

const COLUMNS: Column<Automation>[] = [
  { label: '' },
  { label: 'Name', key: 'title' },
  {
    label: 'Next',
    key: 'next',
    getValue: (a) => nextRunFor(a.trigger as Hex, a.isActive) ?? INFINITE_DATE,
  },
  { label: 'Recipient', key: 'to' },
  { label: 'Value', key: 'value' },
  { label: 'Status', key: 'isActive' },
];

type AutomationsTableProps = {
  safe?: Address;
};

function AutomationsTable({ safe }: AutomationsTableProps) {
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

  const filtered = useMemo(
    () =>
      automations?.filter((a) => {
        if (tab === 1 && !a.isActive) return false;
        if (tab === 2 && a.isActive) return false;
        return true;
      }),
    [automations, tab],
  );

  const { sorted, sort, setSort } = useSorted(filtered, COLUMNS, {
    key: 'next',
    direction: 'asc',
  });

  return (
    <div className="flex flex-col gap-2">
      <Tabs tabs={TABS} activeTab={tab} onTabChange={setTab} counts={counts} />
      <Table>
        {sorted && sorted.length > 0 && (
          <TableHeader columns={COLUMNS} gridCols={GRID_COLS} sort={sort} onSortChange={setSort} />
        )}
        {isLoading ? (
          <p className="px-4 py-8 text-center text-sm text-(--text-sec)">Loading...</p>
        ) : !sorted || sorted.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-(--text-sec)">
            {tab === 0 ? 'No automations found' : 'No automations match your filters'}
          </p>
        ) : (
          sorted.map((automation) => (
            <AutomationRow
              key={automation.automationHash}
              automation={automation}
              gridCols={GRID_COLS}
            />
          ))
        )}
      </Table>
    </div>
  );
}

export default AutomationsTable;
