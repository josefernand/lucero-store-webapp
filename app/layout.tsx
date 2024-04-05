import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import clsx from 'clsx';
import { Footer, Navbar, Paywall } from '@/components';
import './globals.css';
import { cookies } from 'next/headers';
import { Guest } from '@/ts';

export const metadata: Metadata = {
  title: {
    template: '%s | Lucero',
    default: 'Lucero'
  },
  description: 'Encontrá tu estrella'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  let displayPaywall = true;
  const cookie = cookies().get('guest');
  if (cookie?.value) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/guests/${cookie.value}`, {
      cache: 'no-store'
    });
    const guest: Guest = await res.json();
    displayPaywall = !guest.enabled;
  }
  return (
    <html lang="en">
      <body className={clsx(GeistSans.className, 'flex min-h-screen flex-col')}>
        {children}
        {displayPaywall && <Paywall />}
      </body>
    </html>
  );
}
