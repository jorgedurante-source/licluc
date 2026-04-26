import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Blog | Lic. Cecilia Lucero",
  description: "Reflexiones y recursos sobre salud mental.",
};

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-primary transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </Link>

        <h1 className="text-5xl font-serif font-bold text-primary mb-4">Blog & Recursos</h1>
        <p className="text-gray-500 text-lg mb-16">Reflexiones y herramientas para la salud mental.</p>

        {posts.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 italic">
            Próximamente más contenido...
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map(post => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block bg-white border border-gray-100 rounded-2xl p-8 hover:border-primary/20 hover:shadow-lg transition-all"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  {new Date(post.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <h2 className="text-2xl font-serif font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-gray-500 leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                )}
                <span className="inline-flex items-center gap-2 text-sm font-bold text-primary">
                  Leer artículo <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
