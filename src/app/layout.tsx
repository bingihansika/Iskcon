import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DemoSwitcher } from '@/components/DemoSwitcher';
import { BasketProvider } from '@/context/BasketContext';
import { BasketDrawer } from '@/components/BasketDrawer';

export const metadata: Metadata = {
  title: 'ISKCON Bookstore & Volunteer Management System',
  description: 'Digital platform for ISKCON book distribution, volunteer allocations, sales tracking, QR payments, and campaign settlements.',
  keywords: ['ISKCON', 'Bhagavad Gita', 'Srila Prabhupada', 'Book Distribution', 'Volunteers', 'Spiritual Literature'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col justify-between">
        <BasketProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <DemoSwitcher />
          <BasketDrawer />
        </BasketProvider>
      </body>
    </html>
  );
}
