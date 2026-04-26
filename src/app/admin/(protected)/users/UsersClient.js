'use client';
import { useState, useTransition } from 'react';
import { Trash2, Plus, X, Check } from 'lucide-react';
import { createUser, deleteUser, changeUserRole } from './actions';

const ROLE_LABELS = {
  superadmin: { label: 'Super Admin', color: 'text-amber-400 bg-amber-400/10' },
  editor:     { label: 'Editor',      color: 'text-blue-400 bg-blue-400/10' },
};

const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder-white/20 outline-none focus:border-white/30 transition-all";

export default function UsersClient({ users, currentUserId }) {
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    const formData = new FormData(e.target);
    startTransition(async () => {
      const result = await createUser(formData);
      if (result?.error) setFormError(result.error);
      else { setShowForm(false); e.target.reset(); }
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white mb-1">Usuarios</h1>
          <p className="text-white/40 text-sm">{users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white text-[#13151c] rounded-lg hover:bg-white/90 transition-all"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancelar' : 'Nuevo usuario'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white/5 border border-white/5 rounded-xl p-6 mb-6 space-y-4">
          <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider">Crear usuario</h2>
          {formError && <p role="alert" className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">{formError}</p>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Nombre</label>
              <input name="name" className={inputClass} placeholder="Nombre completo" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Usuario</label>
              <input name="username" required className={inputClass} placeholder="nombre_usuario" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Contraseña</label>
              <input name="password" type="password" required minLength={6} className={inputClass} placeholder="Mín. 6 caracteres" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Rol</label>
              <select name="role" className={inputClass}>
                <option value="editor">Editor</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white text-[#13151c] rounded-lg hover:bg-white/90 transition-all disabled:opacity-40">
            <Check size={14} />
            {isPending ? 'Creando...' : 'Crear usuario'}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {users.map(user => {
          const role = ROLE_LABELS[user.role] || { label: user.role, color: 'text-white/40 bg-white/5' };
          return (
            <div key={user.id} className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-xl px-5 py-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60 shrink-0">
                {(user.name || user.username)[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/80">{user.name || user.username}</p>
                <p className="text-xs text-white/30">@{user.username}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${role.color}`}>{role.label}</span>
                {user.id !== currentUserId && (
                  <>
                    <select
                      defaultValue={user.role}
                      onChange={(e) => startTransition(() => changeUserRole(user.id, e.target.value))}
                      disabled={isPending}
                      className="text-xs bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white/50 outline-none focus:border-white/20 transition-all"
                    >
                      <option value="editor">Editor</option>
                      <option value="superadmin">Super Admin</option>
                    </select>
                    <button
                      onClick={() => { if (!confirm('¿Eliminar este usuario?')) return; startTransition(() => deleteUser(user.id)); }}
                      disabled={isPending}
                      className="p-1.5 text-white/20 hover:text-red-400 transition-colors disabled:opacity-40 rounded-lg hover:bg-white/5"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
