'use client';

import Table, { TableHeader, useSorted, type Column } from '@/components/ui/table';
import Tabs from '@/components/ui/tabs';
import { useExecutions } from '@/features/automations/hooks/use-executions';
import { useMissingExecutions } from '@/features/automations/hooks/use-missing-executions';
import type { Automation } from '@/features/automations/queries/automations';
import type { Execution } from '@/features/automations/queries/executions';
import type { MissingExecution } from '@/features/automations/utils/find-missing-executions';
import { useMemo, useState } from 'react';
import type { Hex } from 'viem';
import ExecutionRow from './execution-row';
import ExecutionRowMissing from './execution-row-missing';

const TABS = ['All', 'Executed', 'Missing'];

const GRID_COLS =
  'grid-cols-[60px_minmax(0,0.5fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.6fr)_100px]';

type Row = { kind: 'executed'; data: Execution } | { kind: 'missing'; data: MissingExecution };

const COLUMNS: Column<Row>[] = [
  {
    label: '#',
    key: 'count',
    getValue: (r) => (r.kind === 'executed' ? r.data.executionCount : null),
  },
  { label: 'Block', key: 'block', getValue: (r) => r.data.blockNumber },
  { label: 'Hash' },
  {
    label: 'Time',
    key: 'time',
    getValue: (r) => (r.kind === 'executed' ? r.data.blockTimestamp : r.data.scheduledAt),
  },
  { label: 'Executor', key: 'from', getValue: (r) => (r.kind === 'executed' ? r.data.from : null) },
  {
    label: 'Fee',
    key: 'fee',
    getValue: (r) => (r.kind === 'executed' ? BigInt(r.data.gasUsed) : null),
  },
  { label: 'Status', key: 'status', getValue: (r) => r.kind },
];

type ExecutionsTableProps = { automation: Automation };

export default function ExecutionsTable({ automation }: ExecutionsTableProps) {
  const { data: executions = [], isLoading } = useExecutions(automation.automationHash as Hex);
  const { data: missing = [], isLoading: isLoadingMissing } = useMissingExecutions(
    automation,
    executions,
  );
  const [tab, setTab] = useState(0);

  const counts = useMemo(
    () => [executions.length + missing.length, executions.length, missing.length],
    [executions.length, missing.length],
  );

  const filtered: Row[] = useMemo(() => {
    const out: Row[] = [];
    if (tab === 0 || tab === 1) for (const e of executions) out.push({ kind: 'executed', data: e });
    if (tab === 0 || tab === 2) for (const m of missing) out.push({ kind: 'missing', data: m });
    return out;
  }, [executions, missing, tab]);

  const { sorted, sort, setSort } = useSorted(filtered, COLUMNS, {
    key: 'time',
    direction: 'desc',
  });

  return (
    <div className="flex flex-col gap-2">
      <Tabs tabs={TABS} activeTab={tab} onTabChange={setTab} counts={counts} />
      <Table>
        {sorted && sorted.length > 0 && (
          <TableHeader columns={COLUMNS} gridCols={GRID_COLS} sort={sort} onSortChange={setSort} />
        )}
        {isLoading || isLoadingMissing ? (
          <p className="px-4 py-8 text-center text-sm text-(--text-sec)">Loading...</p>
        ) : sorted && sorted.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-(--text-sec)">
            {tab === 0
              ? 'No executions yet.'
              : tab === 1
                ? 'No executed runs yet.'
                : 'No missing executions.'}
          </p>
        ) : (
          sorted &&
          sorted.map((r) =>
            r.kind === 'executed' ? (
              <ExecutionRow key={`e-${r.data.txHash}`} execution={r.data} gridCols={GRID_COLS} />
            ) : (
              <ExecutionRowMissing
                key={`m-${r.data.blockNumber.toString()}`}
                missing={r.data}
                gridCols={GRID_COLS}
              />
            ),
          )
        )}
      </Table>
    </div>
  );
}
