import { Product } from '@/ts';
import { CartItem } from '@/ts/interfaces/cart';
import { useEffect, useState } from 'react';

export default function UseCart() {
  const [cartItems, setCartItems] = useState([] as CartItem[]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const products: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
    updateCart(products);
  }, []);

  const updateCart = (products: Product[]) => {
    const cartItems = products.reduce((acc, product) => {
      const existingItem = acc.find((item) => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.total = existingItem.product.price * existingItem.quantity;
      } else {
        acc.push({
          product,
          quantity: 1,
          total: product.price
        });
      }
      return acc;
    }, [] as CartItem[]);
    setCartItems(cartItems);
    const total = cartItems.reduce((acc, item) => acc + item.total, 0);
    setCartTotal(total);
    setLoading(false);
  };

  return { cartItems, cartTotal, loading };
}
