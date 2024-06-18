import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import clsx from 'clsx';
import { Paywall } from '@/components';
import { cookies } from 'next/headers';
import { Guest } from '@/ts';
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import NextTopLoader from 'nextjs-toploader';

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
  displayPaywall = displayPaywall && !process.env.DISABLE_PAYWALL;
  return (
    <html lang="en">
      <body className={clsx(GeistSans.className, 'flex min-h-screen flex-col')}>
        <NextTopLoader showSpinner={false} color="oklch(var(--n))" shadow={false} />
        <CartProvider>{children}</CartProvider>
        {displayPaywall && <Paywall />}
      </body>
    </html>
  );
}
