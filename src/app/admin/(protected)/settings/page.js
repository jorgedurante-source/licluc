import prisma from "@/lib/prisma";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const [settingsArray, citas] = await Promise.all([
    prisma.setting.findMany(),
    prisma.cita.findMany({ orderBy: { id: 'desc' } })
  ]);

  const settings = settingsArray.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-admin mb-6">Configuración del Sitio</h1>
      <SettingsForm initialSettings={settings} initialCitas={citas} />
    </div>
  );
}
