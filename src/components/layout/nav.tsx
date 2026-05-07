'use client';

import Button from '@/components/ui/button';
import { cn } from '@/utils';
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AddressDisplay from '../ui/address';

const links: { id: string; label: string }[] = [];

function Nav({ className }: { className?: string }) {
  const pathname = usePathname();
  const { open } = useAppKit();
  const { address } = useAppKitAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="border-b sticky top-0 z-10 border-(--border) bg-(--surface)">
      <div className={cn('flex items-center justify-between px-4', className)}>
        <div className="flex items-center gap-4 h-14">
          <Link href="/" className="font-semibold text-xl">
            Automations
          </Link>
          <div className="hidden md:flex items-stretch h-14">
            {links.map((l) => {
              const active = pathname === `/${l.id}`;
              return (
                <Link
                  href={`/${l.id}`}
                  key={l.id}
                  className={`flex items-center px-3 text-md font-medium border-b-2 transition-colors duration-150 whitespace-nowrap ${
                    active
                      ? 'text-(--text) border-(--accent)'
                      : 'text-(--text-sec) border-transparent hover:text-(--text)'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
        {address ? (
          <div className="flex items-center gap-4">
            <AddressDisplay address={address} />
            <Button variant="primary" onClick={disconnect}>
              Log out
            </Button>
          </div>
        ) : (
          <Button variant="primary" onClick={() => open()}>
            Connect
          </Button>
        )}
      </div>
    </div>
  );
}

export default Nav;
