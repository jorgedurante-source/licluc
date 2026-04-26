import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'superadmin') redirect('/admin');

  const me = await prisma.user.findUnique({ where: { username: session.user.username } });
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });

  return <UsersClient users={users} currentUserId={me.id} />;
}
