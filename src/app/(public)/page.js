import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, MessageCircle, BookOpen, Brain, Leaf, Sun, Moon, Star, Compass, Anchor, Feather, Wind, Waves, Mountain, Flame, Sparkles, Users, Shield, Lightbulb, Mail, Phone, Send } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { HeroContent, HeroImage } from "@/components/HeroAnimations";
import ContactForm from "@/components/ContactForm";

const ICON_MAP = { Heart, MessageCircle, BookOpen, Brain, Leaf, Sun, Moon, Star, Compass, Anchor, Feather, Wind, Waves, Mountain, Flame, Sparkles, HandHeart: Heart, Users, Shield, Lightbulb };

export default async function Home() {
  const [settingsArray, especialidades, posts, citas] = await Promise.all([
    prisma.setting.findMany(),
    prisma.especialidad.findMany({ orderBy: { orden: 'asc' } }),
    prisma.post.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.cita ? prisma.cita.findMany() : []
  ]);

  const s = settingsArray.reduce((acc, curr) => { acc[curr.key] = curr.value; return acc; }, {});
  
  // Random quote logic
  const citaSeleccionada = (citas && citas.length > 0)
    ? citas[Math.floor(Math.random() * citas.length)]
    : null;

  const textCita = citaSeleccionada ? citaSeleccionada.texto : (s.hero_cita || 'La palabra tiene el poder de transformar el dolor en sentido.');
  const imageCita = citaSeleccionada ? citaSeleccionada.imagen : null;


  return (
    <main className="flex-1" style={{ backgroundColor: 'var(--secondary-color)' }}>

      {/* Hero */}
      <section aria-label="Introducción" className="py-24 px-8 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16">
        <HeroContent 
          title={s.home_hero_title || "Psicología Clínica y Acompañamiento"}
          subtitle={s.home_hero_subtitle || "Un espacio profesional de escucha y reflexión."}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="#contacto" className="bg-primary text-white px-12 py-5 rounded-full font-bold shadow-2xl hover:brightness-110 transition-all hover:scale-[1.03] active:scale-95 text-center">
              Contactar ahora
            </Link>
            <Link href="#especialidades" className="px-12 py-5 rounded-full font-bold border-2 border-primary/20 text-primary hover:bg-primary/5 transition-all text-center">
              Cómo trabajo
            </Link>
          </div>
        </HeroContent>

        <HeroImage>
          <div className="relative z-10 w-full aspect-square rounded-3xl overflow-hidden shadow-2xl bg-primary flex items-center justify-center">
            {imageCita ? (
              <>
                <Image
                  src={imageCita}
                  alt={`Lic. ${s.site_name || 'Cecilia Lucero'}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-60" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <div className="w-full h-full bg-gradient-to-br from-primary via-primary to-primary/80 opacity-100" />
              </div>
            )}
            <p className={`absolute bottom-8 left-8 right-8 font-serif italic text-white text-xl text-center leading-relaxed ${!imageCita ? 'relative !bottom-0 !left-0 !right-0 px-12 opacity-90 z-10' : 'z-10'}`}>
              "{textCita}"
            </p>
          </div>
          <div aria-hidden="true" className="absolute -top-6 -right-6 w-32 h-32 rounded-full blur-2xl opacity-5 bg-primary animate-float" />
          <div aria-hidden="true" className="absolute -bottom-6 -left-6 w-48 h-48 rounded-full blur-2xl opacity-5 bg-primary animate-float" style={{ animationDelay: '1s' }} />
        </HeroImage>
      </section>

      {/* Sobre Mí */}
      <ScrollReveal>
        <section id="sobre-mi" aria-labelledby="sobre-mi-title" className="py-24 bg-soft border-y border-subtle">
          <div className="max-w-6xl mx-auto px-8">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              {/* Texto principal */}
              <div className="flex-1">
                <div aria-hidden="true" className="w-16 h-1 bg-primary mb-10" />
                <h2 id="sobre-mi-title" className="text-4xl font-serif font-bold mb-8 text-primary">Sobre Mí</h2>
                <div className="text-xl leading-loose text-muted [&_p]:m-0 [&_p]:mb-4" dangerouslySetInnerHTML={{ __html: s.sobre_mi_text || 'Soy la Licenciada Cecilia Lucero, dedicada a brindar un espacio de escucha segura y profesional.' }} />
                {s.sobre_mi_enfoque && (
                  <div className="mt-6 text-lg leading-relaxed text-muted italic border-l-4 pl-6 [&_p]:m-0" style={{ borderColor: 'var(--primary-color)' }} dangerouslySetInnerHTML={{ __html: s.sobre_mi_enfoque }} />
                )}
              </div>
              {/* Credenciales */}
              <div className="lg:w-80 space-y-4 shrink-0">
                {s.sobre_mi_matricula && (
                  <div className="p-5 rounded-2xl border border-subtle bg-card-soft">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Matrícula</p>
                    <p className="font-bold text-primary">{s.sobre_mi_matricula}</p>
                  </div>
                )}
                {s.sobre_mi_formacion && (
                  <div className="p-5 rounded-2xl border border-subtle bg-card-soft">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Formación</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-color)' }}>{s.sobre_mi_formacion}</p>
                  </div>
                )}
                {s.sobre_mi_anos && (
                  <div className="p-5 rounded-2xl border border-subtle bg-card-soft">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Experiencia</p>
                    <p className="font-bold text-primary">{s.sobre_mi_anos} años de práctica clínica</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Especialidades */}
      {especialidades.length > 0 && (
        <section id="especialidades" aria-labelledby="especialidades-title" className="py-32 px-8 max-w-7xl mx-auto w-full">
          <ScrollReveal>
            <h2 id="especialidades-title" className="text-4xl font-serif font-bold mb-16 text-center text-primary">Áreas de Especialidad</h2>
          </ScrollReveal>
          <div className={`grid gap-8 ${especialidades.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : especialidades.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-3xl mx-auto' : 'grid-cols-1 md:grid-cols-3'}`}>
            {especialidades.map((item, index) => {
              const Icon = ICON_MAP[item.icono] || Heart;
              return (
                <ScrollReveal key={item.id} delay={index * 0.1}>
                  <div className="p-10 rounded-3xl border border-subtle bg-card-soft hover:shadow-xl transition-all group h-full">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors group-hover:bg-primary group-hover:text-white" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 8%, transparent)' }} aria-hidden="true">
                      <Icon size={28} />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{item.titulo}</h3>
                    <p className="leading-relaxed text-muted">{item.desc}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>
      )}

      {/* Blog Preview — oculto si no hay posts publicados */}
      {posts.length > 0 && (
        <section id="blog" className="py-32 bg-soft">
          <div className="max-w-7xl mx-auto px-8">
            <ScrollReveal className="flex justify-between items-end mb-16">
              <div>
                <h2 className="text-4xl font-serif font-bold text-primary mb-4">Blog & Recursos</h2>
                <p className="text-muted">Reflexiones y herramientas para la salud mental.</p>
              </div>
              <Link href="/blog" className="flex items-center gap-2 font-bold text-primary group">
                Ver todo <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <ScrollReveal key={post.id} delay={Math.min(index * 0.1, 0.3)}>
                  <Link href={`/blog/${post.slug}`} className="rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow group block h-full" style={{ backgroundColor: 'var(--secondary-color)' }}>
                    <p className="text-xs font-bold uppercase tracking-wider mb-3 text-muted">
                      {new Date(post.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    {post.excerpt && <p className="text-sm leading-relaxed line-clamp-3 mb-4 text-muted">{post.excerpt}</p>}
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                      Leer más <ArrowRight size={14} />
                    </span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contacto */}
      <section id="contacto" className="py-32 px-8 max-w-4xl mx-auto w-full">
        <ScrollReveal>
          <div className="bg-primary text-white p-12 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div aria-hidden="true" className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="text-4xl md:text-5xl font-serif font-bold mb-4 text-center [&_p]:m-0" dangerouslySetInnerHTML={{ __html: s.contacto_titulo || 'Empecemos a hablar' }} />
              <div className="text-lg md:text-xl mb-2 opacity-80 text-center [&_p]:m-0" dangerouslySetInnerHTML={{ __html: s.contacto_subtitulo || 'Estoy aquí para acompañarte en tu proceso.' }} />

              {/* Datos directos */}
              {(s.contact_email || s.contact_phone) && (
                <address className="flex flex-col sm:flex-row gap-6 justify-center items-center flex-wrap mt-6 not-italic text-center">
                  {s.contact_email && (
                    <a href={`mailto:${s.contact_email}`} aria-label={`Enviar correo a ${s.contact_email}`} className="flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity hover:underline underline-offset-4 p-1">
                      <Mail size={14} aria-hidden="true" />{s.contact_email}
                    </a>
                  )}
                  {s.contact_email && s.contact_phone && <div aria-hidden="true" className="w-1.5 h-1.5 bg-white/20 rounded-full hidden sm:block" />}
                  {s.contact_phone && (
                    <a href={`tel:${s.contact_phone.replace(/\s/g, '')}`} aria-label={`Llamar al ${s.contact_phone}`} className="flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity p-1">
                      <Phone size={14} aria-hidden="true" />{s.contact_phone}
                    </a>
                  )}
                </address>
              )}

              {/* Formulario */}
              <ContactForm email={s.contact_email} />
            </div>
          </div>
        </ScrollReveal>
      </section>

      <footer className="py-12 border-t border-subtle text-sm text-muted">
        <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} {s.site_name || "Lic. Cecilia Lucero"}. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            {s.contact_email && (
              <a href={`mailto:${s.contact_email}`} className="hover:text-primary transition-colors">
                {s.contact_email}
              </a>
            )}
            {s.site_instagram && (
              <a href={s.site_instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Instagram
              </a>
            )}
            <a href="/#contacto" className="hover:text-primary transition-colors">Política de privacidad</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
