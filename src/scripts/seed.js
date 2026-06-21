const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  // 1. Crear usuario administrador (usando upsert para no duplicar ni borrar)
  const adminPassword = bcrypt.hashSync('admin123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      name: 'Cecilia Lucero',
      password: adminPassword,
      role: 'superadmin',
    },
  });

  // 2. Ajustes iniciales
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
    { key: 'site_description', value: 'Sitio profesional de psicología clínica y acompañamiento terapéutico.' },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  // 3. Especialidades iniciales (solo si no hay ninguna)
  const countEsp = await prisma.especialidad.count();
  if (countEsp === 0) {
    await prisma.especialidad.createMany({
      data: [
        { titulo: 'Ansiedad y Estrés',   desc: 'Herramientas para gestionar la presión diaria y reencontrar la calma.',                    icono: 'Heart',       orden: 0 },
        { titulo: 'Terapia de Vínculos', desc: 'Espacios para reconstruir la comunicación y la empatía en las relaciones.',                 icono: 'MessageCircle', orden: 1 },
        { titulo: 'Procesos de Duelo',   desc: 'Acompañamiento en momentos de pérdida para sanar a tu propio tiempo.',                     icono: 'BookOpen',    orden: 2 },
      ],
    });
  }

  // 4. Tarjetas iniciales (Citas) - Solo si no hay ninguna
  const countCitas = await prisma.cita.count();
  if (countCitas === 0) {
    await prisma.cita.createMany({
      data: [
        { texto: 'La palabra tiene el poder de transformar el dolor en sentido.' },
        { texto: 'Tu historia merece un espacio de respeto y escucha profunda.' },
        { texto: 'Sanar no es borrar el pasado, sino construir un nuevo presente.' }
      ],
    });
  }

  console.log('Seed completado exitosamente.');
  console.log('Admin: cecilia / admin123');
}

main()
  .catch(e => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
