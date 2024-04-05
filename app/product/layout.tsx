import { Footer, Navbar } from '@/components';

export default async function ProductsLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-3xl flex-1 px-4 pb-12">{children}</main>
      <Footer />
    </>
  );
}
