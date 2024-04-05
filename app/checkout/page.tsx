'use client';

import { WhatsAppIcon } from '@/components';
import { useCart } from '@/hooks';
import { formatCurrency } from '@/lib/utils';
import clsx from 'clsx';
import { ChevronLeftIcon, ImageIcon, ReceiptTextIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const phoneNumber = process.env.NEXT_PUBLIC_LUCERO_PHONE;

export default function CheckoutPage() {
  const { cartItems, cartTotal } = useCart();
  const [note, setNote] = useState('');

  const createOrderMessage = () => {
    let message = 'Hola! 👋✨\n';
    message += 'Me gustaría hacer el siguiente pedido:\n\n';
    cartItems.forEach((item) => {
      message += `${item.product.id} - ${item.product.name} x ${item.quantity} = ${formatCurrency(
        item.total
      )}\n`;
    });
    message += `\n*Total: ${formatCurrency(cartTotal)}*`;
    if (note) {
      message += `\n\n*Nota:* ${note}`;
    }
    return message;
  };

  const handleSendByWhatsApp = () => {
    const message = createOrderMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <div role="alert" className="alert items-start">
        <span className="text-start text-sm">
          Te recordamos que la disponibilidad de los productos puede cambiar antes de tu pedido.
          Pero no te preocupes, te vamos a contactar rápidamente para confirmarlo. Gracias!
        </span>
      </div>
      <h3 className="mb-2 mt-4 text-lg font-bold">Revisá tu pedido</h3>
      <div className="flex flex-col gap-4 pt-4">
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
            </div>
            <div className="mr-auto flex flex-col gap-1">
              <span className="line-clamp-2 text-sm font-semibold sm:text-base">
                {item.product.name}
              </span>
              <span className="text-sm text-neutral-500">
                {item.quantity} x {formatCurrency(item.product.price)}
              </span>
            </div>
            <span className="text-sm">{formatCurrency(item.total)}</span>
          </div>
        ))}
      </div>

      <div className="my-4 flex justify-between rounded-lg bg-base-300 px-4 py-2 font-semibold">
        <span>Total</span>
        <span>{formatCurrency(cartTotal)}</span>
      </div>
      <textarea
        className="textarea textarea-bordered w-full"
        rows={2}
        placeholder="Agregá una nota para tu pedido"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      ></textarea>
      <div className="mt-2 flex flex-col gap-2">
        <button
          className="btn btn-neutral btn-block"
          disabled={cartItems.length === 0}
          onClick={handleSendByWhatsApp}
        >
          <WhatsAppIcon className="h-6 w-6" />
          Enviar por WhatsApp
        </button>
        <Link
          href="/checkout/print"
          className={clsx('btn btn-block', { 'btn-disabled': cartItems.length === 0 })}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ReceiptTextIcon className="h-6 w-6" />
          Imprimir pedido
        </Link>
        <a href="/" className="btn btn-ghost btn-block">
          <ChevronLeftIcon className="h-6 w-6" />
          Volver
        </a>
      </div>
    </>
  );
}