import prisma from "@/lib/prisma";
import Link from "next/link";
import { User, ArrowRight, Heart, MessageCircle, BookOpen, Brain, Leaf, Sun, Moon, Star, Compass, Anchor, Feather, Wind, Waves, Mountain, Flame, Sparkles, Users, Shield, Lightbulb } from "lucide-react";

const ICON_MAP = { Heart, MessageCircle, BookOpen, Brain, Leaf, Sun, Moon, Star, Compass, Anchor, Feather, Wind, Waves, Mountain, Flame, Sparkles, HandHeart: Heart, Users, Shield, Lightbulb };

export default async function Home() {
  const settingsArray = await prisma.setting.findMany();
  const s = settingsArray.reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});

  const especialidades = await prisma.especialidad.findMany({ orderBy: { orden: 'asc' } });

  const posts = await prisma.post.findMany({
    where: { published: true },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });


  return (
    <div className="flex-1" style={{ backgroundColor: 'var(--secondary-color)' }}>

      {/* Hero */}
      <section className="py-24 px-8 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-[1.1] text-primary">
            {s.home_hero_title || "Psicología Clínica y Acompañamiento"}
          </h1>
          <p className="text-xl mb-10 max-w-xl leading-relaxed mx-auto lg:mx-0" style={{ color: 'var(--muted-color)' }}>
            {s.home_hero_subtitle || "Un espacio profesional de escucha y reflexión."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="#contacto" className="bg-primary text-white px-12 py-5 rounded-full font-bold shadow-2xl hover:brightness-110 transition-all active:scale-95 text-center">
              Contactar ahora
            </Link>
            <Link href="#especialidades" className="px-12 py-5 rounded-full font-bold border-2 border-current opacity-30 hover:opacity-50 transition-all text-center" style={{ color: 'var(--text-color)' }}>
              Cómo trabajo
            </Link>
          </div>
        </div>
        <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
          <div className="relative z-10 w-full aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-300 bg-primary flex items-center justify-center p-12">
            <div className="opacity-5 absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <User size={320} strokeWidth={0.5} className="text-white w-full h-full" />
            </div>
            <p className="relative font-serif italic text-white/90 text-xl text-center leading-relaxed">
              "{s.hero_cita || 'La palabra tiene el poder de transformar el dolor en sentido.'}"
            </p>
          </div>
          <div aria-hidden="true" className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-10 bg-primary" />
          <div aria-hidden="true" className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full blur-3xl opacity-10 bg-primary" />
        </div>
      </section>

      {/* Sobre Mí */}
      <section id="sobre-mi" className="py-24 border-y" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 10%, transparent)', backgroundColor: 'color-mix(in srgb, var(--secondary-color) 95%, var(--primary-color))' }}>
        <div className="max-w-4xl mx-auto px-8 text-center">
          <div aria-hidden="true" className="w-16 h-1 bg-primary mx-auto mb-10" />
          <h2 className="text-4xl font-serif font-bold mb-8 text-primary">Sobre Mí</h2>
          <p className="text-xl leading-loose" style={{ color: 'var(--muted-color)' }}>
            {s.sobre_mi_text || 'Soy la Licenciada Cecilia Lucero, dedicada a brindar un espacio de escucha segura y profesional.'}
          </p>
        </div>
      </section>

      {/* Especialidades */}
      {especialidades.length > 0 && (
        <section id="especialidades" className="py-32 px-8 max-w-7xl mx-auto w-full">
          <h2 className="text-4xl font-serif font-bold mb-16 text-center text-primary">Áreas de Especialidad</h2>
          <div className={`grid gap-8 ${especialidades.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : especialidades.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto' : 'grid-cols-1 md:grid-cols-3'}`}>
            {especialidades.map((item) => {
              const Icon = ICON_MAP[item.icono] || Heart;
              return (
                <div key={item.id} className="p-10 rounded-3xl border hover:shadow-xl transition-all group" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 10%, transparent)', backgroundColor: 'color-mix(in srgb, var(--secondary-color) 97%, var(--primary-color))' }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors group-hover:bg-primary group-hover:text-white" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 8%, transparent)' }} aria-hidden="true">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>{item.titulo}</h3>
                  <p className="leading-relaxed" style={{ color: 'var(--muted-color)' }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Blog Preview */}
      <section id="blog" className="py-32" style={{ backgroundColor: 'color-mix(in srgb, var(--secondary-color) 95%, var(--primary-color))' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-serif font-bold text-primary mb-4">Blog & Recursos</h2>
              <p style={{ color: 'var(--muted-color)' }}>Reflexiones y herramientas para la salud mental.</p>
            </div>
            <Link href="/blog" className="flex items-center gap-2 font-bold text-primary group">
              Ver todo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.length === 0 ? (
              <div className="col-span-3 py-20 border-2 border-dashed rounded-3xl text-center italic" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)', color: 'var(--muted-color)' }}>
                Próximamente más contenido...
              </div>
            ) : posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group block" style={{ backgroundColor: 'var(--secondary-color)' }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--muted-color)' }}>
                  {new Date(post.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors" style={{ color: 'var(--text-color)' }}>{post.title}</h3>
                {post.excerpt && <p className="text-sm leading-relaxed line-clamp-3 mb-4" style={{ color: 'var(--muted-color)' }}>{post.excerpt}</p>}
                <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                  Leer más <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-32 px-8 max-w-4xl mx-auto w-full text-center">
        <div className="bg-primary text-white p-20 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div aria-hidden="true" className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32" />
          <div className="relative z-10">
            <h2 className="text-5xl font-serif font-bold mb-6">
              {s.contacto_titulo || 'Empecemos a hablar'}
            </h2>
            <p className="text-xl mb-10 opacity-80">
              {s.contacto_subtitulo || 'Estoy aquí para acompañarte en tu proceso.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center flex-wrap">
              {s.contact_email && (
                <a href={`mailto:${s.contact_email}`} className="text-lg font-bold hover:opacity-80 transition-opacity hover:underline underline-offset-4">
                  {s.contact_email}
                </a>
              )}
              {s.contact_email && s.contact_phone && <div aria-hidden="true" className="w-2 h-2 bg-white/20 rounded-full hidden sm:block" />}
              {s.contact_phone && (
                <a href={`tel:${s.contact_phone.replace(/\s/g, '')}`} className="text-lg font-bold hover:opacity-80 transition-opacity">
                  {s.contact_phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t text-center text-sm" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 10%, transparent)', color: 'var(--muted-color)' }}>
        <p>© {new Date().getFullYear()} {s.site_name || "Lic. Cecilia Lucero"}. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
