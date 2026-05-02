import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: `${post.title} | Lic. Cecilia Lucero`,
    description: post.excerpt || undefined,
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
  });

  if (!post) notFound();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--secondary-color)' }}>
      <div className="max-w-2xl mx-auto px-8 py-20">
        <ScrollReveal>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-primary transition-colors mb-12 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Volver al blog
          </Link>

          <p className="text-xs font-bold uppercase tracking-wider text-muted mb-4">
            {new Date(post.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8 leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-muted leading-relaxed mb-12 pb-12 border-b border-subtle">
              {post.excerpt}
            </p>
          )}

          <div
            className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-primary prose-a:text-primary prose-a:no-underline hover:prose-a:underline text-muted"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </ScrollReveal>
      </div>
    </div>
  );
}
