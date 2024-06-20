'use client';

import { formatCurrency } from '@/lib/utils';
import { ActionType, Product } from '@/ts';
import { ImageIcon, SendIcon, ShoppingBagIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { ShoppingBagEmptyIcon } from '@/components';
import { useCart } from '@/context/cart-context';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Cart() {
  const pathName = usePathname();
  const {
    state: { items: cartItems, total, count, showCart, sent },
    dispatch
  } = useCart();

  const showCartModal = () => {
    const modal = document.getElementById('cartModal') as HTMLDialogElement;
    modal.showModal();
  };

  const closeCartModal = () => {
    const modal = document.getElementById('cartModal') as HTMLDialogElement;
    modal.close();
  };

  const handleAddProduct = (product: Product) => {
    dispatch({ type: ActionType.ADD_TO_CART, payload: product });
  };

  const handleRemoveProduct = (id: string) => {
    dispatch({ type: ActionType.REMOVE_FROM_CART, payload: { id } });
  };

  const handleDeleteProduct = (id: string) => {
    dispatch({ type: ActionType.REMOVE_ALL_FROM_CART, payload: { id } });
  };

  useEffect(() => {
    const modal = document.getElementById('cartModal') as HTMLDialogElement;
    modal.addEventListener('close', () => {
      dispatch({ type: ActionType.SHOW_CART, payload: false });
    });
    return () => {
      modal.removeEventListener('close', () => {
        dispatch({ type: ActionType.SHOW_CART, payload: false });
      });
    };
  }, [dispatch]);

  useEffect(() => {
    if (showCart) {
      showCartModal();
    }
  }, [showCart]);

  useEffect(() => {
    if (!pathName.startsWith('/checkout') && sent) {
      dispatch({ type: ActionType.CLEAR_CART });
    }
  }, [pathName, sent, dispatch]);

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
                      <Link href={`/product/${item.product.id}`} onClick={closeCartModal}>
                        <figure className="flex aspect-square h-20 items-center justify-center overflow-hidden rounded-lg border border-neutral-300">
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
                      </Link>
                      <button
                        className="btn btn-circle btn-neutral btn-xs absolute -right-2 -top-2"
                        onClick={() => handleDeleteProduct(item.product.id)}
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mr-auto flex flex-col gap-1">
                      <Link href={`/product/${item.product.id}`} onClick={closeCartModal}>
                        <span className="line-clamp-2 text-sm font-semibold sm:text-base">
                          {item.product.name}
                        </span>
                      </Link>
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
            <a href="/checkout" className="btn btn-neutral btn-block">
              <SendIcon className="h-6 w-6" />
              Enviar pedido
            </a>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
