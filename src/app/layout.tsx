import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { BottomNav } from '@/components/layout/BottomNav';
import { ClientOnly } from '@/components/layout/ClientOnly';
import { ServiceWorkerRegistrar } from '@/components/layout/ServiceWorkerRegistrar';

export const metadata: Metadata = {
  title: 'Muscle Coach',
  description: 'Your personal hypertrophy training coach. Offline-first, privacy-focused.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Muscle Coach',
  },
  openGraph: {
    title: 'Muscle Coach',
    description: 'Personal hypertrophy training coach',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#6366F1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <main className="max-w-lg mx-auto relative">
            {children}
          </main>
          <ClientOnly>
            <ServiceWorkerRegistrar />
            <BottomNav />
          </ClientOnly>
        </ThemeProvider>
      </body>
    </html>
  );
}
