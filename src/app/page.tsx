import Footer from '@/components/layout/footer';
import Nav from '@/components/layout/nav';
import SchedulePage from '@/features/automations/automations-page';

export default function Home() {
  return (
    <div className="min-h-screen bg-(--bg) flex flex-col">
      <Nav className="max-w-6xl mx-auto w-full" />
      <SchedulePage />
      <Footer />
    </div>
  );
}
