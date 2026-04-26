'use client';
import { useState, useTransition } from 'react';
import { Plus, X, Trash2, Check, Pencil } from 'lucide-react';
import { createEspecialidad, updateEspecialidad, deleteEspecialidad } from './actions';

// Íconos disponibles con sus labels
const ICONOS = [
  { key: 'Heart',         label: 'Corazón' },
  { key: 'MessageCircle', label: 'Diálogo' },
  { key: 'BookOpen',      label: 'Libro' },
  { key: 'Brain',         label: 'Mente' },
  { key: 'Leaf',          label: 'Hoja' },
  { key: 'Sun',           label: 'Sol' },
  { key: 'Moon',          label: 'Luna' },
  { key: 'Star',          label: 'Estrella' },
  { key: 'Compass',       label: 'Brújula' },
  { key: 'Anchor',        label: 'Ancla' },
  { key: 'Feather',       label: 'Pluma' },
  { key: 'Wind',          label: 'Viento' },
  { key: 'Waves',         label: 'Olas' },
  { key: 'Mountain',      label: 'Montaña' },
  { key: 'Flame',         label: 'Llama' },
  { key: 'Sparkles',      label: 'Destellos' },
  { key: 'HandHeart',     label: 'Mano-corazón' },
  { key: 'Users',         label: 'Personas' },
  { key: 'Shield',        label: 'Escudo' },
  { key: 'Lightbulb',     label: 'Idea' },
];

const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder-white/20 outline-none focus:border-white/30 transition-all";
const labelClass = "block text-xs text-white/40 mb-1.5";

function IconSelector({ value, onChange }) {
  return (
    <div>
      <label className={labelClass}>Ícono</label>
      <div className="grid grid-cols-5 gap-1.5">
        {ICONOS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            title={label}
            onClick={() => onChange(key)}
            className={`py-2 rounded-lg border text-xs font-medium transition-all ${
              value === key
                ? 'border-white/40 bg-white/15 text-white'
                : 'border-white/5 bg-white/3 text-white/40 hover:bg-white/8 hover:text-white/70'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function EspecialidadForm({ inicial, onSubmit, onCancel, submitLabel }) {
  const [titulo, setTitulo] = useState(inicial?.titulo || '');
  const [desc, setDesc] = useState(inicial?.desc || '');
  const [icono, setIcono] = useState(inicial?.icono || 'Heart');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const fd = new FormData();
    fd.set('titulo', titulo);
    fd.set('desc', desc);
    fd.set('icono', icono);
    startTransition(async () => {
      const result = await onSubmit(fd);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-5">
      {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Título</label>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} required className={inputClass} placeholder="Ansiedad y Estrés" />
        </div>
        <div>
          <label className={labelClass}>Descripción</label>
          <input value={desc} onChange={e => setDesc(e.target.value)} className={inputClass} placeholder="Breve descripción..." />
        </div>
      </div>
      <IconSelector value={icono} onChange={setIcono} />
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white text-[#13151c] rounded-lg hover:bg-white/90 transition-all disabled:opacity-40">
          <Check size={13} /> {isPending ? 'Guardando...' : submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-white/40 hover:text-white/70 transition-colors">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

export default function EspecialidadesClient({ especialidades: inicial }) {
  const [items, setItems] = useState(inicial);
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleCreate = async (fd) => {
    const result = await createEspecialidad(fd);
    if (!result?.error) setShowNew(false);
    return result;
  };

  const handleUpdate = (id) => async (fd) => {
    const result = await updateEspecialidad(id, fd);
    if (!result?.error) setEditingId(null);
    return result;
  };

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar esta especialidad?')) return;
    startTransition(() => deleteEspecialidad(id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white mb-1">Especialidades</h1>
          <p className="text-white/40 text-sm">{items.length} área{items.length !== 1 ? 's' : ''} configurada{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setShowNew(!showNew); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white text-[#13151c] rounded-lg hover:bg-white/90 transition-all"
        >
          {showNew ? <X size={14} /> : <Plus size={14} />}
          {showNew ? 'Cancelar' : 'Nueva especialidad'}
        </button>
      </div>

      {showNew && (
        <div className="mb-6">
          <EspecialidadForm onSubmit={handleCreate} onCancel={() => setShowNew(false)} submitLabel="Crear especialidad" />
        </div>
      )}

      {items.length === 0 && !showNew && (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-2xl text-white/30 text-sm">
          No hay especialidades. Agregá la primera.
        </div>
      )}

      <div className="space-y-3">
        {items.map((esp) => (
          <div key={esp.id}>
            {editingId === esp.id ? (
              <EspecialidadForm
                inicial={esp}
                onSubmit={handleUpdate(esp.id)}
                onCancel={() => setEditingId(null)}
                submitLabel="Guardar cambios"
              />
            ) : (
              <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-xl px-5 py-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white/50 shrink-0">
                  {esp.icono.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/80">{esp.titulo}</p>
                  <p className="text-xs text-white/30 truncate">{esp.desc}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => { setEditingId(esp.id); setShowNew(false); }} className="p-2 text-white/30 hover:text-white/70 rounded-lg hover:bg-white/5 transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(esp.id)} disabled={isPending} className="p-2 text-white/30 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors disabled:opacity-40">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
