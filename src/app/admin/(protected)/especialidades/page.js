import prisma from "@/lib/prisma";
import EspecialidadesClient from "./EspecialidadesClient";

export default async function EspecialidadesPage() {
  const especialidades = await prisma.especialidad.findMany({ orderBy: { orden: 'asc' } });
  return <EspecialidadesClient especialidades={especialidades} />;
}
