'use client';

import { useAutomation } from '@/features/automations/hooks/use-automation';
import { type Hex } from 'viem';
import ExecutionsTable from './components/executions-table';
import NextRunCard from './components/next-run-card';
import TransactionCard from './components/transaction-card';

type Props = { hash: Hex };

export default function AutomationDetailsPage({ hash }: Props) {
  const { data: automation } = useAutomation(hash);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 pt-10 pb-20 flex flex-col gap-6">
      {automation && (
        <>
          <h1 className="text-2xl font-semibold text-(--text)">
            {automation.title ?? 'Untitled automation'}
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <NextRunCard isActive={automation.isActive} trigger={automation.trigger as Hex} />
            <TransactionCard automation={automation} />
          </div>
          <ExecutionsTable automation={automation} />
        </>
      )}
    </div>
  );
}
