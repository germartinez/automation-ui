'use client';

import { cn } from '@/utils';

type LabelProps = {
  children: React.ReactNode;
  className?: string;
};

function Label({ children, className }: LabelProps) {
  return (
    <div className={cn('text-xs font-semibold uppercase text-(--text-ter)', className)}>
      {children}
    </div>
  );
}

export default Label;
