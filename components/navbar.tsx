'use client';

import Link from 'next/link';
import { Cart, LuceroStarIcon } from '@/components';
import logo from '@/public/lucero.svg';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const parthname = usePathname();
  const showCart = parthname !== '/checkout';

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="navbar-start"></div>
        <div className="navbar-center">
          <Link className="btn btn-ghost gap-0 text-xl" href="/">
            <LuceroStarIcon className="h-6 w-6" />
            <Image src={logo} alt="Lucero" height={24} className="h-6" />
          </Link>
        </div>
        <div className="navbar-end">{showCart && <Cart />}</div>
      </div>
    </>
  );
}
