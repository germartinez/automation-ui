'use client';

import Card from '@/components/ui/card';

type Step = {
  title: string;
  subtitle: string;
  complete: boolean;
  content: React.ReactNode;
};

type StepperCardProps = {
  steps: Step[];
  activeIndex: number;
  footer?: React.ReactNode;
};

function StepperCard({ steps, activeIndex, footer }: StepperCardProps) {
  const active = steps[activeIndex];
  return (
    <Card className="p-6">
      {active && (
        <div>
          <h2 className="text-2xl font-semibold text-(--text) mb-1">{active.title}</h2>
          <p className="text-sm text-(--text-sec) mb-6">{active.subtitle}</p>
          {active.content}
        </div>
      )}
      {footer && <div className="mt-6">{footer}</div>}
    </Card>
  );
}

export default StepperCard;
