'use client';

import Table from '@/components/ui/table';
import Tabs from '@/components/ui/tabs';
import { useExecutions } from '@/features/automations/hooks/use-executions';
import type { Automation } from '@/features/automations/queries/automations';
import { cn } from '@/utils';
import { useMemo, useState } from 'react';
import type { Hex } from 'viem';
import ExecutionRow from './execution-row';

const TABS = ['All', 'Executed', 'Failed'];

const GRID_COLS = 'grid-cols-[60px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_150px]';

type Props = { automation: Automation };

export default function ExecutionsTable({ automation }: Props) {
  const { data: executions = [], isLoading } = useExecutions(automation.automationHash as Hex);
  const [tab, setTab] = useState(0);

  const counts = useMemo(() => {
    if (!executions) return [0, 0, 0];
    return [executions.length, executions.length, 0];
  }, [executions]);

  const filteredExecutions = useMemo(() => {
    return executions?.filter((e) => {
      if (tab === 2) return false; // TODO: add failed/missed executions
      return true;
    });
  }, [executions, tab]);

  return (
    <div className="flex flex-col gap-2">
      <Tabs tabs={TABS} activeTab={tab} onTabChange={setTab} counts={counts} />
      <Table>
        {filteredExecutions?.length > 0 && (
          <div
            className={cn(
              'grid items-center gap-4 px-4 py-2  bg-(--surface-alt) text-xs font-semibold uppercase text-(--text-ter) border-b border-(--border)',
              GRID_COLS,
            )}
          >
            <span>#</span>
            <span>Hash</span>
            <span>Time</span>
            <span>Fee</span>
            <span>Status</span>
          </div>
        )}
        <div className="divide-y divide-(--border) bg-(--surface)">
          {isLoading ? (
            <p className="px-4 py-8 text-center text-sm text-(--text-sec)">Loading...</p>
          ) : !filteredExecutions || filteredExecutions.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-(--text-sec)">
              {tab === 0 ? 'No executions yet.' : 'No executions match your filters'}
            </p>
          ) : (
            filteredExecutions.map((execution) => (
              <ExecutionRow key={execution.txHash} execution={execution} gridCols={GRID_COLS} />
            ))
          )}
        </div>
      </Table>
    </div>
  );
}
