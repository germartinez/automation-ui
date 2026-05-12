import Footer from '@/components/layout/footer';
import Nav from '@/components/layout/nav';
import AutomationsPage from '@/features/automations/automations-page';

export default function Home() {
  return (
    <div className="min-h-screen bg-(--bg) flex flex-col">
      <Nav className="max-w-6xl mx-auto w-full" />
      <AutomationsPage />
      <Footer />
    </div>
  );
}
