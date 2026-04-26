'use client';
import { useTransition } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { deletePost, togglePublished } from './actions';

export default function BlogList({ posts }) {
  const [isPending, startTransition] = useTransition();

  if (posts.length === 0) {
    return (
      <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-2xl">
        <p className="text-white/30 text-sm mb-4">No hay artículos todavía</p>
        <Link href="/admin/blog/new" className="text-sm font-bold text-white/60 hover:text-white transition-colors underline underline-offset-4">
          Crear el primero
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {posts.map(post => (
        <div
          key={post.id}
          className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-xl px-5 py-4 hover:bg-white/7 transition-all"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${post.published ? 'bg-green-400' : 'bg-white/20'}`} />
              <p className="text-sm font-medium text-white/80 truncate">{post.title}</p>
            </div>
            <p className="text-xs text-white/30 pl-3.5">
              {post.published ? 'Publicado' : 'Borrador'} · {new Date(post.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => startTransition(() => togglePublished(post.id, !post.published))}
              disabled={isPending}
              title={post.published ? 'Despublicar' : 'Publicar'}
              className="p-2 text-white/30 hover:text-white/70 transition-colors disabled:opacity-40 rounded-lg hover:bg-white/5"
            >
              {post.published ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
            <Link
              href={`/admin/blog/${post.id}/edit`}
              className="p-2 text-white/30 hover:text-white/70 transition-colors rounded-lg hover:bg-white/5"
              title="Editar"
            >
              <Pencil size={15} />
            </Link>
            <button
              onClick={() => {
                if (!confirm('¿Eliminar este artículo?')) return;
                startTransition(() => deletePost(post.id));
              }}
              disabled={isPending}
              title="Eliminar"
              className="p-2 text-white/30 hover:text-red-400 transition-colors disabled:opacity-40 rounded-lg hover:bg-white/5"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
