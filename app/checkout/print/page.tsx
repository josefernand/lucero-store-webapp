'use client';

import { useCart } from '@/context/cart-context';
import { formatCurrency } from '@/lib/utils';
import { CartItem } from '@/ts';
import { useEffect } from 'react';

export default function CheckoutPrintPage() {
  const {
    state: { items, total, loading }
  } = useCart();

  const dateTime = new Date().toLocaleString('es-AR');
  const guest = document.cookie.split('; ').find((row) => row.startsWith('guest='));
  const tel = guest?.split('=')[1] || 'No disponible';

  useEffect(() => {
    if (!loading) {
      // delay 0.5s to allow the page to render
      setTimeout(() => window.print(), 500);
    }
  }, [loading]);

  return (
    <div className="container mx-auto max-w-3xl px-4">
      <p className="text-center text-sm text-gray-500">Fecha: {dateTime}</p>
      <p className="text-center text-sm text-gray-500">Telefono: {tel}</p>
      <h1 className="my-4 font-semibold">Pedido</h1>

      <div>
        {items.map((item) => (
          <div key={item.product.id} className="mb-2 flex items-start gap-2 text-sm">
            <div className="mr-auto">
              {item.quantity} {item.product.name}
            </div>
            <div>{formatCurrency(item.product.price)}</div>
          </div>
        ))}
      </div>
      <div className="my-4 flex items-center justify-between border-t border-dashed pt-2 font-semibold">
        <div>Total</div>
        <div>{formatCurrency(total)}</div>
      </div>
    </div>
  );
}
