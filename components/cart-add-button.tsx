'use client';

import { useCart } from '@/context/cart-context';
import { ActionType, Product } from '@/ts';
import { PlusCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartAddButton({ product }: { product: Product }) {
  const { state, dispatch } = useCart();
  const [available, setAvailable] = useState(product.stock);

  useEffect(() => {
    const item = state.items.find((item) => item.product.id === product.id);
    if (item) {
      setAvailable(item.product.stock - item.quantity);
    } else {
      setAvailable(product.stock);
    }
  }, [state, product]);

  const addToCart = () => {
    dispatch({ type: ActionType.ADD_TO_CART, payload: product });
  };

  return (
    <>
      <button className="btn btn-neutral" onClick={addToCart} disabled={available <= 0}>
        <PlusCircleIcon className="h-6 w-6" />
        Agregar
      </button>
    </>
  );
}
