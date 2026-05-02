'use client';
import { useState } from 'react';
import { addCita, deleteCita } from './actions';
import { Trash2, Plus, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CitaManager({ initialCitas }) {
  const [citas, setCitas] = useState(initialCitas);
  const [newCita, setNewCita] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCita.trim()) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('texto', newCita);
    
    const res = await addCita(formData);
    if (res.success) {
      setNewCita('');
      // Refresh list (simplified)
      window.location.reload();
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que querés borrar esta tarjeta?')) return;
    
    const res = await deleteCita(id);
    if (res.success) {
      setCitas(citas.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Formulario */}
      <form onSubmit={handleAdd} className="bg-white/5 border border-white/5 rounded-2xl p-6">
        <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
          Nueva Tarjeta
        </label>
        <div className="flex gap-3">
          <textarea
            value={newCita}
            onChange={(e) => setNewCita(e.target.value)}
            placeholder="Escribí una frase inspiradora..."
            rows={2}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 transition-all resize-none"
          />
          <button
            type="submit"
            disabled={loading || !newCita.trim()}
            className="self-end p-4 bg-white text-[#13151c] rounded-xl hover:bg-white/90 transition-all active:scale-95 disabled:opacity-40"
          >
            <Plus size={20} />
          </button>
        </div>
      </form>

      {/* Lista */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence initial={false}>
          {citas.map((cita) => (
            <motion.div
              key={cita.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group flex items-start justify-between gap-4 bg-white/5 border border-white/5 rounded-2xl p-6 hover:bg-white/8 transition-all"
            >
              <div className="flex gap-4">
                <Quote size={20} className="text-white/20 mt-1 shrink-0" />
                <p className="text-white/80 leading-relaxed italic">{cita.texto}</p>
              </div>
              <button
                onClick={() => handleDelete(cita.id)}
                className="p-2 text-white/20 hover:text-red-400 transition-colors"
                title="Borrar"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {citas.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
            <p className="text-white/20 italic">No hay tarjetas cargadas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
