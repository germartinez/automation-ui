'use client';

import { networks } from '@/context/AppProviders';
import { cn } from '@/utils';
import { useAppKitNetwork } from '@reown/appkit/react';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const CHAIN_ICON_BY_ID: Record<string, string> = {
  '11155111': 'sepolia',
  '10200': 'chiado',
  '84532': 'base-sepolia',
};

function chainIconSrc(id: number | string | undefined): string | undefined {
  if (id === undefined) return;
  const key = CHAIN_ICON_BY_ID[String(id)];
  return key ? `/assets/chains/${key}.png` : undefined;
}

function ChainSelector() {
  const { chainId, switchNetwork } = useAppKitNetwork();
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<'bottom' | 'top'>('bottom');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const openMenu = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      const estimated = Math.min(networks.length * 36 + 12, 288);
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setPlacement(spaceBelow < estimated && spaceAbove > spaceBelow ? 'top' : 'bottom');
    }
    setOpen(true);
  };

  if (networks.length === 0) return;

  const current = networks.find((n) => String(n.id) === String(chainId));
  const iconSrc = chainIconSrc(chainId);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => (open ? setOpen(false) : openMenu())}
        className={cn(
          'flex items-center gap-2 rounded-full border p-1 pr-2.5 cursor-pointer transition-colors duration-150',
          'text-(--text) text-xs outline-none',
          'hover:border-(--text-ter)',
          'focus-visible:border-(--accent) focus-visible:ring-2 focus-visible:ring-(--accent-subtle)',
          open ? 'border-(--accent)' : 'border-(--border)',
        )}
      >
        {iconSrc && (
          <img
            src={iconSrc}
            alt=""
            aria-hidden="true"
            width={24}
            height={24}
            className="rounded-full shrink-0"
          />
        )}
        <span className="truncate">{current?.name ?? ''}</span>
        <ChevronDownIcon
          size={14}
          className={cn(
            'text-(--text-ter) transition-transform duration-150',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className={cn(
            'absolute right-0 z-50 min-w-full w-max max-h-72 overflow-auto scrollbar-hide rounded-lg border border-(--border) bg-(--surface) p-1 shadow-lg',
            placement === 'bottom' ? 'top-full mt-1.5' : 'bottom-full mb-1.5',
          )}
        >
          {networks.map((n) => {
            const isSelected = String(n.id) === String(chainId);
            const src = chainIconSrc(n.id);
            return (
              <li
                key={String(n.id)}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => {
                  e.preventDefault();
                  switchNetwork(n);
                  setOpen(false);
                }}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-xs cursor-pointer',
                  'text-(--text-sec) hover:bg-(--surface-alt) hover:text-(--text)',
                )}
              >
                <span className="flex items-center gap-2 truncate">
                  {src && (
                    <img
                      src={src}
                      alt=""
                      aria-hidden="true"
                      width={20}
                      height={20}
                      className="rounded-full shrink-0"
                    />
                  )}
                  <span className="truncate">{n.name}</span>
                </span>
                {isSelected && (
                  <CheckIcon size={14} className="shrink-0 text-(--accent)" aria-hidden />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default ChainSelector;
