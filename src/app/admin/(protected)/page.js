import prisma from "@/lib/prisma";
import Link from "next/link";
import { FileText, Settings, Users, ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
  const [postCount, userCount] = await Promise.all([
    prisma.post.count({ where: { published: true } }),
    prisma.user.count(),
  ]);
  const draftCount = await prisma.post.count({ where: { published: false } });

  const cards = [
    { label: 'Posts publicados', value: postCount,  href: '/admin/blog',     icon: FileText },
    { label: 'Borradores',       value: draftCount, href: '/admin/blog',     icon: FileText },
    { label: 'Usuarios',         value: userCount,  href: '/admin/users',    icon: Users },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-white mb-1">Panel de Control</h1>
        <p className="text-white/40 text-sm">Resumen general del sitio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href} className="group bg-white/5 border border-white/5 rounded-xl p-5 hover:bg-white/8 hover:border-white/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <Icon size={16} className="text-white/30" />
              <ArrowRight size={13} className="text-white/20 group-hover:text-white/40 group-hover:translate-x-0.5 transition-all" />
            </div>
            <p className="text-3xl font-bold text-white mb-1">{value}</p>
            <p className="text-xs text-white/40 font-medium uppercase tracking-wider">{label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white/5 border border-white/5 rounded-xl p-6">
        <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Accesos rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href="/admin/blog/new" className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/8 border border-white/5 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <FileText size={15} className="text-white/60" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">Nuevo artículo</p>
              <p className="text-xs text-white/30">Crear un post en el blog</p>
            </div>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 p-4 rounded-lg bg-white/5 hover:bg-white/8 border border-white/5 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Settings size={15} className="text-white/60" />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">Configuración</p>
              <p className="text-xs text-white/30">Temas, textos y contacto</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
