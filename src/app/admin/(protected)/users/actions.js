'use server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

async function requireSuperAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'superadmin') {
    throw new Error('No autorizado');
  }
}

export async function createUser(formData) {
  await requireSuperAdmin();

  const name = formData.get('name');
  const username = formData.get('username');
  const password = formData.get('password');
  const role = formData.get('role');

  if (!username || !password || !role) {
    return { error: 'Todos los campos son requeridos' };
  }

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) return { error: 'Ya existe un usuario con ese nombre' };

  const hashed = bcrypt.hashSync(password, 10);
  await prisma.user.create({ data: { name: name || username, username, password: hashed, role } });
  revalidatePath('/admin/users');
  return { ok: true };
}

export async function deleteUser(id) {
  await requireSuperAdmin();

  const session = await getServerSession(authOptions);
  const me = await prisma.user.findUnique({ where: { username: session.user.username } });
  if (me.id === id) return { error: 'No puedes eliminarte a ti mismo' };

  await prisma.user.delete({ where: { id } });
  revalidatePath('/admin/users');
  return { ok: true };
}

export async function changeUserRole(id, role) {
  await requireSuperAdmin();

  const session = await getServerSession(authOptions);
  const me = await prisma.user.findUnique({ where: { username: session.user.username } });
  if (me.id === id) return { error: 'No puedes cambiar tu propio rol' };

  await prisma.user.update({ where: { id }, data: { role } });
  revalidatePath('/admin/users');
  return { ok: true };
}
