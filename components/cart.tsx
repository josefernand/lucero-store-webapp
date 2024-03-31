'use client';

import { Product } from '@/ts';
import { ShoppingCartIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Cart() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Set initial count
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    setCount(cartItems.length);

    // Listen for changes
    const handleCartEvent = (event: StorageEvent) => {
      if (event.key === 'cart') {
        const cartItems = JSON.parse(event.newValue || '[]');
        setCount(cartItems.length);
      }
    };

    window.addEventListener('storage', handleCartEvent);
    return () => window.removeEventListener('storage', handleCartEvent);
  }, []);

  const handleCartModal = () => {
    const modal = document.getElementById('cartModal') as HTMLDialogElement;
    modal.showModal();
  };

  return (
    <>
      <button className="btn btn-circle btn-ghost" onClick={handleCartModal}>
        <div className="indicator">
          <ShoppingCartIcon className="h-6 w-6" />
          {count > 0 && <span className="badge indicator-item badge-sm">{count}</span>}
        </div>
      </button>
      <dialog id="cartModal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Hello!</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
