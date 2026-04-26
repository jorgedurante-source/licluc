@AGENTS.md

# LicLuc — Sitio Web Lic. Cecilia Lucero

Sitio profesional autogestionable para psicóloga. One-page pública + panel de administración protegido con blog y configuración de temas.

## Comandos

```bash
npm run dev          # Dev server en puerto 3078
npx prisma db push   # Sincronizar schema con dev.db
node src/scripts/seed.js  # Crear usuario admin y settings por defecto
npx prisma studio    # UI para inspeccionar la DB
```

## Credenciales de dev

- **Email:** `cecilia@lucero.com`
- **Password:** `admin123`
- **Admin URL:** `http://localhost:3078/admin/login`

Para resetear: correr `node src/scripts/seed.js` (usa upsert, no rompe datos existentes).

## Variables de entorno requeridas (`.env`)

```
PORT=3078
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL=http://localhost:3078
NEXTAUTH_SECRET=licluc_secret_dev_2026
```

Sin `NEXTAUTH_SECRET` el admin entra en redirect loop infinito.

## Arquitectura

```
src/app/
  page.js                        # Home pública (Server Component, lee Prisma)
  layout.js                      # Root layout — incluye StyleInjector y SessionProvider
  admin/
    (protected)/                 # Route group — layout con guard de sesión
      layout.js                  # Redirige a /admin/login si no hay sesión
      page.js                    # Dashboard /admin
      settings/                  # /admin/settings
      users/                     # /admin/users (solo superadmin)
    login/                       # Fuera del route group — sin guard
      page.js
  api/auth/[...nextauth]/        # Handler de NextAuth

src/lib/
  auth.js      # authOptions — callbacks de JWT/session para incluir role
  prisma.js    # Singleton de PrismaClient (evita conexiones múltiples en dev)

src/components/
  StyleInjector.js   # Server Component — inyecta CSS vars desde DB en cada request
  admin/Sidebar.js   # Muestra "Usuarios" solo si role === 'superadmin'

prisma/
  schema.prisma   # Modelos: User (con role), Post, Setting
  dev.db          # SQLite — en raíz del proyecto (no en backend/data/)
```

## Roles de usuario

| Rol | Acceso |
|-----|--------|
| `superadmin` | Todo el admin + gestión de usuarios |
| `editor` | Dashboard, blog, settings — sin /admin/users |

## Gotchas

- `StyleInjector` hace una query a Prisma en el **root layout** — se ejecuta en cada request. Si la DB no existe o el seed no corrió, el sitio entero falla.
- El route group `(protected)` es lo que evita el redirect loop: `admin/login` queda fuera del layout protegido. No mover `login/` dentro de `(protected)/`.
- `prisma db push` puede fallar con EPERM si Next.js está corriendo (tiene el DLL bloqueado). Detener el server primero.
- El `.env` de Prisma advierte que no carga automático — en Next.js sí carga porque Next.js procesa `.env` antes de arrancar. No agregar `dotenv/config` en el código del server.
