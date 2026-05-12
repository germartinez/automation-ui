'use client';

import { cn } from '@/utils';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  className?: string;
  style?: React.CSSProperties;
};

function Button({
  children,
  variant = 'primary',
  onClick,
  disabled,
  size = 'md',
  title,
  className,
}: ButtonProps) {
  const variantClass = {
    primary:
      'bg-(--accent) text-(--text-inverse) hover:bg-(--accent-hover) border border-transparent',
    secondary: 'bg-transparent text-(--text-sec) border border-(--border) hover:text-(--text)',
    ghost: 'bg-transparent text-(--text-sec) hover:bg-(--surface-alt) hover:text-(--text) border-0',
    danger: 'bg-(--error-bg) text-(--error-text) border border-transparent hover:bg-(--error-bg)',
  }[variant];

  const sizeClass = {
    sm: 'text-xs px-2.5 py-[5px]',
    md: 'text-[13px] px-3.5 py-[7px]',
    lg: 'text-[15px] px-5 py-[11px]',
  }[size];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 font-medium rounded-lg cursor-pointer transition-all duration-150',
        variantClass,
        sizeClass,
        className,
        disabled && 'bg-(--bg-muted) text-(--text-muted) hover:bg-(--bg-muted) cursor-auto',
      )}
    >
      {children}
    </button>
  );
}

export default Button;
