'use client';
import { useState, useTransition } from 'react';
import { Trash2, Plus, X, Check, Pencil } from 'lucide-react';
import { createUser, deleteUser, changeUserRole, updateUser } from './actions';

const ROLE_LABELS = {
  superadmin: { label: 'Super Admin', color: 'text-amber-400 bg-amber-400/10' },
  editor:     { label: 'Editor',      color: 'text-blue-400 bg-blue-400/10' },
};

const inputClass = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder-white/20 outline-none focus:border-white/30 transition-all";

export default function UsersClient({ users, currentUserId }) {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formError, setFormError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const formData = new FormData(e.target);
    
    startTransition(async () => {
      let result;
      if (editingUser) {
        result = await updateUser(editingUser.id, formData);
      } else {
        result = await createUser(formData);
      }

      if (result?.error) {
        setFormError(result.error);
      } else {
        setShowForm(false);
        setEditingUser(null);
        e.target.reset();
      }
    });
  };

  const startEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
    setFormError('');
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormError('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white mb-1">Usuarios</h1>
          <p className="text-white/40 text-sm">{users.length} usuario{users.length !== 1 ? 's' : ''} registrado{users.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => (showForm ? cancelForm() : setShowForm(true))}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white text-[#13151c] rounded-lg hover:bg-white/90 transition-all"
        >
          {showForm ? <X size={14} /> : <Plus size={14} />}
          {showForm ? 'Cancelar' : 'Nuevo usuario'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/5 rounded-xl p-6 mb-6 space-y-4">
          <h2 className="text-sm font-bold text-white/60 uppercase tracking-wider">
            {editingUser ? 'Editar usuario' : 'Crear usuario'}
          </h2>
          {formError && <p role="alert" className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">{formError}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Nombre</label>
              <input name="name" defaultValue={editingUser?.name || ''} className={inputClass} placeholder="Nombre completo" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Usuario</label>
              <input name="username" defaultValue={editingUser?.username || ''} required className={inputClass} placeholder="nombre_usuario" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">
                {editingUser ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
              </label>
              <input name="password" type="password" required={!editingUser} minLength={6} className={inputClass} placeholder={editingUser ? 'Dejar en blanco para no cambiar' : 'Mín. 6 caracteres'} />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Rol</label>
              <select name="role" defaultValue={editingUser?.role || 'editor'} className={inputClass}>
                <option value="editor">Editor</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-white text-[#13151c] rounded-lg hover:bg-white/90 transition-all disabled:opacity-40">
              <Check size={14} />
              {isPending ? (editingUser ? 'Guardando...' : 'Creando...') : (editingUser ? 'Guardar cambios' : 'Crear usuario')}
            </button>
            <button type="button" onClick={cancelForm} className="px-4 py-2 text-sm font-bold text-white/40 hover:text-white transition-all">
              Descartar
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {users.map(user => {
          const role = ROLE_LABELS[user.role] || { label: user.role, color: 'text-white/40 bg-white/5' };
          return (
            <div key={user.id} className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-xl px-5 py-4 hover:bg-white/8 transition-all group">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/60 shrink-0">
                {(user.name || user.username)[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/80">{user.name || user.username}</p>
                <p className="text-xs text-white/30">@{user.username}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${role.color}`}>{role.label}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(user)}
                    disabled={isPending}
                    className="p-2 text-white/20 hover:text-white transition-colors disabled:opacity-40 rounded-lg hover:bg-white/5"
                    title="Editar"
                  >
                    <Pencil size={14} />
                  </button>
                  {user.id !== currentUserId && (
                    <button
                      onClick={() => { if (!confirm('¿Eliminar este usuario?')) return; startTransition(() => deleteUser(user.id)); }}
                      disabled={isPending}
                      className="p-2 text-white/20 hover:text-red-400 transition-colors disabled:opacity-40 rounded-lg hover:bg-white/5"
                      title="Borrar"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
