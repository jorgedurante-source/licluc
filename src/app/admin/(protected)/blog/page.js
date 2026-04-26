import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import BlogList from "./BlogList";

export default async function BlogAdminPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white mb-1">Blog</h1>
          <p className="text-white/40 text-sm">{posts.length} artículo{posts.length !== 1 ? 's' : ''} en total</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-white text-[#13151c] px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/90 transition-all"
        >
          <Plus size={15} />
          Nuevo artículo
        </Link>
      </div>

      <BlogList posts={posts} />
    </div>
  );
}
