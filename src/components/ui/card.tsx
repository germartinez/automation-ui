'use client';

import { cn } from '@/utils';
import type { ComponentProps } from 'react';

type CardProps = ComponentProps<'div'>;

function Card({ children, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'bg-(--surface) border border-(--border) rounded-xl p-4 overflow-hidden',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
