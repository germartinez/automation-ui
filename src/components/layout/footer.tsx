'use client';

import Select from '@/components/ui/select';
import { useTimezone } from '@/context/TimezoneProvider';

function Footer() {
  const { timeZone, setTimezone, options } = useTimezone();

  return (
    <footer className="mt-auto border-t border-(--border)">
      <div className="max-w-6xl mx-auto w-full p-4 flex items-center justify-end">
        <Select value={timeZone} onChange={(value) => setTimezone(value)} options={options} />
      </div>
    </footer>
  );
}

export default Footer;
