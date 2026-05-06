'use client';

import { cn } from '@/utils';

type TableProps = {
  children: React.ReactNode;
  className?: string;
};

function Table({ children, className }: TableProps) {
  return (
    <div
      className={cn(
        'bg-(--surface) border border-(--border) rounded-xl overflow-hidden h-fit',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Table;
