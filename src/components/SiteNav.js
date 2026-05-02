'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/',             label: 'Home' },
  { href: '/#sobre-mi',   label: 'Sobre Mí' },
  { href: '/#especialidades', label: 'Especialidades' },
  { href: '/blog',         label: 'Blog' },
  { href: '/#contacto',   label: 'Contacto' },
];

export default function SiteNav({ siteName }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change / scroll
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [open]);

  return (
    <nav aria-label="Navegación principal" className="px-6 md:px-8 py-5 flex justify-between items-center max-w-7xl mx-auto w-full sticky top-0 bg-secondary/90 backdrop-blur-md z-50 transition-colors duration-500">
      {/* Logo */}
      <Link href="/" className="text-xl md:text-2xl font-serif font-bold text-primary">
        {siteName || 'Lic. Cecilia Lucero'}
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-[0.2em] text-muted">
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
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-gray-50 transition-colors"
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
          className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg md:hidden"
        >
          <div className="flex flex-col px-6 py-4 gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="py-4 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-primary border-b border-gray-50 last:border-0 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
