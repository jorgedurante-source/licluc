'use server';
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

async function uniqueSlug(base) {
  let slug = base;
  let n = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

export async function createPost(formData) {
  const title = formData.get('title')?.trim();
  const content = formData.get('content') || '';
  const excerpt = formData.get('excerpt')?.trim() || '';
  const published = formData.get('published') === 'true';

  if (!title) return { error: 'El título es requerido' };

  const slug = await uniqueSlug(slugify(title));
  await prisma.post.create({ data: { title, content, excerpt, slug, published } });

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  redirect('/admin/blog');
}

export async function updatePost(id, formData) {
  const title = formData.get('title')?.trim();
  const content = formData.get('content') || '';
  const excerpt = formData.get('excerpt')?.trim() || '';
  const published = formData.get('published') === 'true';

  if (!title) return { error: 'El título es requerido' };

  await prisma.post.update({ where: { id }, data: { title, content, excerpt, published } });

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  redirect('/admin/blog');
}

export async function deletePost(id) {
  await prisma.post.delete({ where: { id } });
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}

export async function togglePublished(id, published) {
  await prisma.post.update({ where: { id }, data: { published } });
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}
