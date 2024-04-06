import { CartAddButton } from '@/components';
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/products/${id}`, {
    cache: 'no-store'
  });
  const product: Product = await res.json();

  return (
    <>
      <div className="group card card-compact overflow-hidden border sm:card-side sm:card-normal">
        <figure className="aspect-square">
          {product.imageUrls && product.imageUrls.length > 0 ? (
            <Image
              src={product.imageUrls?.[0]}
              width={400}
              height={400}
              alt={product.name}
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-content text-opacity-10">
              <ImageIcon className="h-12 w-12" />
            </div>
          )}
        </figure>
        <div className="card-body gap-4 border-t sm:border-l sm:border-t-0">
          {product.material && (
            <span className="badge badge-ghost capitalize">{product.material}</span>
          )}
          <div>
            <h2 className="card-title text-2xl">{product.name}</h2>
            <span className="text-lg font-medium">{formatCurrency(product.price)}</span>
          </div>
          <p>{product.description}</p>
          <CartAddButton product={product} />
        </div>
      </div>
    </>
  );
}
