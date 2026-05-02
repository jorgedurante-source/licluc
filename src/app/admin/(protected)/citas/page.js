import prisma from "@/lib/prisma";
import CitaManager from "./CitaManager";
import ScrollReveal from "@/components/ScrollReveal";

export default async function CitasPage() {
  if (!prisma.cita) {
    return (
      <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
        <h2 className="text-lg font-bold mb-2">Error de Base de Datos</h2>
        <p>El cliente de base de datos no se ha actualizado correctamente. Por favor, reiniciá el servidor de desarrollo (npm run dev).</p>
      </div>
    );
  }

  const citas = await prisma.cita.findMany({
    orderBy: { id: 'desc' }
  });

  return (
    <ScrollReveal>
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Tarjetas del Hero</h1>
        <p className="text-white/40">Gestioná las frases que aparecen aleatoriamente en la tarjeta del inicio.</p>
      </div>

      <CitaManager initialCitas={citas} />
    </ScrollReveal>
  );
}
