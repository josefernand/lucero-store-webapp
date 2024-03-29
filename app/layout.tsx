import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import clsx from 'clsx';
import { Footer, Navbar } from '@/components';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Lucero',
    default: 'Lucero'
  },
  description: 'Encuentra tu estrella en cada joya'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(GeistSans.className, 'flex min-h-screen flex-col')}>
        <Navbar />
        <main className="container mx-auto max-w-3xl flex-1 px-4 pb-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
