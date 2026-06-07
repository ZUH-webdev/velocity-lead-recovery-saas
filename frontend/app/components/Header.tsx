"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

const navItems = [
  { label: 'The Platform', hash: '#platform' },
  { label: 'How It Works', hash: '#mechanism' },
  { label: 'The Impact', hash: '#results' },
  { label: 'About', href: '/about' },
];

interface HeaderProps {
  variant?: 'light' | 'dark';
}

export default function Header({ variant = 'light' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isDark = variant === 'dark';

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const header = document.querySelector('header');

    function updateHeaderHeight() {
      if (header) {
        document.documentElement.style.setProperty('--header-height', `${header.offsetHeight}px`);
      }
    }

    function onScroll() {
      if (!header || isDark) return;
      if (window.scrollY > 10) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isDark]);

  function resolveHref(item: (typeof navItems)[number]) {
    if ('href' in item && item.href) return item.href;
    return isHome ? item.hash : `/${item.hash}`;
  }

  function linkClass(item: (typeof navItems)[number]) {
    const href = resolveHref(item);
    const isActive = href === '/about' && pathname === '/about';

    if (isDark) {
      return `font-body text-[15px] font-[500] leading-none tracking-[0em] transition-colors ${
        isActive ? 'text-white' : 'text-[rgba(255,255,255,0.55)] hover:text-[rgba(255,255,255,0.85)]'
      }`;
    }

    return 'font-body text-[15px] font-[500] leading-none tracking-[0em] text-[#6b7280]';
  }

  return (
    <header
      className={
        isDark
          ? 'fixed top-0 left-0 right-0 z-[1000] border-b border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,10,0.88)] py-[14px] backdrop-blur-[19px] transition duration-300'
          : 'fixed top-0 left-0 right-0 z-[1000] border-b border-[rgba(0,0,0,0.06)] bg-[rgba(255,255,255,0.9)] py-[14px] backdrop-blur-[19px] transition duration-300'
      }
      style={{ WebkitBackdropFilter: 'blur(16px)' }}
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_auto] items-center px-[24px] md:grid-cols-[1fr_auto_1fr] md:px-[40px] lg:px-[80px]">
        <Link href="/" className="flex items-center gap-[12px] justify-self-start">
          <Image
            src="/velocity-logo.webp"
            alt="Velocity"
            width={22}
            height={23}
            className={`h-[25px] w-[25px] object-contain brightness-0 ${isDark ? 'invert' : ''}`}
          />
          <span
            className={`font-hero text-[24px] font-[800] leading-none tracking-[-0.02em] ${
              isDark ? 'text-white' : 'text-[#111827]'
            }`}
          >
            VELOCITY
          </span>
        </Link>

        <nav className="hidden items-center gap-[20px] justify-self-center md:flex lg:gap-[46px]">
          {navItems.map((item) => (
            <Link key={item.label} href={resolveHref(item)} className={linkClass(item)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden justify-self-end md:block">
          <Link
            href="/signin"
            className={
              isDark
                ? 'inline-flex min-h-[44px] h-auto items-center gap-[12px] rounded-[8px] bg-white px-[20px] py-[10px] font-body text-[15px] font-[600] tracking-[0.01em] text-[#0f0f10] shadow-[0_8px_24px_rgba(255,255,255,0.08)] lg:h-[44px] lg:px-[24px] lg:py-0'
                : 'inline-flex min-h-[44px] h-auto items-center gap-[12px] rounded-[8px] bg-[#0f172a] px-[20px] py-[10px] font-body text-[15px] font-[600] tracking-[0.01em] text-white shadow-[0_8px_24px_rgba(15,23,42,0.18)] lg:h-[44px] lg:px-[24px] lg:py-0'
            }
          >
            Evaluate Velocity
            <ArrowRight className="h-[18px] w-[18px] stroke-[2.2]" />
          </Link>
        </div>

        <button
          type="button"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className={`inline-flex h-[44px] w-[44px] items-center justify-center rounded-[8px] justify-self-end md:hidden ${
            isDark ? 'text-white' : 'text-[#111827]'
          }`}
        >
          <span className="text-[26px] leading-none">{isMenuOpen ? '×' : '☰'}</span>
        </button>
      </div>

      {isMenuOpen && (
        <div
          className={
            isDark
              ? 'absolute left-0 right-0 top-full border-b border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,10,0.97)] backdrop-blur-[16px] md:hidden'
              : 'absolute left-0 right-0 top-full border-b border-[#f3f4f6] bg-[rgba(255,255,255,0.97)] backdrop-blur-[16px] md:hidden'
          }
          style={{ WebkitBackdropFilter: 'blur(16px)' }}
        >
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={resolveHref(item)}
                onClick={() => setIsMenuOpen(false)}
                className={
                  isDark
                    ? 'flex min-h-[44px] items-center border-b border-[rgba(255,255,255,0.06)] px-[24px] py-[16px] font-body text-[16px] font-[500] text-[rgba(255,255,255,0.65)]'
                    : 'flex min-h-[44px] items-center border-b border-[#f3f4f6] px-[24px] py-[16px] font-body text-[16px] font-[500] text-[#6b7280]'
                }
              >
                {item.label}
              </Link>
            ))}
            <div className="p-[24px]">
              <Link
                href="/signin"
                onClick={() => setIsMenuOpen(false)}
                className={
                  isDark
                    ? 'inline-flex min-h-[44px] w-full items-center justify-center gap-[12px] rounded-[8px] bg-white px-[24px] py-[12px] font-body text-[15px] font-[600] tracking-[0.01em] text-[#0f0f10]'
                    : 'inline-flex min-h-[44px] w-full items-center justify-center gap-[12px] rounded-[8px] bg-[#0f172a] px-[24px] py-[12px] font-body text-[15px] font-[600] tracking-[0.01em] text-white shadow-[0_8px_24px_rgba(15,23,42,0.18)]'
                }
              >
                Evaluate Velocity
                <ArrowRight className="h-[18px] w-[18px] stroke-[2.2]" />
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
