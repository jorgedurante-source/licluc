import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { updatePost } from "../../actions";

export default async function EditPostPage({ params }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  if (!post) notFound();
  const action = updatePost.bind(null, post.id);
  return <PostEditor post={post} action={action} />;
}
