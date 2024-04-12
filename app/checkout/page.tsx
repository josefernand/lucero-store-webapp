'use client';

import { WhatsAppIcon } from '@/components';
import { useCart } from '@/context/cart-context';
import { formatCurrency } from '@/lib/utils';
import { ActionType } from '@/ts';
import clsx from 'clsx';
import { ChevronLeftIcon, ImageIcon, ReceiptTextIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const phoneNumber = process.env.NEXT_PUBLIC_LUCERO_PHONE;

export default function CheckoutPage() {
  const {
    state: { items: cartItems, total, loading, sent: orderSent },
    dispatch
  } = useCart();
  const [note, setNote] = useState('');

  const createOrderMessage = () => {
    let message = 'Hola! 👋✨\n';
    message += 'Me gustaría hacer el siguiente pedido:\n\n';
    cartItems.forEach((item) => {
      message += `${item.product.id} - ${item.product.name} x ${item.quantity} = ${formatCurrency(
        item.total
      )}\n`;
    });
    message += `\n*Total: ${formatCurrency(total)}*`;
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
    dispatch({ type: ActionType.SEND_ORDER });
  };

  return (
    <>
      {!orderSent && (
        <>
          <h3 className="my-2 text-lg font-bold">Revisá tu pedido</h3>
          <div role="alert" className="alert items-start py-2">
            <span className="text-start text-sm">
              Una vez que envies el pedido te vamos a confirmar la disponibilidad de los productos
              antes de que realices el pago. Gracias!
            </span>
          </div>
          <div className="flex flex-col gap-4 pt-4">
            {loading && (
              <div className="flex gap-4">
                <figure className="skeleton flex aspect-square h-20"></figure>
                <div className="mr-auto flex flex-col gap-2 pt-1">
                  <div className="skeleton h-4 w-20"></div>
                  <div className="skeleton h-4 w-28"></div>
                </div>
                <div className="skeleton h-4 w-20"></div>
              </div>
            )}
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex gap-4">
                <div className="relative">
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
            <span>{formatCurrency(total)}</span>
          </div>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={2}
            placeholder="Agregá una nota para tu pedido"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>{' '}
        </>
      )}
      {orderSent && (
        <>
          <h3 className="my-2 text-center text-lg font-bold">Gracias!</h3>
          <div role="alert" className="alert my-2 items-start">
            <span className="text-start text-sm">
              Estamos procesando tu pedido y te vamos a contactar pronto para confirmar la
              disponibilidad de los productos y coordinar el pago y la entrega. Gracias!
            </span>
          </div>
        </>
      )}
      <div className="mt-2 flex flex-col gap-2">
        {!orderSent ? (
          <button
            className="btn btn-neutral btn-block"
            disabled={cartItems.length === 0}
            onClick={handleSendByWhatsApp}
          >
            <WhatsAppIcon className="h-6 w-6" />
            Enviar pedido por WhatsApp
          </button>
        ) : (
          <Link
            href="/checkout/print"
            className={clsx('btn btn-block', { 'btn-disabled': cartItems.length === 0 })}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ReceiptTextIcon className="h-6 w-6" />
            Imprimir pedido
          </Link>
        )}
        <a href="/" className="btn btn-ghost btn-block">
          <ChevronLeftIcon className="h-6 w-6" />
          Volver
        </a>
      </div>
    </>
  );
}
