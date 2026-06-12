'use client';

import { cn } from '@/utils';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
};

type SelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  size: 'sm' | 'md';
  align?: 'start' | 'center' | 'end';
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

function Select({
  value,
  onChange,
  options,
  size,
  align = 'start',
  placeholder,
  disabled,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');
  const [highlight, setHighlight] = useState<number>(() =>
    Math.max(
      0,
      options.findIndex((o) => o.value === value),
    ),
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const pointerActiveRef = useRef(false);

  const selected = options.find((o) => o.value === value);
  const label = selected?.label ?? placeholder ?? '';
  const hasRichLayout = options.some((o) => o.icon || o.description);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  const openMenu = useCallback(() => {
    if (disabled) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      const estimated = Math.min(options.length * 32 + 12, 240);
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setPlacement(spaceBelow < estimated && spaceAbove > spaceBelow ? 'top' : 'bottom');
    }
    const idx = options.findIndex((o) => o.value === value);
    setHighlight(idx >= 0 ? idx : 0);
    pointerActiveRef.current = false;
    setOpen(true);
  }, [disabled, options, value]);

  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const el = list?.children[highlight] as HTMLElement | undefined;
    if (!list || !el) return;
    const SCROLL_MARGIN = 4;
    const top = el.offsetTop;
    const bottom = top + el.offsetHeight;
    if (top < list.scrollTop + SCROLL_MARGIN) {
      list.scrollTop = Math.max(0, top - SCROLL_MARGIN);
    } else if (bottom > list.scrollTop + list.clientHeight - SCROLL_MARGIN) {
      list.scrollTop = bottom + SCROLL_MARGIN - list.clientHeight;
    }
  }, [open, highlight]);

  const sizeClass = {
    sm: 'text-xs p-2 pr-7',
    md: 'text-sm p-3 pr-7',
  }[size];

  const iconSize = size === 'sm' ? 14 : 16;
  const iconRight = size === 'sm' ? 'right-2' : 'right-3';

  const commit = (idx: number) => {
    const opt = options[idx];
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      pointerActiveRef.current = false;
      setHighlight((h) => (h + 1) % options.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      pointerActiveRef.current = false;
      setHighlight((h) => (h - 1 + options.length) % options.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      commit(highlight);
    } else if (e.key === 'Home') {
      e.preventDefault();
      pointerActiveRef.current = false;
      setHighlight(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      pointerActiveRef.current = false;
      setHighlight(options.length - 1);
    }
  };

  return (
    <div ref={wrapperRef} className={cn('relative inline-flex w-full', className)}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={cn(
          'w-full appearance-none rounded-lg border bg-(--surface) text-(--text)',
          'flex items-center justify-start',
          'cursor-pointer outline-none transition-colors duration-150',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-(--border)',
          open ? 'border-(--accent)' : 'border-(--border)',
          sizeClass,
        )}
      >
        {hasRichLayout && selected ? (
          <span className="flex items-center gap-2">
            {selected.icon}
            <span className="flex flex-col items-start">
              <span className="truncate text-(--text)">{selected.label}</span>
              {selected.description && (
                <span className="truncate text-xs text-(--text-ter)">
                  {selected.description}
                </span>
              )}
            </span>
          </span>
        ) : (
          <span className={cn('truncate', !selected && 'text-(--text-ter)')}>{label}</span>
        )}
        <ChevronDownIcon
          size={iconSize}
          className={cn(
            'pointer-events-none absolute top-1/2 -translate-y-1/2 text-(--text-ter) transition-transform duration-150',
            iconRight,
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div
          className={cn(
            'absolute z-50 min-w-full w-max overflow-hidden',
            'rounded-lg border border-(--border) bg-(--surface) shadow-lg',
            placement === 'bottom' ? 'top-full mt-1.5' : 'bottom-full mb-1.5',
            align === 'start' && 'left-0',
            align === 'end' && 'right-0',
            align === 'center' && 'left-1/2 -translate-x-1/2',
          )}
        >
          <ul
            ref={listRef}
            role="listbox"
            className="max-h-60 overflow-auto scrollbar-hide p-1"
          >
            {options.map((o, i) => {
              const isSelected = o.value === value;
              const isHighlighted = i === highlight;
              return (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => {
                    if (pointerActiveRef.current) setHighlight(i);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    commit(i);
                  }}
                  className={cn(
                    'flex items-center justify-between gap-2 rounded-md px-2 py-1.5 cursor-pointer',
                    size === 'sm' ? 'text-xs' : 'text-sm',
                    isHighlighted
                      ? 'bg-(--surface-alt) text-(--text)'
                      : 'bg-(--surface) text-(--text-sec)',
                  )}
                >
                  {o.icon || o.description ? (
                    <span className="flex items-center gap-2.5 min-w-0">
                      {o.icon}
                      <span className="flex flex-col min-w-0">
                        <span className="truncate">{o.label}</span>
                        {o.description && (
                          <span className="truncate text-xs text-(--text-ter)">
                            {o.description}
                          </span>
                        )}
                      </span>
                    </span>
                  ) : (
                    <span className="truncate">{o.label}</span>
                  )}
                  {isSelected && (
                    <CheckIcon size={iconSize} className="shrink-0 text-(--accent)" aria-hidden />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Select;
