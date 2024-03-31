'use client';

import { Product } from '@/ts';
import { PlusCircleIcon } from 'lucide-react';

export default function CartAddButton({ product }: { product: Product }) {
  const addToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = [...cartItems, product];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'cart',
        newValue: JSON.stringify(updatedCart)
      })
    );
  };

  return (
    <button className="btn btn-neutral" onClick={addToCart}>
      <PlusCircleIcon className="h-6 w-6" />
      Agregar al carrito
    </button>
  );
}
