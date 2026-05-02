const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Borrar todos los usuarios existentes
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      username: 'cecilia',
      name: 'Cecilia Lucero',
      password: bcrypt.hashSync('admin123', 10),
      role: 'superadmin',
    },
  });

  const defaultSettings = [
    { key: 'site_name', value: 'Lic. Cecilia Lucero' },
    { key: 'theme_primary', value: '#1a2b3c' },
    { key: 'theme_secondary', value: '#ffffff' },
    { key: 'theme_font', value: 'Playfair' },
    { key: 'home_hero_title', value: 'Psicología Clínica y Acompañamiento' },
    { key: 'home_hero_subtitle', value: 'Un espacio profesional de escucha y reflexión.' },
    { key: 'contact_email', value: '' },
    { key: 'contact_phone', value: '' },
    { key: 'sobre_mi_text', value: 'Soy la Licenciada Cecilia Lucero, dedicada a brindar un espacio de escucha segura y profesional. Mi enfoque integra la teoría clínica con la sensibilidad humana, buscando siempre el bienestar y la autonomía de cada paciente.' },
    { key: 'contacto_titulo', value: 'Empecemos a hablar' },
    { key: 'contacto_subtitulo', value: 'Estoy aquí para acompañarte en tu proceso.' },
    { key: 'hero_cita', value: 'La palabra tiene el poder de transformar el dolor en sentido.' },
    { key: 'sobre_mi_enfoque', value: '' },
    { key: 'sobre_mi_matricula', value: '' },
    { key: 'sobre_mi_formacion', value: '' },
    { key: 'sobre_mi_anos', value: '' },
    { key: 'site_instagram', value: '' },
    { key: 'site_description', value: 'Sitio profesional de psicología clínica y acompañamiento terapéutico.' },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  // Seed especialidades solo si no existen
  const count = await prisma.especialidad.count();
  if (count === 0) {
    await prisma.especialidad.createMany({
      data: [
        { titulo: 'Ansiedad y Estrés',   desc: 'Herramientas para gestionar la presión diaria y reencontrar la calma.',                    icono: 'Heart',       orden: 0 },
        { titulo: 'Terapia de Vínculos', desc: 'Espacios para reconstruir la comunicación y la empatía en las relaciones.',                 icono: 'MessageCircle', orden: 1 },
        { titulo: 'Procesos de Duelo',   desc: 'Acompañamiento en momentos de pérdida para sanar a tu propio tiempo.',                     icono: 'BookOpen',    orden: 2 },
      ],
    });
  }

  console.log('Seed completado.');
  console.log('Usuario: cecilia');
  console.log('Password: admin123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
