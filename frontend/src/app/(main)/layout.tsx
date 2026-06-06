import Navbar from '@/components/navbar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-lg mx-auto w-full px-4 pt-4 pb-24">
        {children}
      </main>
    </div>
  );
}
