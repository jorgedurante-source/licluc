'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',             label: 'Inicio' },
  { href: '/#sobre-mi',   label: 'Sobre Mí' },
  { href: '/#especialidades', label: 'Especialidades' },
  { href: '/blog',         label: 'Blog' },
  { href: '/#contacto',   label: 'Contacto' },
];

export default function SiteNav({ siteName }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [open]);

  return (
    <nav
      aria-label="Navegación principal"
      className="px-6 md:px-8 py-5 flex justify-between items-center max-w-7xl mx-auto w-full sticky top-0 z-50 backdrop-blur-md transition-colors duration-500"
      style={{ backgroundColor: 'color-mix(in srgb, var(--secondary-color) 90%, transparent)' }}
    >
      {/* Logo */}
      <Link href="/" className="text-xl md:text-2xl font-serif font-bold text-primary">
        {siteName || 'Lic. Cecilia Lucero'}
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-[0.2em]">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={`py-3 transition-all hover:text-primary ${isActive ? 'text-primary' : 'text-muted'}`}
            >
              {label}
            </Link>
          );
        })}
        {/* CTA */}
        <Link
          href="/#contacto"
          className="ml-2 px-5 py-2.5 rounded-full bg-primary text-white font-bold text-xs hover:brightness-110 transition-all hover:scale-[1.02] active:scale-95"
        >
          Reservar turno
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden p-2 rounded-lg transition-colors text-muted hover:text-primary"
        style={{ '--hover-bg': 'color-mix(in srgb, var(--primary-color) 6%, transparent)' }}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile drawer */}
      {open && (
        <div
          id="mobile-menu"
          className="absolute top-full left-0 right-0 border-b border-subtle shadow-lg md:hidden"
          style={{ backgroundColor: 'var(--secondary-color)' }}
        >
          <div className="flex flex-col px-6 py-4 gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="py-4 text-sm font-bold uppercase tracking-widest text-muted hover:text-primary border-b border-subtle last:border-0 transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/#contacto"
              onClick={() => setOpen(false)}
              className="mt-3 py-3 text-center text-sm font-bold rounded-full bg-primary text-white hover:brightness-110 transition-all"
            >
              Reservar turno
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
