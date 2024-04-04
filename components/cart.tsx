'use client';

import { formatCurrency } from '@/lib/utils';
import { Product } from '@/ts';
import { CartItem } from '@/ts/interfaces/cart';
import { ImageIcon, MinusIcon, PlusIcon, SendIcon, ShoppingBagIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ShoppingBagEmptyIcon } from '.';

const phoneNumber = process.env.NEXT_PUBLIC_LUCERO_PHONE;

export default function Cart() {
  const [cartItems, setCartItems] = useState([] as CartItem[]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const products: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
    setCount(products.length);
    updateCart(products);

    const handleCartEvent = (event: StorageEvent) => {
      if (event.key === 'cart') {
        const products: Product[] = JSON.parse(event.newValue || '[]');
        updateCart(products);
      }
    };

    window.addEventListener('storage', handleCartEvent);
    return () => window.removeEventListener('storage', handleCartEvent);
  }, []);

  const updateCart = (products: Product[]) => {
    setCount(products.length);
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
    setTotal(total);
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      showCartModal();
    }
  }, [cartItems]);

  const showCartModal = () => {
    const modal = document.getElementById('cartModal') as HTMLDialogElement;
    modal.showModal();
  };

  const closeCartModal = () => {
    const modal = document.getElementById('cartModal') as HTMLDialogElement;
    modal.close();
  };

  const handleDeleteProduct = (id: string) => {
    const products: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = products.filter((product) => product.id !== id);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'cart',
        newValue: JSON.stringify(updatedCart)
      })
    );
  };

  const handleAddProduct = (product: Product) => {
    const products: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = [...products, product];
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'cart',
        newValue: JSON.stringify(updatedCart)
      })
    );
  };

  const handleRemoveProduct = (id: string) => {
    const products: Product[] = JSON.parse(localStorage.getItem('cart') || '[]');
    const index = products.findIndex((product) => product.id === id);
    if (index > -1) {
      products.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(products));
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'cart',
        newValue: JSON.stringify(products)
      })
    );
  };

  const handleSendOrder = () => {
    let message = 'Hola! 👋✨\n';
    message += 'Me gustaría hacer el siguiente pedido:\n\n';
    cartItems.forEach((item) => {
      message += `${item.product.id} - ${item.product.name} x ${item.quantity} = ${formatCurrency(
        item.total
      )}\n`;
    });
    message += `\n*Total: ${formatCurrency(total)}*`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <button className="btn btn-circle btn-ghost" onClick={showCartModal}>
        <div className="indicator">
          <ShoppingBagIcon className="h-6 w-6" />
          {count > 0 && <span className="badge indicator-item badge-sm">{count}</span>}
        </div>
      </button>
      <dialog id="cartModal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <button
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
            onClick={closeCartModal}
          >
            ✕
          </button>
          <h3 className="mb-2 text-lg font-bold">Pedido</h3>
          <>
            {cartItems.length > 0 ? (
              <div className="flex max-h-[420px] flex-col gap-4 overflow-auto pt-4">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="relative">
                      <figure className="aspect-square h-20 overflow-hidden rounded-lg border border-neutral-300">
                        {item.product.imageUrls && item.product.imageUrls.length > 0 ? (
                          <Image
                            src={item.product.imageUrls?.[0]}
                            width={120}
                            height={120}
                            alt={item.product.name}
                            priority
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-content text-opacity-10">
                            <ImageIcon className="h-12 w-12" />
                          </div>
                        )}
                      </figure>
                      <button
                        className="btn btn-circle btn-neutral btn-xs absolute -right-2 -top-2"
                        onClick={() => handleDeleteProduct(item.product.id)}
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mr-auto flex flex-col gap-1">
                      <span className="line-clamp-2 text-sm font-semibold sm:text-base">
                        {item.product.name}
                      </span>
                      <div className="flex items-baseline self-start rounded-full border">
                        <button
                          className="rounded-l-full border-r px-2 hover:bg-neutral-200 disabled:opacity-50"
                          onClick={() => handleRemoveProduct(item.product.id)}
                        >
                          -
                        </button>
                        <span className="w-8 px-2 text-center text-sm">{item.quantity}</span>
                        <button
                          className="rounded-r-full border-l px-2 hover:bg-neutral-200 disabled:bg-neutral-300 disabled:opacity-50"
                          onClick={() => handleAddProduct(item.product)}
                          disabled={item.product.stock <= item.quantity}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <span className="text-sm">{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="my-4 flex items-center gap-2 rounded-lg bg-base-300 px-4 py-2">
                <ShoppingBagEmptyIcon className="h-6 w-6" />
                <span>Todavía no hay nada en tu pedido.</span>
              </div>
            )}
          </>
          {cartItems.length > 0 && (
            <div className="my-4 flex justify-between rounded-lg bg-base-300 px-4 py-2 font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          )}
          <div className="modal-action mt-2">
            <button
              className="btn btn-neutral btn-block"
              disabled={cartItems.length === 0}
              onClick={handleSendOrder}
            >
              <SendIcon className="h-6 w-6" />
              Enviar pedido
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
