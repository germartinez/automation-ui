import Footer from '@/components/layout/footer';
import Nav from '@/components/layout/nav';
import AutomationDetailsPage from '@/features/automations/automation-details-page';
import type { Hex } from 'viem';

export default async function AutomationDetails({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  return (
    <div className="min-h-screen bg-(--bg) flex flex-col">
      <Nav className="max-w-6xl mx-auto w-full" />
      <AutomationDetailsPage hash={hash as Hex} />
      <Footer />
    </div>
  );
}
