'use client';

import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import type { AppKitNetwork } from '@reown/appkit-common';
import { sepolia } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { TimezoneProvider } from './TimezoneProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ?? 'YOUR_PROJECT_ID';

const networks: [AppKitNetwork, ...AppKitNetwork[]] = [sepolia as AppKitNetwork];

const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
});

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: sepolia,
  enableWalletConnect: true,
  metadata: {
    name: 'Automations',
    description: '',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    icons: ['/favicon.ico'],
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <TimezoneProvider>{children}</TimezoneProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
