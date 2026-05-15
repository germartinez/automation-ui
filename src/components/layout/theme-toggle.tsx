'use client';

import { useTheme } from '@/context/ThemeProvider';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import Button from '../ui/button';

const order = ['system', 'light', 'dark'] as const;
const labels = { system: 'System', light: 'Light', dark: 'Dark' };

function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const next = order[(order.indexOf(mode) + 1) % order.length];
  const Icon = mode === 'system' ? MonitorIcon : mode === 'dark' ? MoonIcon : SunIcon;

  return (
    <Button
      onClick={() => setMode(next)}
      title={`Theme: ${labels[mode]} (click for ${labels[next]})`}
      aria-label={`Switch theme to ${labels[next]}`}
      variant="secondary"
      size="sm"
    >
      <Icon size={16} />
      <span>{labels[mode]}</span>
    </Button>
  );
}

export default ThemeToggle;
