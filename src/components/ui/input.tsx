'use client';

import { cn } from '@/utils';

type InputProps = {
  type?: 'text' | 'number';
  value: string | number;
  min?: number;
  max?: number;
  onChange: (value: string | number) => void;
  onBlur?: () => void;
  placeholder?: string;
  style?: React.CSSProperties;
  prefix?: string;
  className?: string;
  id?: string;
  invalid?: boolean;
  'aria-describedby'?: string;
};

function Input({
  type = 'text',
  value,
  min,
  max,
  onChange,
  onBlur,
  placeholder,
  style,
  prefix,
  className,
  id,
  invalid,
  'aria-describedby': ariaDescribedBy,
}: InputProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      {prefix && (
        <span className="absolute left-2 text-(--text-ter) pointer-events-none">{prefix}</span>
      )}
      <input
        id={id}
        type={type}
        value={value}
        min={type === 'number' ? min : undefined}
        max={type === 'number' ? max : undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={invalid}
        aria-describedby={ariaDescribedBy}
        className={cn(
          'w-full border p-3 rounded-lg bg-(--surface) text-(--text) transition-colors duration-150 focus:border-accent',
          invalid ? 'border-(--error-text)' : 'border-(--border)',
          prefix ? 'pl-7' : '',
        )}
        style={style}
      />
    </div>
  );
}

export default Input;
