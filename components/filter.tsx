'use client';

import { capitalize } from '@/lib/utils';
import { Material, ProductType } from '@/ts';
import { Settings2Icon } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Filter() {
  const searchParams = useSearchParams();

  const [count, setCount] = useState(0);
  const [material, setMaterial] = useState<Material | null>(null);
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [filterQueryString, setFilterQueryString] = useState(searchParams.toString());

  const showFilterModal = () => {
    const modal = document.getElementById('filterModal') as HTMLDialogElement;
    modal.showModal();
  };

  const closeFilterModal = () => {
    const modal = document.getElementById('filterModal') as HTMLDialogElement;
    modal.close();
  };

  useEffect(() => {
    const material = searchParams.get('material');
    if (material) {
      setMaterial(material as Material);
    } else {
      setMaterial(null);
    }
    const productType = searchParams.get('productType');
    if (productType) {
      setProductType(productType as ProductType);
    } else {
      setProductType(null);
    }
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (material !== null) {
      params.set('material', material);
    } else {
      params.delete('material');
    }
    if (productType !== null) {
      params.set('productType', productType);
    } else {
      params.delete('productType');
    }
    setFilterQueryString(params.toString());

    let count = 0;
    if (material !== null) {
      count++;
    }
    if (productType !== null) {
      count++;
    }
    setCount(count);
  }, [material, productType, searchParams]);

  const onApply = () => {
    closeFilterModal();
  };

  const onClear = () => {
    setMaterial(null);
    setProductType(null);
    onApply();
  };

  return (
    <>
      <button
        className="btn rounded-full border border-base-content shadow-md hover:border-base-content"
        onClick={showFilterModal}
      >
        {count > 0 ? (
          <div className="badge badge-neutral">{count}</div>
        ) : (
          <Settings2Icon className="h-6 w-6" />
        )}
        {count > 0 ? 'Filtros' : 'Filtrar'}
      </button>
      <dialog id="filterModal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <button
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
            onClick={closeFilterModal}
          >
            ✕
          </button>
          <h3 className="mb-4 text-lg font-bold">Filtrar</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="mb-2 font-bold">Material</h4>
              <div className="form-control mb-2">
                <label htmlFor="material-all" className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="material"
                    id="material-all"
                    className="radio"
                    checked={material === null}
                    onChange={() => setMaterial(null)}
                  />
                  <span className="label-text pt-0.5">Todos</span>
                </label>
              </div>
              {Object.values(Material).map((item) => (
                <div className="form-control mb-2" key={item}>
                  <label
                    htmlFor={`material-${item}`}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="radio"
                      name="material"
                      id={`material-${item}`}
                      className="radio"
                      checked={item === material}
                      onChange={() => setMaterial(item)}
                    />
                    <span className="label-text pt-0.5">{capitalize(item)}</span>
                  </label>
                </div>
              ))}
            </div>
            <div>
              <h4 className="mb-2 font-bold">Tipo</h4>
              <div className="form-control mb-2">
                <label htmlFor="productType-all" className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="productType"
                    id="productType-all"
                    className="radio"
                    checked={productType === null}
                    onChange={() => setProductType(null)}
                  />
                  <span className="label-text pt-0.5">Todos</span>
                </label>
              </div>
              {Object.values(ProductType).map((item) => (
                <div className="form-control mb-2" key={item}>
                  <label
                    htmlFor={`productType-${item}`}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <input
                      type="radio"
                      name="productType"
                      id={`productType-${item}`}
                      className="radio"
                      checked={item === productType}
                      onChange={() => setProductType(item)}
                    />
                    <span className="label-text pt-0.5">{capitalize(item)}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-action">
            <Link role="button" className="btn" href="/" onClick={onClear} scroll={false}>
              Limpiar
            </Link>
            <Link
              role="button"
              className="btn btn-neutral"
              href={`/?${filterQueryString}`}
              onClick={onApply}
              scroll={false}
            >
              Aplicar
            </Link>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
