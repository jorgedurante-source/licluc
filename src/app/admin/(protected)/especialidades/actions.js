'use server';
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEspecialidad(formData) {
  const titulo = formData.get('titulo')?.trim();
  const desc = formData.get('desc')?.trim() || '';
  const icono = formData.get('icono') || 'Heart';
  if (!titulo) return { error: 'El título es requerido' };
  const count = await prisma.especialidad.count();
  await prisma.especialidad.create({ data: { titulo, desc, icono, orden: count } });
  revalidatePath('/admin/especialidades');
  revalidatePath('/');
}

export async function updateEspecialidad(id, formData) {
  const titulo = formData.get('titulo')?.trim();
  const desc = formData.get('desc')?.trim() || '';
  const icono = formData.get('icono') || 'Heart';
  if (!titulo) return { error: 'El título es requerido' };
  await prisma.especialidad.update({ where: { id }, data: { titulo, desc, icono } });
  revalidatePath('/admin/especialidades');
  revalidatePath('/');
}

export async function deleteEspecialidad(id) {
  await prisma.especialidad.delete({ where: { id } });
  revalidatePath('/admin/especialidades');
  revalidatePath('/');
}

export async function reorderEspecialidades(ids) {
  await Promise.all(ids.map((id, i) => prisma.especialidad.update({ where: { id }, data: { orden: i } })));
  revalidatePath('/admin/especialidades');
  revalidatePath('/');
}
