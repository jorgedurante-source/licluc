'use client';
import { useState } from 'react';
import { saveSettings } from './actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, FileText, Phone, Check, Quote, Plus, Trash2, Pencil, X } from 'lucide-react';
import { addCita, deleteCita, updateCita } from '../citas/actions';

const TABS = [
  { id: 'diseno',   label: 'Diseño',    icon: Palette },
  { id: 'contenido', label: 'Contenido', icon: FileText },
  { id: 'contacto',  label: 'Contacto',  icon: Phone },
  { id: 'tarjetas',  label: 'Tarjetas',  icon: Quote },
];

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

export default function SettingsForm({ initialSettings, initialCitas }) {
  const [activeTab, setActiveTab] = useState('diseno');
  const [settings, setSettings] = useState(initialSettings);
  const [citas, setCitas] = useState(initialCitas);
  
  // Create Card States
  const [newCita, setNewCita] = useState('');
  const [newCitaImage, setNewCitaImage] = useState('');
  
  // Edit Card States
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingImage, setEditingImage] = useState('');

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key) => (e) => setSettings({ ...settings, [key]: e.target.value });

  const applyPreset = (preset) => {
    setSettings({ ...settings, theme_primary: preset.primary, theme_secondary: preset.secondary, theme_font: preset.font });
  };

  const handleAddCita = async (e) => {
    e.preventDefault();
    if (!newCita.trim()) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('texto', newCita);
    formData.append('imagen', newCitaImage || '');
    const res = await addCita(formData);
    if (res.success) {
      setNewCita('');
      setNewCitaImage('');
      window.location.reload();
    }
    setLoading(false);
  };

  const handleDeleteCita = async (id) => {
    if (!confirm('¿Seguro que querés borrar esta tarjeta?')) return;
    const res = await deleteCita(id);
    if (res.success) {
      setCitas(citas.filter(c => c.id !== id));
    }
  };

  const handleUpdateCita = async (id, text, image) => {
    if (!text.trim()) return;
    setLoading(true);
    const res = await updateCita(id, text, image);
    if (res.success) {
      setCitas(citas.map(c => c.id === id ? { ...c, texto: text, imagen: image } : c));
      setEditingId(null);
      setEditingImage('');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === 'tarjetas') return;
    setLoading(true);
    const formData = new FormData(e.target);
    Object.entries(settings).forEach(([key, value]) => {
      if (!formData.has(key)) formData.append(key, value);
    });
    
    const res = await saveSettings(formData);
    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white mb-1">Configuración</h1>
          <p className="text-white/40 text-sm">Personalización visual y textos del sitio.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-white text-[#13151c] rounded-xl hover:bg-white/90 transition-all shadow-xl active:scale-95 disabled:opacity-40 w-full sm:w-auto justify-center ${activeTab === 'tarjetas' ? 'hidden' : ''}`}
        >
          {saved ? <><Check size={14} /> Guardado</> : loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {/* Tabs Navigation */}
      <div role="tablist" aria-label="Opciones de configuración" className="flex p-1 bg-white/5 border border-white/5 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            id={`tab-${id}`}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`panel-${id}`}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all relative min-w-max px-6 ${
              activeTab === id ? 'text-white' : 'text-white/40 hover:text-white/60'
            }`}
          >
            {activeTab === id && (
              <motion.div layoutId="activeTab" className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
            )}
            <Icon size={16} />
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'diseno' && (
            <div className="space-y-6">
              <div className={sectionClass}>
                <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-6">Paletas de color</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {PRESETS.map((preset) => {
                    const isActive = settings.theme_primary === preset.primary && settings.theme_secondary === preset.secondary;
                    return (
                      <button key={preset.name} type="button" onClick={() => applyPreset(preset)} className={`relative rounded-xl border transition-all text-left overflow-hidden ${isActive ? 'border-white/40 ring-1 ring-white/20 scale-[1.02]' : 'border-white/5 hover:border-white/15'}`}>
                        <div className="h-10 w-full" style={{ background: preset.secondary }}><div className="h-full w-1/3" style={{ background: preset.primary }} /></div>
                        <div className="p-3">
                          <p className="text-[11px] font-bold text-white/80 leading-tight">{preset.name}</p>
                          <p className="text-[10px] text-white/30 mt-0.5">{preset.desc}</p>
                        </div>
                        {isActive && <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-white rounded-full flex items-center justify-center"><Check size={9} className="text-[#13151c]" /></div>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={sectionClass}>
                  <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Colores personalizados</h2>
                  <div className="space-y-4">
                    <div><label htmlFor="site_name" className={labelClass}>Nombre del sitio</label><input id="site_name" name="site_name" value={settings.site_name || ''} onChange={set('site_name')} className={inputClass} /></div>
                    <div className="flex gap-3">
                      <div className="flex-1"><label className={labelClass}>Primario</label><div className="flex items-center gap-2"><input type="color" value={settings.theme_primary || '#1a2b3c'} onChange={set('theme_primary')} className="h-10 w-10 border-none cursor-pointer rounded-lg bg-transparent" /><input type="text" name="theme_primary" value={settings.theme_primary || '#1a2b3c'} onChange={set('theme_primary')} className={inputClass} /></div></div>
                      <div className="flex-1"><label className={labelClass}>Fondo</label><div className="flex items-center gap-2"><input type="color" value={settings.theme_secondary || '#ffffff'} onChange={set('theme_secondary')} className="h-10 w-10 border-none cursor-pointer rounded-lg bg-transparent" /><input type="text" name="theme_secondary" value={settings.theme_secondary || '#ffffff'} onChange={set('theme_secondary')} className={inputClass} /></div></div>
                    </div>
                    <div>
                      <label htmlFor="theme_font" className={labelClass}>Tipografía</label>
                      <select 
                        id="theme_font" 
                        name="theme_font" 
                        value={settings.theme_font || 'Playfair'} 
                        onChange={set('theme_font')} 
                        className={inputClass + " [&>option]:text-black [&>option]:bg-white"}
                      >
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
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-8 flex flex-col justify-center items-center text-center">
                   <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4"><Palette className="text-primary" size={32} /></div>
                   <h3 className="text-white font-serif font-bold text-xl mb-2">Vista Previa</h3>
                   <p className="text-white/40 text-sm">Los cambios se verán aplicados en todo el sitio.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contenido' && (
            <div className="space-y-6">
              <div className={sectionClass}>
                <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-6">Textos del Hero</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div><label className={labelClass}>Título principal</label><input name="home_hero_title" value={settings.home_hero_title || ''} onChange={set('home_hero_title')} className={inputClass} /></div>
                    <div><label className={labelClass}>Cita por defecto</label><input name="hero_cita" value={settings.hero_cita || ''} onChange={set('hero_cita')} className={inputClass} /></div>
                  </div>
                  <div><label className={labelClass}>Subtítulo</label><textarea name="home_hero_subtitle" rows={5} value={settings.home_hero_subtitle || ''} onChange={set('home_hero_subtitle')} className={inputClass + " resize-none"} /></div>
                </div>
              </div>
              <div className={sectionClass}>
                <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Sobre Mí</h2>
                <textarea name="sobre_mi_text" rows={6} value={settings.sobre_mi_text || ''} onChange={set('sobre_mi_text')} className={inputClass + " resize-none"} />
              </div>
            </div>
          )}

          {activeTab === 'contacto' && (
            <div className="space-y-6">
              <div className={sectionClass}>
                <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-6">Sección de Contacto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={labelClass}>Título</label><input name="contacto_titulo" value={settings.contacto_titulo || ''} onChange={set('contacto_titulo')} className={inputClass} /></div>
                  <div><label className={labelClass}>Subtítulo</label><input name="contacto_subtitulo" value={settings.contacto_subtitulo || ''} onChange={set('contacto_subtitulo')} className={inputClass} /></div>
                </div>
              </div>
              <div className={sectionClass}>
                <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-6">Información Directa</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={labelClass}>Email profesional</label><input name="contact_email" type="email" value={settings.contact_email || ''} onChange={set('contact_email')} className={inputClass} /></div>
                  <div><label className={labelClass}>Teléfono / WhatsApp</label><input name="contact_phone" type="tel" value={settings.contact_phone || ''} onChange={set('contact_phone')} className={inputClass} /></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tarjetas' && (
            <div className="space-y-6">
              <div className={sectionClass}>
                <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-6">Añadir nueva tarjeta</h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <textarea value={newCita} onChange={(e) => setNewCita(e.target.value)} placeholder="Frase inspiradora..." className={inputClass + " min-h-[100px] resize-none"} />
                  </div>
                  <div className="w-full md:w-32 shrink-0">
                    <div className="relative aspect-square rounded-xl bg-white/5 border border-white/10 overflow-hidden flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-white/10 transition-all">
                      {newCitaImage ? (
                        <>
                          <img src={newCitaImage} className="w-full h-full object-cover" />
                          <button type="button" onClick={(e) => { e.stopPropagation(); setNewCitaImage(''); }} className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                        </>
                      ) : (
                        <>
                          <Plus className="text-white/20" />
                          <span className="text-[10px] text-white/40 font-bold">IMAGEN</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setNewCitaImage(reader.result);
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </div>
                  </div>
                </div>
                <button type="button" onClick={handleAddCita} disabled={loading || !newCita.trim()} className="mt-4 flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-white text-[#13151c] rounded-xl hover:bg-white/90 transition-all disabled:opacity-40"><Plus size={14} /> Añadir Tarjeta</button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {citas.map((cita) => (
                  <div key={cita.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:bg-white/8 transition-all">
                    <div className="flex flex-col md:flex-row">
                      {/* Image Area */}
                      <div className="w-full md:w-48 aspect-video md:aspect-square bg-white/5 border-b md:border-b-0 md:border-r border-white/10 relative shrink-0">
                        {editingId === cita.id ? (
                          <div className="w-full h-full relative flex flex-col items-center justify-center group/edit cursor-pointer bg-white/10">
                            {editingImage || cita.imagen ? (
                              <>
                                <img src={editingImage === 'REMOVE' ? null : (editingImage || cita.imagen)} className="w-full h-full object-cover opacity-50" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                  <Pencil size={20} className="text-white" />
                                  <span className="text-[10px] font-bold text-white uppercase bg-black/40 px-2 py-1 rounded">Cambiar Foto</span>
                                </div>
                                <button type="button" onClick={(e) => { e.stopPropagation(); setEditingImage('REMOVE'); }} className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white z-20"><X size={12} /></button>
                              </>
                            ) : (
                              <div className="flex flex-col items-center gap-2">
                                <Plus className="text-white/40" />
                                <span className="text-[10px] font-bold text-white/40 uppercase">Subir Foto</span>
                              </div>
                            )}
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setEditingImage(reader.result);
                                reader.readAsDataURL(file);
                              }
                            }} />
                          </div>
                        ) : (
                          cita.imagen ? (
                            <img src={cita.imagen} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center opacity-10 gap-2">
                              <Quote size={32} />
                              <span className="text-[10px] font-bold uppercase tracking-widest">Sin imagen</span>
                            </div>
                          )
                        )}
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        {editingId === cita.id ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2">Frase inspiradora</label>
                              <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} className={inputClass + " w-full min-h-[100px] resize-none"} autoFocus />
                            </div>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => handleUpdateCita(cita.id, editingText, editingImage === 'REMOVE' ? null : (editingImage || cita.imagen))} className="px-5 py-2 bg-white text-[#13151c] text-xs font-bold rounded-xl hover:bg-white/90 transition-all">Guardar</button>
                              <button type="button" onClick={() => { setEditingId(null); setEditingImage(''); }} className="px-5 py-2 text-white/40 hover:text-white text-xs font-bold transition-all">Cancelar</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="relative">
                              <Quote size={24} className="text-white/5 absolute -top-4 -left-4" />
                              <p className="text-white/80 text-lg italic leading-relaxed relative z-10">"{cita.texto}"</p>
                            </div>
                            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button type="button" onClick={() => { setEditingId(cita.id); setEditingText(cita.texto); setEditingImage(''); }} className="flex items-center gap-2 px-3 py-1.5 text-white/40 hover:text-white text-xs font-bold transition-colors bg-white/5 rounded-lg hover:bg-white/10">
                                <Pencil size={12} /> Editar Tarjeta
                              </button>
                              <button type="button" onClick={() => handleDeleteCita(cita.id)} className="flex items-center gap-2 px-3 py-1.5 text-white/20 hover:text-red-400 text-xs font-bold transition-colors">
                                <Trash2 size={12} /> Borrar
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </form>
  );
}
