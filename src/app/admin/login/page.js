'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await signIn('credentials', { username, password, redirect: false });
      if (res?.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch {
      setError('Ocurrió un error. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
      <div className="w-full max-w-sm px-6">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-serif font-bold text-white mb-1">Cecilia Lucero</h1>
          <p className="text-white/30 text-sm">Panel de administración</p>
        </div>

        <div className="bg-white/5 border border-white/8 rounded-2xl p-8">
          {error && (
            <div role="alert" className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-5 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                Usuario
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 focus:bg-white/8 transition-all"
                placeholder="tu usuario"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-white/30 focus:bg-white/8 transition-all"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-[#0f1117] py-3 rounded-lg text-sm font-bold hover:bg-white/90 transition-all active:scale-[0.98] disabled:opacity-40 mt-2"
            >
              {loading ? 'Entrando...' : 'Entrar al panel'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-8">
          © {new Date().getFullYear()} Cecilia Lucero
        </p>
      </div>
    </div>
  );
}
