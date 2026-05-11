'use client';

import Table from '@/components/ui/table';
import AutomationRow from '@/features/automations/components/automation-row';
import { useAutomations } from '@/features/automations/hooks/use-automations';
import { useRouter } from 'next/navigation';
import type { KeyboardEvent } from 'react';
import { type Address } from 'viem';

type AutomationsTableProps = {
  safe?: Address;
};

function AutomationsTable({ safe }: AutomationsTableProps) {
  const { data: automations = [], isLoading } = useAutomations(safe);
  const router = useRouter();

  return isLoading ? (
    <Table>
      <p className="px-4 py-8 text-center text-sm text-(--text-sec)">Loading...</p>
    </Table>
  ) : !automations || automations.length === 0 ? (
    <Table>
      <p className="px-4 py-8 text-center text-sm text-(--text-sec)">No automations found</p>
    </Table>
  ) : (
    <Table>
      <div className="divide-y divide-(--border-light)">
        {automations.map((automation) => (
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
        ))}
      </div>
    </Table>
  );
}

export default AutomationsTable;
