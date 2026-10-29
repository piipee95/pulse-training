# PULSE Train — Cloudflare Pages + Supabase (decisión 2026-10-29)

**Nueva arquitectura:** Cloudflare Pages sirve el frontend React/Vite; Supabase Auth gestiona cuentas y sesiones; PostgreSQL con RLS conserva perfiles y entrenamientos.

**Estado:** diseño y migración preparados, NO ejecutados ni desplegados. La creación de un proyecto Supabase separado requiere elegir organización y confirmar cualquier costo eventual. No reutilizar bases SIGMA/KultiApp.

## Criterios de aceptación
1. Proyecto PULSE independiente en Supabase (región preferida sa-east-1) y costo gratuito verificado.
2. Configurar origen web y redirect Auth al origen Cloudflare de PULSE; confirmar mecanismos de alta, recuperación y restricciones.
3. Aplicar `supabase/migrations/20261029_000001_pulse_private_data.sql` **solo al proyecto nuevo** y validar RLS: usuario A no puede leer/escribir B y anon no puede acceder.
4. Integrar `@supabase/supabase-js` con clave publishable (nunca service_role) y flujo de cuenta usable.
5. Prueba E2E en staging: alta, login, guardar sesión, logout, iniciar de nuevo, recuperar sesión e historial; probar dos usuarios y respaldo/restauración.
6. Migrar producción de `VITE_DEMO=1` solo después de pasar los gates, con copia de seguridad y rollback.
7. Importar rutina exacta únicamente en perfil privado, preservando rangos, opciones y fuentes de carga.
8. Archivar código de D1/Access antiguo sin eliminarlo hasta verificar el reemplazo.

**Privacidad:** ninguna rutina real, carga, contraseña, token, clave secreta o cuenta se agrega al repositorio.
