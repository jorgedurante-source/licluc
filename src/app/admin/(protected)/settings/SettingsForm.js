'use client';
import { useState } from 'react';
import { saveSettings } from './actions';
import { Check } from 'lucide-react';

const PRESETS = [
  { name: 'Clásico Profesional', primary: '#1a2b3c', secondary: '#ffffff',  font: 'Playfair',  desc: 'Serio y confiable' },
  { name: 'Calma Natural',       primary: '#2d5a4a', secondary: '#f2f7f4',  font: 'Cormorant', desc: 'Sereno y cercano' },
  { name: 'Calidez Humana',      primary: '#7a4f3a', secondary: '#fdf6f0',  font: 'Libre',     desc: 'Cálido y acogedor' },
  { name: 'Rosa Empático',       primary: '#8b5e6d', secondary: '#fdf6f8',  font: 'Elegant',   desc: 'Sensible y femenino' },
  { name: 'Lavanda Suave',       primary: '#5b4b8a', secondary: '#f8f5ff',  font: 'Cormorant', desc: 'Reflexivo y espiritual' },
  { name: 'Azul Clínico',        primary: '#1e3a5f', secondary: '#f4f7fb',  font: 'Modern',    desc: 'Técnico y moderno' },
  { name: 'Tierra Serena',       primary: '#5c4a3a', secondary: '#f5efe8',  font: 'Libre',     desc: 'Enraizado y firme' },
  { name: 'Minimalista Puro',    primary: '#2d2d2d', secondary: '#fafafa',  font: 'Clean',     desc: 'Limpio y contemporáneo' },
  { name: 'Noche Profunda',      primary: '#c9b99a', secondary: '#1a1a2e',  font: 'Elegant',   desc: 'Oscuro y sofisticado' },
  { name: 'Salvia y Piedra',     primary: '#4a6741', secondary: '#f0ece4',  font: 'Modern',    desc: 'Orgánico y equilibrado' },
];

const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder-white/20 outline-none focus:border-white/30 focus:bg-white/8 transition-all";
const labelClass = "block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5";
const sectionClass = "bg-white/5 border border-white/5 rounded-xl p-6";

export default function SettingsForm({ initialSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key) => (e) => setSettings({ ...settings, [key]: e.target.value });

  const applyPreset = (preset) => {
    setSettings({ ...settings, theme_primary: preset.primary, theme_secondary: preset.secondary, theme_font: preset.font });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await saveSettings(new FormData(e.target));
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white mb-1">Configuración</h1>
          <p className="text-white/40 text-sm">Personalización visual y textos del sitio.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-white text-[#13151c] rounded-lg hover:bg-white/90 transition-all disabled:opacity-40"
        >
          {saved ? <><Check size={14} /> Guardado</> : loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {/* Presets */}
      <div className={sectionClass}>
        <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Paletas de color</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {PRESETS.map((preset) => {
            const isActive = settings.theme_primary === preset.primary && settings.theme_secondary === preset.secondary;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`relative rounded-xl border transition-all text-left overflow-hidden ${
                  isActive ? 'border-white/40 ring-1 ring-white/20' : 'border-white/5 hover:border-white/15'
                }`}
              >
                {/* Color preview strip */}
                <div className="h-10 w-full" style={{ background: preset.secondary }}>
                  <div className="h-full w-1/3" style={{ background: preset.primary }} />
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-semibold text-white/70 leading-tight">{preset.name}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{preset.desc}</p>
                </div>
                {isActive && (
                  <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <Check size={9} className="text-[#13151c]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color manual + fuente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={sectionClass}>
          <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Colores personalizados</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="site_name" className={labelClass}>Nombre del sitio</label>
              <input id="site_name" name="site_name" value={settings.site_name || ''} onChange={set('site_name')} className={inputClass} />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label htmlFor="theme_primary" className={labelClass}>Color primario</label>
                <div className="flex items-center gap-2">
                  <input type="color" name="theme_primary" value={settings.theme_primary || '#1a2b3c'} onChange={set('theme_primary')} className="h-9 w-9 border-none cursor-pointer rounded bg-transparent" />
                  <input type="text" value={settings.theme_primary || '#1a2b3c'} onChange={set('theme_primary')} className={inputClass} />
                </div>
              </div>
              <div className="flex-1">
                <label htmlFor="theme_secondary" className={labelClass}>Color fondo</label>
                <div className="flex items-center gap-2">
                  <input type="color" name="theme_secondary" value={settings.theme_secondary || '#ffffff'} onChange={set('theme_secondary')} className="h-9 w-9 border-none cursor-pointer rounded bg-transparent" />
                  <input type="text" value={settings.theme_secondary || '#ffffff'} onChange={set('theme_secondary')} className={inputClass} />
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="theme_font" className={labelClass}>Tipografía</label>
              <select id="theme_font" name="theme_font" value={settings.theme_font || 'Playfair'} onChange={set('theme_font')} className={inputClass}>
                <option value="Playfair">Playfair + Lato — Clásico elegante</option>
                <option value="Cormorant">Cormorant + Nunito — Refinado suave</option>
                <option value="Libre">Libre Baskerville + Source Sans — Editorial</option>
                <option value="Modern">DM Serif + DM Sans — Moderno equilibrado</option>
                <option value="Elegant">EB Garamond + Jost — Atemporal</option>
                <option value="Clean">Plus Jakarta Sans — Sans minimalista</option>
              </select>
            </div>
          </div>
        </div>

        <div className={sectionClass}>
          <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Textos del hero</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="home_hero_title" className={labelClass}>Título principal</label>
              <input id="home_hero_title" name="home_hero_title" value={settings.home_hero_title || ''} onChange={set('home_hero_title')} className={inputClass} />
            </div>
            <div>
              <label htmlFor="home_hero_subtitle" className={labelClass}>Subtítulo</label>
              <textarea id="home_hero_subtitle" name="home_hero_subtitle" rows={3} value={settings.home_hero_subtitle || ''} onChange={set('home_hero_subtitle')} className={inputClass + " resize-none"} />
            </div>
            <div>
              <label htmlFor="hero_cita" className={labelClass}>Cita en la tarjeta</label>
              <input id="hero_cita" name="hero_cita" value={settings.hero_cita || ''} onChange={set('hero_cita')} className={inputClass} placeholder="La palabra tiene el poder de transformar..." />
            </div>
          </div>
        </div>
      </div>

      {/* Sobre Mí */}
      <div className={sectionClass}>
        <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Sobre Mí</h2>
        <div>
          <label htmlFor="sobre_mi_text" className={labelClass}>Texto de presentación</label>
          <textarea id="sobre_mi_text" name="sobre_mi_text" rows={4} value={settings.sobre_mi_text || ''} onChange={set('sobre_mi_text')} className={inputClass + " resize-none"} />
        </div>
      </div>

{/* Sección Contacto */}
      <div className={sectionClass}>
        <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Sección Contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contacto_titulo" className={labelClass}>Título</label>
            <input id="contacto_titulo" name="contacto_titulo" value={settings.contacto_titulo || ''} onChange={set('contacto_titulo')} className={inputClass} />
          </div>
          <div>
            <label htmlFor="contacto_subtitulo" className={labelClass}>Subtítulo</label>
            <input id="contacto_subtitulo" name="contacto_subtitulo" value={settings.contacto_subtitulo || ''} onChange={set('contacto_subtitulo')} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div className={sectionClass}>
        <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Información de contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact_email" className={labelClass}>Email</label>
            <input id="contact_email" name="contact_email" type="email" value={settings.contact_email || ''} onChange={set('contact_email')} className={inputClass} placeholder="tu@email.com" />
          </div>
          <div>
            <label htmlFor="contact_phone" className={labelClass}>Teléfono</label>
            <input id="contact_phone" name="contact_phone" type="tel" value={settings.contact_phone || ''} onChange={set('contact_phone')} className={inputClass} placeholder="+54 11 1234-5678" />
          </div>
        </div>
      </div>
    </form>
  );
}
