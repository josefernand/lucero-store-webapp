import Link from 'next/link';
import { ProductsResponse, Product, ProductSearchParams } from '@/ts';
import { capitalize, formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import { GemIcon, ImageIcon } from 'lucide-react';
import { Filter, Footer, Navbar } from '@/components';

export default async function Home({ searchParams }: { searchParams: ProductSearchParams }) {
  const urlSearchParams = new URLSearchParams();
  const productValidFilters = ['material', 'productType'];
  for (const [key, value] of Object.entries(searchParams)) {
    if (value && productValidFilters.includes(key)) {
      urlSearchParams.set(key, value);
    }
  }
  const fetchUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/products?${urlSearchParams.toString()}`;
  const res = await fetch(fetchUrl, { cache: 'no-store' });
  const jsonRes: ProductsResponse = await res.json();
  const products: Product[] = jsonRes.products || [];

  return (
    <>
      <div className="fixed top-0 z-10 w-full">
        <Navbar />
      </div>
      <main className="container mx-auto max-w-3xl flex-1 px-4 pb-12 pt-16">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {products.map((product) => (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                className="group card card-compact overflow-hidden border bg-base-100 hover:border-neutral hover:border-opacity-20"
              >
                <figure className="relative aspect-square">
                  {product.imageUrls && product.imageUrls.length > 0 ? (
                    <Image
                      src={product.imageUrls?.[0]}
                      width={200}
                      height={200}
                      alt={product.name}
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-content text-opacity-10">
                      <ImageIcon className="h-12 w-12" />
                    </div>
                  )}
                  {product.isNew && (
                    <div className="badge badge-neutral absolute left-2 top-2 text-xs">Nuevo</div>
                  )}
                </figure>
                <div className="flex flex-1 flex-col gap-0 p-3">
                  {product.material && (
                    <span className="text-xs text-base-content text-opacity-50">
                      {capitalize(product.material)}
                    </span>
                  )}
                  <p className="mb-auto line-clamp-2 text-sm font-semibold">{product.name}</p>
                  <span className="mt-1 text-sm">{formatCurrency(product.price)}</span>
                </div>
                <div className="absolute h-full w-full bg-neutral bg-opacity-0 group-hover:bg-opacity-10"></div>
              </Link>
            ))}
          </div>
        ) : (
          <div role="alert" className="alert">
            <GemIcon className="h-6 w-6" />
            {urlSearchParams.size > 0 ? (
              <span>
                No hay productos que coincidan con los filtros seleccionados.{' '}
                <Link className="underline" href="/">
                  Ver todos
                </Link>
              </span>
            ) : (
              <span>Oops! Parece que este catalogo aún no tiene nada.</span>
            )}
          </div>
        )}
      </main>
      <div className="fixed bottom-8 flex w-full justify-center">
        <div className="join rounded-full">
          <Filter />
        </div>
      </div>
      <Footer />
    </>
  );
}
