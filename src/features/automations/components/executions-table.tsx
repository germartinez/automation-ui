'use client';

import Table from '@/components/ui/table';
import { useExecutions } from '@/features/automations/hooks/use-executions';
import type { Automation } from '@/features/automations/queries/automations';
import {
  decodeRecurrentTrigger,
  isValidRecurrentSchedule,
  nextOccurrenceUtc,
} from '@/lib/recurrent';
import type { Hex } from 'viem';
import ExecutionRow from './execution-row';
import PendingExecutionRow from './execution-row-pending';

function nextRunFor(automation: Automation): Date | undefined {
  if (!automation.isActive) return;
  try {
    const schedule = decodeRecurrentTrigger(automation.trigger as Hex);
    if (!isValidRecurrentSchedule(schedule)) return;
    return nextOccurrenceUtc(schedule);
  } catch {
    return;
  }
}

type Props = { automation: Automation };

export default function ExecutionsTable({ automation }: Props) {
  const { data: executions = [], isLoading } = useExecutions(automation.automationHash as Hex);
  const nextRun = nextRunFor(automation);

  return (
    <Table>
      <table className="w-full text-md">
        <thead className="bg-(--surface-alt)">
          <tr className="text-left text-(--text-ter) text-xs uppercase">
            <th className="p-4">#</th>
            <th className="p-4">Transaction</th>
            <th className="p-4">Time</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {nextRun && <PendingExecutionRow nextRun={nextRun} index={executions.length + 1} />}
          {isLoading ? (
            <tr>
              <td colSpan={4} className="p-4 text-center text-sm text-(--text-sec)">
                Loading...
              </td>
            </tr>
          ) : (
            executions.map((e) => <ExecutionRow key={e.txHash} execution={e} />)
          )}
        </tbody>
      </table>
    </Table>
  );
}
