'use client';

import Table from '@/components/ui/table';
import Tabs from '@/components/ui/tabs';
import { useExecutions } from '@/features/automations/hooks/use-executions';
import { useMissingExecutions } from '@/features/automations/hooks/use-missing-executions';
import type { Automation } from '@/features/automations/queries/automations';
import { cn } from '@/utils';
import { useMemo, useState } from 'react';
import type { Hex } from 'viem';
import ExecutionRow from './execution-row';
import ExecutionRowMissing from './execution-row-missing';

const TABS = ['All', 'Executed', 'Missing'];

const GRID_COLS =
  'grid-cols-[60px_minmax(0,0.5fr)_minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.6fr)_100px]';

type Props = { automation: Automation };

type Row =
  | { kind: 'executed'; sortKey: number; txHash: Hex; node: React.ReactNode }
  | { kind: 'missing'; sortKey: number; key: string; node: React.ReactNode };

export default function ExecutionsTable({ automation }: Props) {
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

  const filteredExecutions: Row[] = useMemo(() => {
    const out: Row[] = [];
    if (tab === 0 || tab === 1) {
      for (const e of executions) {
        out.push({
          kind: 'executed',
          sortKey: e.blockTimestamp,
          txHash: e.txHash,
          node: <ExecutionRow key={`e-${e.txHash}`} execution={e} gridCols={GRID_COLS} />,
        });
      }
    }
    if (tab === 0 || tab === 2) {
      for (const m of missing) {
        const key = `m-${m.blockNumber.toString()}`;
        out.push({
          kind: 'missing',
          sortKey: m.scheduledAt,
          key,
          node: <ExecutionRowMissing key={key} missing={m} gridCols={GRID_COLS} />,
        });
      }
    }
    return out.sort((a, b) => b.sortKey - a.sortKey);
  }, [executions, missing, tab, automation]);

  return (
    <div className="flex flex-col gap-2">
      <Tabs tabs={TABS} activeTab={tab} onTabChange={setTab} counts={counts} />
      <Table>
        {filteredExecutions.length > 0 && (
          <div
            className={cn(
              'grid items-center gap-4 p-4 text-xs uppercase font-semibold text-(--text-ter) border-b border-(--border)',
              GRID_COLS,
            )}
          >
            <span>#</span>
            <span className="truncate">Block</span>
            <span className="truncate">Hash</span>
            <span className="truncate">Time</span>
            <span className="truncate">Executor</span>
            <span className="truncate">Fee</span>
            <span className="truncate">Status</span>
          </div>
        )}
        <div className="divide-y divide-(--border) bg-(--surface)">
          {isLoading || isLoadingMissing ? (
            <p className="px-4 py-8 text-center text-sm text-(--text-sec)">Loading...</p>
          ) : filteredExecutions.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-(--text-sec)">
              {tab === 0
                ? 'No executions yet.'
                : tab === 1
                  ? 'No executed runs yet.'
                  : 'No missing executions.'}
            </p>
          ) : (
            filteredExecutions.map((r) => r.node)
          )}
        </div>
      </Table>
    </div>
  );
}
