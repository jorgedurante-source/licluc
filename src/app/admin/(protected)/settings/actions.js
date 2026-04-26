'use server';
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveSettings(formData) {
  const keys = [
    'theme_primary', 'theme_secondary', 'theme_font', 'site_name',
    'home_hero_title', 'home_hero_subtitle', 'hero_cita',
    'sobre_mi_text',
    'contacto_titulo', 'contacto_subtitulo',
    'contact_email', 'contact_phone',
  ];
  
  for (const key of keys) {
    const value = formData.get(key);
    if (value !== null) {
      await prisma.setting.upsert({
        where: { key: key },
        update: { value: value },
        create: { key: key, value: value },
      });
    }
  }

  revalidatePath('/');
  revalidatePath('/admin/settings');
  return { success: true };
}
