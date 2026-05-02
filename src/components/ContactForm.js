'use client';
import { useState } from 'react';
import { Send, Check } from 'lucide-react';

export default function ContactForm({ email }) {
  const [fields, setFields] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const set = (key) => (e) => setFields({ ...fields, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fields.name || !fields.email || !fields.message) return;
    const subject = encodeURIComponent(`Consulta de ${fields.name}`);
    const body = encodeURIComponent(`Nombre: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}`);
    window.location.href = `mailto:${email || ''}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const inputClass = "w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none focus:border-white/50 focus:bg-white/15 transition-all text-sm";

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-4 text-left" aria-label="Formulario de contacto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-1.5">Nombre</label>
          <input
            id="contact-name"
            type="text"
            required
            placeholder="Tu nombre"
            value={fields.name}
            onChange={set('name')}
            className={inputClass}
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-1.5">Tu email</label>
          <input
            id="contact-email"
            type="email"
            required
            placeholder="tu@email.com"
            value={fields.email}
            onChange={set('email')}
            className={inputClass}
            autoComplete="email"
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-wider text-white/50 mb-1.5">Mensaje</label>
        <textarea
          id="contact-message"
          required
          rows={4}
          placeholder="Contame brevemente qué te trae por aquí..."
          value={fields.message}
          onChange={set('message')}
          className={inputClass + " resize-none"}
        />
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-white font-bold rounded-xl transition-all hover:bg-white/90 active:scale-95 text-sm"
        style={{ color: 'var(--primary-color)' }}
      >
        {sent ? <><Check size={16} /> Abriendo tu cliente de mail...</> : <><Send size={16} /> Enviar mensaje</>}
      </button>
    </form>
  );
}
