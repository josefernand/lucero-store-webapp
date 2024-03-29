import { formatCurrency } from '@/lib/utils';
import { Product } from '@/ts';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Producto #${params.id}`
  };
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const res = await fetch(`${process.env.API_BASE_URL}/products/${id}`, { cache: 'no-store' });
  const product: Product = await res.json();

  return (
    <>
      <div className="group card card-compact overflow-hidden border bg-base-100 hover:border-neutral hover:border-opacity-20">
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
            <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-content text-opacity-20">
              <ImageIcon className="h-12 w-12" />
            </div>
          )}
        </figure>
        <div className="card-body gap-0">
          <p className="mb-auto line-clamp-2 font-semibold">{product.name}</p>
          <span className="mt-1 text-sm">{formatCurrency(product.price)}</span>
        </div>
        <div className="absolute h-full w-full bg-neutral bg-opacity-0 group-hover:bg-opacity-10"></div>
      </div>
    </>
  );
}
