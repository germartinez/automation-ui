'use client';

import Card from '@/components/ui/card';
import AutomationCard from '@/features/automations/components/automation-card';
import { useAutomation } from '@/features/automations/hooks/use-automation';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { type Hex } from 'viem';
import ExecutionsTable from './components/executions-table';

type Props = { hash: Hex };

export default function AutomationDetailsPage({ hash }: Props) {
  const { data: automation, isLoading } = useAutomation(hash);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 pt-10 pb-20">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-(--text-sec) hover:text-(--text) mb-4"
      >
        <ArrowLeftIcon size={14} />
        Back to automations
      </Link>

      <h2 className="text-2xl font-semibold text-(--text) my-4">
        {automation?.title ?? 'Automation Details'}
      </h2>

      {isLoading ? (
        <Card>
          <p className="flex items-center justify-center text-(--text-sec)">Loading...</p>
        </Card>
      ) : !automation ? (
        <Card>
          <p className="flex items-center justify-center text-(--text-sec)">
            Automation not found.
          </p>
        </Card>
      ) : (
        <>
          <Card className="p-0 overflow-hidden">
            <AutomationCard automation={automation} />
          </Card>
          <h2 className="text-2xl font-semibold text-(--text) my-4">Executions</h2>
          <ExecutionsTable automation={automation} />
        </>
      )}
    </div>
  );
}
