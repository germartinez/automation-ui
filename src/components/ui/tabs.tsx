'use client';

import { cn } from '@/utils';

type TabsProps = {
  tabs: string[];
  activeTab: number;
  onTabChange: (index: number) => void;
  counts: number[];
};

export default function Tabs({ tabs, activeTab, onTabChange, counts }: TabsProps) {
  return (
    <div className="flex items-center flex-wrap">
      {tabs.map((t, index) => {
        const active = activeTab === index;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onTabChange(index)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors duration-100',
              active
                ? 'text-(--text) bg-(--surface) border-(--border)'
                : 'text-(--text-sec) bg-transparent border-transparent hover:text-(--text)',
            )}
          >
            {t}
            <span
              className={cn(
                'text-xs px-1.5 rounded-full font-medium tabular-nums',
                active
                  ? 'bg-(--accent-subtle) text-(--accent-text)'
                  : 'bg-(--surface-alt) text-(--text-ter)',
              )}
            >
              {counts[index]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
