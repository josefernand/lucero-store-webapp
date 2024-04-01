'use client';

import { Guest } from '@/ts';
import { useEffect, useState } from 'react';

export default function Paywall() {
  const [tel, setTel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const modal = document.getElementById('paywallModal') as HTMLDialogElement;
    modal.addEventListener('cancel', (event: Event) => {
      event.preventDefault();
    });
    modal.showModal();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch(`/api/guests/${tel}`, { cache: 'no-store' });
    const guest: Guest = await res.json();
    if (!guest || !guest.enabled) {
      setError('El número de celular que ingresaste aún no tiene acceso a la tienda.');
      setLoading(false);
      return;
    }
    setLoading(false);
    document.cookie = `guest=${tel}; path=/; max-age=86400`;
    const modal = document.getElementById('paywallModal') as HTMLDialogElement;
    modal.close();
  };

  return (
    <dialog id="paywallModal" className="modal backdrop-blur">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Hola!</h3>
        <p className="mb-4">
          Estamos probando nuestra tienda y solo tenemos acceso limitado para algunos invitados
          especiales.
        </p>
        <p className="mb-4">Si sos un invitado, por favor ingresa tu número de celular.</p>
        {error && (
          <div role="alert" className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        <div className="form-control gap-4">
          <input
            type="tel"
            placeholder="Número de celular"
            className="input input-bordered"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            autoComplete="off"
          />
          <button
            type="button"
            className="btn btn-neutral"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading && <span className="loading loading-spinner"></span>}
            Ingresar
          </button>
        </div>
      </div>
    </dialog>
  );
}
