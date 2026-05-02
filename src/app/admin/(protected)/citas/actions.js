'use server';
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addCita(formData) {
  const texto = formData.get('texto');
  const imagen = formData.get('imagen');
  if (!texto) return { error: 'El texto es obligatorio' };

  await prisma.cita.create({
    data: { texto, imagen: imagen || null }
  });

  revalidatePath('/admin/settings');
  revalidatePath('/');
  return { success: true };
}

export async function deleteCita(id) {
  await prisma.cita.delete({
    where: { id }
  });

  revalidatePath('/admin/settings');
  revalidatePath('/');
  return { success: true };
}

export async function updateCita(id, texto, imagen) {
  if (!texto) return { error: 'El texto es obligatorio' };

  await prisma.cita.update({
    where: { id },
    data: { texto, imagen }
  });

  revalidatePath('/admin/settings');
  revalidatePath('/');
  return { success: true };
}
