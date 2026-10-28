# Cuentas privadas y backend gratuito — evaluación, no despliegue

Fecha: 2026-10-28. La web oficial continúa en Cloudflare Pages con `VITE_DEMO=1`. Esa compilación no autentica cuentas. No se han creado cuentas de producción, guardado contraseñas en el repositorio ni habilitado registro público.

## Alternativas

| Opción | Compatibilidad con openGym | Coste y límites | Decisión |
| --- | --- | --- | --- |
| Mantener API Node existente en un equipo/servidor ya disponible, mediante Cloudflare Tunnel | Alta: conserva sesiones, passkeys, contraseñas scrypt, administración, sincronización, archivos y medios | Software gratuito; equipo, energía, conectividad y dominio pueden tener coste. Requiere disponibilidad y copias de seguridad | Menor cambio y recomendada si existe servidor permanente |
| Pages + Workers + D1 | Requiere adaptar persistencia, sesiones, medios, auditoría y operaciones de administración; no basta copiar server.js | D1 Free: 5 millones de filas leídas/día, 100.000 escritas/día y 5 GB totales según documentación consultada. Workers tiene límites propios | Alternativa para no depender de un PC; requiere fase de compatibilidad antes de aprobar |

La API actual usa `node:fs`, escrituras durables y `db.json`. Workers ofrece sistema de archivos virtual temporal, no persistencia equivalente. Su hash scrypt también debe evaluarse frente a los límites de CPU de Workers Free; no debilitar el hash para encajarlo en el plan gratuito. Medios, streaming, backups y Coach requieren evaluación adicional. No prometer una migración completa sin esa prueba.

## Alta cerrada prevista

- Preparar un administrador y una cuenta personal separados, con privilegio mínimo.
- Cerrar registro público desde el inicio; no confiar en que el primer visitante será el propietario.
- Reutilizar la política de contraseñas y límites de intentos existentes. No guardar contraseñas iniciales en código, variables VITE, Issues, PR, documentación o demo.
- El nombre de las cuentas y sus datos reales pertenecen a la configuración privada, no a esta especificación.
- Verificar acceso normal/administrador, denegación entre perfiles, cierre de sesión, recuperación, respaldo y restauración antes de usar datos reales.
- Mantener Pages como único origen visible; estudiar enrutamiento `/api` y cookies del mismo origen antes de cambiar `VITE_DEMO`. No abrir una segunda app pública.

## Estado operativo

Se encontró cf CLI 0.15.0, sin sesión autenticada. No se verificó la configuración remota de Pages, variables ni despliegues desde esta herramienta. La web oficial y la conexión a main se mantienen como requisitos del usuario hasta obtener evidencia remota. La CLI instalada no ofrece `cf cli search`; consultar `cf pages --help` y los subcomandos disponibles en esa versión.

## Fuentes primarias consultadas

- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/workers/runtime-apis/nodejs/fs/
- https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/

Las cuotas pueden cambiar. Volver a comprobarlas antes de desplegar.
