import Link from 'next/link';
import { ProductsResponse, Product } from '@/ts';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import { GemIcon, ImageIcon } from 'lucide-react';

export default async function Home() {
  const res = await fetch(`${process.env.API_BASE_URL}/products`, { cache: 'no-store' });
  const jsonRes: ProductsResponse = await res.json();
  const products: Product[] = jsonRes.products || [];

  return (
    <>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {products.map((product) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className="group card card-compact overflow-hidden border bg-base-100 hover:border-neutral hover:border-opacity-20"
            >
              <figure className="aspect-square">
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
              </figure>
              <div className="card-body gap-0">
                <p className="mb-auto line-clamp-2 font-semibold">{product.name}</p>
                <span className="mt-1 text-sm">{formatCurrency(product.price)}</span>
              </div>
              <div className="absolute h-full w-full bg-neutral bg-opacity-0 group-hover:bg-opacity-10"></div>
            </Link>
          ))}
        </div>
      ) : (
        <div role="alert" className="alert">
          <GemIcon className="h-6 w-6" />
          <span>
            Oops! Parece que este catalogo aún no tiene nada. Es hora de mostrar nuestro brillo!
          </span>
        </div>
      )}
    </>
  );
}
