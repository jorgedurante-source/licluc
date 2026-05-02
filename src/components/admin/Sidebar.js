'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, LogOut, Users, ChevronRight, Layers, Quote } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function Sidebar({ user }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard',      href: '/admin',          icon: LayoutDashboard },
    { name: 'Blog',           href: '/admin/blog',     icon: FileText },
    { name: 'Especialidades', href: '/admin/especialidades', icon: Layers },
    { name: 'Ajustes',        href: '/admin/settings', icon: Settings },
    ...(user?.role === 'superadmin' ? [{ name: 'Usuarios', href: '/admin/users', icon: Users }] : []),
  ];

  return (
    <aside className="w-60 bg-[#0f1117] border-r border-white/5 text-white flex flex-col min-h-screen shrink-0">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-white/5">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 mb-1">Panel Admin</div>
        <div className="font-serif text-lg font-bold text-white leading-tight">Cecilia Lucero</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-0.5 px-2">
        {menuItems.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link
              key={name}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
                isActive
                  ? 'bg-white/5 text-white'
                  : 'text-white/30 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
              <span>{name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60">
            {(user?.name || user?.username || 'A')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white/80 truncate">{user?.name || user?.username}</p>
            <p className="text-xs text-white/30 capitalize">{user?.role === 'superadmin' ? 'Super Admin' : 'Editor'}</p>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 text-xs text-white/30 hover:text-white/70 transition-colors w-full px-1 py-1"
        >
          <LogOut size={13} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
