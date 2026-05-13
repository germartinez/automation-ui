'use client';

import Card from '@/components/ui/card';
import { useAutomation } from '@/features/automations/hooks/use-automation';
import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { type Hex } from 'viem';
import ExecutionsTable from './components/executions-table';

type Props = { hash: Hex };

export default function AutomationDetailsPage({ hash }: Props) {
  const { data: automation, isLoading } = useAutomation(hash);

  return (
    <div className="max-w-6xl mx-auto w-full px-4 pt-8 pb-20 flex flex-col gap-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-(--text-sec) hover:text-(--text)"
      >
        <ArrowLeftIcon size={14} />
        Back to automations
      </Link>

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
          <h1 className="text-2xl font-semibold text-(--text)">
            {automation.title ?? 'Untitled automation'}
          </h1>
          <ExecutionsTable automation={automation} />
        </>
      )}
    </div>
  );
}
