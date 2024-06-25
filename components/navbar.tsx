'use client';

import Link from 'next/link';
import { Cart, LuceroStarIcon } from '@/components';
import logo from '@/public/lucero.svg';
import Image from 'next/image';
import clsx from 'clsx';
import { useState } from 'react';

export default function Navbar({ showCart = true }: { showCart?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  if (typeof window !== 'undefined') {
    window.onscroll = () => {
      setScrolled(window.scrollY > 10);
    };
  }

  return (
    <div
      className={clsx('navbar transition', {
        'bg-base-100/95 shadow-md': scrolled,
        'bg-base-100': !scrolled
      })}
    >
      <div className="navbar-start"></div>
      <div className="navbar-center">
        <Link className="btn btn-ghost gap-0 text-xl" href="/">
          <LuceroStarIcon className="h-6 w-6" />
          <Image src={logo} alt="Lucero" height={24} className="h-6" />
        </Link>
      </div>
      <div className="navbar-end">{showCart && <Cart />}</div>
    </div>
  );
}
