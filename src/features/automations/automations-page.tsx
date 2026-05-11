'use client';

import Button from '@/components/ui/button';
import ScheduleAutomationModal from '@/features/automations/components/automation-modal';
import StatusBanner from '@/features/automations/components/automation-modal/status-banner';
import AutomationsTable from '@/features/automations/components/automations-table';
import { useAccountVersion } from '@/hooks/use-account-version';
import { useAppKitAccount } from '@reown/appkit/react';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { type Address } from 'viem';

function SchedulePage() {
  const { address } = useAppKitAccount();
  const safe = address as Address;
  const { data: accountVersion } = useAccountVersion(safe);
  const [modalOpen, setModalOpen] = useState(false);

  const banners = (
    <div className="grid gap-2">
      {accountVersion?.status === 'incompatible' && (
        <StatusBanner state="error" message="Connected account must be a Safe Smart Account." />
      )}
      {accountVersion?.status === 'unsupported-version' && (
        <StatusBanner
          state="error"
          message={`Connected account version must be greater than or equal to v1.3.0.`}
        />
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto w-full px-4 pt-10 pb-20">
      {banners}
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-(--text)">Automations</h2>
          {accountVersion?.status === 'ok' && (
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              <PlusIcon size={14} />
              New automation
            </Button>
          )}
        </div>
        <AutomationsTable safe={safe} />
      </div>

      <ScheduleAutomationModal open={modalOpen} onClose={() => setModalOpen(false)} safe={safe} />
    </div>
  );
}

export default SchedulePage;
