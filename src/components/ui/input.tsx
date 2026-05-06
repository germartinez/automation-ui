'use client';

import { cn } from '@/utils';

type InputProps = {
  type?: 'text' | 'number';
  value: string | number;
  min?: number;
  max?: number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  mono?: boolean;
  prefix?: string;
  className?: string;
};

function Input({
  type = 'text',
  value,
  min,
  max,
  onChange,
  placeholder,
  style,
  mono,
  prefix,
  className,
}: InputProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      {prefix && (
        <span className="absolute left-2 text-(--text-ter) pointer-events-none">{prefix}</span>
      )}
      <input
        type={type}
        value={value}
        min={type === 'number' ? min : undefined}
        max={type === 'number' ? max : undefined}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full border border-(--border) p-3 rounded-lg bg-(--surface) text-(--text) transition-colors duration-150 focus:border-accent',
          mono ? 'font-mono' : '',
          prefix ? 'pl-7' : '',
        )}
        style={style}
      />
    </div>
  );
}

export default Input;
