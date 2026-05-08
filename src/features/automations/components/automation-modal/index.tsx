'use client';

import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Modal from '@/components/ui/modal';
import Spinner from '@/components/ui/spinner';
import { useTimezone } from '@/context/TimezoneProvider';
import { useCreateAutomation } from '@/features/automations/hooks/use-create-automation';
import { encodeRecurrentTrigger } from '@/lib/recurrent';
import { useState, type ReactNode } from 'react';
import { Address, Hex, parseEther } from 'viem';
import WhenScheduleFields from './schedule-step';
import StatusBanner from './status-banner';
import TransactionFields from './transaction-step';
import WhenTypeFields from './type-step';
import {
  defaultTransaction,
  defaultWhen,
  scheduleFromDraft,
  titleComplete,
  transactionComplete,
  whenComplete,
  type TransactionDraft,
  type WhenDraft,
} from './utils';

type Feedback = {
  kind: 'error' | 'success' | 'info';
  message: string;
};

type Step = {
  title: string;
  subtitle: string;
  complete: boolean;
  content: ReactNode;
};

type ScheduleAutomationModalProps = {
  open: boolean;
  onClose: () => void;
  safe: Address;
};

export default function ScheduleAutomationModal({
  open,
  onClose,
  safe,
}: ScheduleAutomationModalProps) {
  const { createAutomation, submitting, stage } = useCreateAutomation();
  const { timeZone } = useTimezone();

  const [title, setTitle] = useState<string>('');
  const [tx, setTx] = useState<TransactionDraft>(defaultTransaction);
  const [when, setWhen] = useState<WhenDraft>(defaultWhen);
  const [feedback, setFeedback] = useState<Feedback>();
  const [activeStep, setActiveStep] = useState(0);

  const handleCloseModal = () => {
    if (submitting) return;
    setTitle('');
    setTx(defaultTransaction);
    setWhen(defaultWhen);
    setFeedback(undefined);
    setActiveStep(0);
    onClose();
  };

  async function handleSchedule() {
    if (!safe) return;
    setFeedback(undefined);
    try {
      const trigger = encodeRecurrentTrigger(scheduleFromDraft(when, timeZone));
      await createAutomation({
        safe,
        to: tx.target as Address,
        value: tx.value ? parseEther(tx.value) : 0n,
        data: (tx.data && tx.data !== '0x' ? tx.data : '0x') as Hex,
        trigger,
        title: title.trim(),
      });
      handleCloseModal();
    } catch (e) {
      setFeedback({
        kind: 'error',
        message: e instanceof Error ? e.message : 'Failed to schedule automation',
      });
    }
  }

  const txComplete = transactionComplete(tx);
  const scheduleComplete = whenComplete(when);
  const titleDone = titleComplete(title);

  const canSubmit = txComplete && scheduleComplete && titleDone && !submitting;

  const steps: Step[] = [
    {
      title: 'New automation',
      subtitle: 'Name it and choose how it should be triggered',
      complete: titleDone,
      content: (
        <WhenTypeFields draft={when} onChange={setWhen} title={title} onTitleChange={setTitle} />
      ),
    },
    {
      title: 'Schedule',
      subtitle: 'Configure the recurring schedule.',
      complete: scheduleComplete,
      content: <WhenScheduleFields draft={when} onChange={setWhen} />,
    },
    {
      title: 'Transaction',
      subtitle: 'Define the call your Safe will execute.',
      complete: txComplete,
      content: <TransactionFields draft={tx} onChange={setTx} />,
    },
  ];

  const step = steps[activeStep];
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;
  const currentComplete = step?.complete ?? false;

  return (
    <Modal open={open} onClose={handleCloseModal}>
      <Card className="p-6 rounded-2xl">
        {step && (
          <>
            <div>
              <h2 className="text-2xl font-semibold text-(--text) mb-1">{step.title}</h2>
              <p className="text-sm text-(--text-sec) mb-4">{step.subtitle}</p>
              {step.content}
            </div>
            <div className="mt-6">
              <div className="flex flex-col gap-3">
                {stage === 'enabling-module' && (
                  <StatusBanner state="info" message="Enabling AutomationModule on your Safe..." />
                )}
                {stage === 'creating' && (
                  <StatusBanner state="info" message="Creating automation..." />
                )}
                {feedback && <StatusBanner state={feedback.kind} message={feedback.message} />}
                <div className="flex items-center justify-between gap-3">
                  <Button
                    variant="secondary"
                    disabled={isFirstStep || submitting}
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    className="w-full"
                    size="lg"
                  >
                    Back
                  </Button>
                  {isLastStep ? (
                    <Button
                      variant="primary"
                      size="lg"
                      disabled={!canSubmit}
                      onClick={handleSchedule}
                      className="w-full"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <Spinner size={14} color="var(--text-inverse)" />
                          Scheduling...
                        </span>
                      ) : (
                        'Schedule'
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="lg"
                      disabled={!currentComplete}
                      onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                      className="w-full"
                    >
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </Modal>
  );
}
