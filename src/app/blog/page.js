import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export async function generateMetadata() {
  const settingsArray = await prisma.setting.findMany();
  const s = settingsArray.reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});
  return {
    title: `Blog | ${s.site_name || 'Lic. Cecilia Lucero'}`,
    description: s.site_description || "Reflexiones y recursos sobre salud mental.",
  };
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--secondary-color)' }}>
      <div className="max-w-4xl mx-auto px-8 py-20">
        <ScrollReveal>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-primary transition-colors mb-12 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>

          <h1 className="text-5xl font-serif font-bold text-primary mb-4">Blog & Recursos</h1>
          <p className="text-muted text-lg mb-16">Reflexiones y herramientas para la salud mental.</p>
        </ScrollReveal>

        {posts.length === 0 ? (
          <ScrollReveal className="py-32 text-center border-2 border-dashed border-subtle rounded-3xl text-muted italic">
            Próximamente más contenido...
          </ScrollReveal>
        ) : (
          <div className="space-y-8">
            {posts.map((post, index) => (
              <ScrollReveal key={post.id} delay={index * 0.1}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block border border-subtle bg-card-soft rounded-2xl p-8 hover:border-primary/20 hover:shadow-lg transition-all"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
                    {new Date(post.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <h2 className="text-2xl font-serif font-bold text-primary mb-3 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-muted leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>
                  )}
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-primary">
                    Leer artículo <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
