const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const citas = [
    "La palabra tiene el poder de transformar el dolor en sentido.",
    "El autoconocimiento es el primer paso hacia la libertad emocional.",
    "En la escucha profunda encontramos las respuestas que ya habitan en nosotros.",
    "Sanar no es borrar el pasado, es aprender a vivir con él desde un lugar nuevo.",
    "El espacio terapéutico es un refugio para la verdad y el crecimiento.",
    "Cada proceso es único; cada tiempo, sagrado."
  ];

  console.log('Sembrando citas...');
  for (const texto of citas) {
    await prisma.cita.create({
      data: { texto }
    });
  }
  console.log('Citas sembradas con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
