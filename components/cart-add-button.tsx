'use client';

import { Product } from '@/ts';
import { PlusCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartAddButton({ product }: { product: Product }) {
  const [stock, setStock] = useState(0);

  useEffect(() => {
    const updateStock = () => {
      const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
      const cartItemQuantity = cartItems.filter((item: Product) => item.id === product.id).length;
      setStock(product.stock - cartItemQuantity);
    };
    updateStock();
    const handleCartEvent = (event: StorageEvent) => {
      if (event.key === 'cart') {
        updateStock();
      }
    };
    window.addEventListener('storage', handleCartEvent);
    return () => window.removeEventListener('storage', handleCartEvent);
  }, [product]);

  const addToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = [...cartItems, product];
    setStock((prevStock) => prevStock - 1);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'cart',
        newValue: JSON.stringify(updatedCart)
      })
    );
  };

  return (
    <>
      <button className="btn btn-neutral" onClick={addToCart} disabled={stock <= 0}>
        <PlusCircleIcon className="h-6 w-6" />
        Agregar
      </button>
    </>
  );
}
