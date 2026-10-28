# PULSE Train — transición a cuentas privadas (decisión 2026-10-28)

**Prioridad del producto:** aplicación personal real; la demo pública ya no es el destino del proyecto. La rutina maestra Upper A / Lower A / Upper B / Lower B manda sobre recomendaciones o plantillas.

## Estado comprobado
- Pages `pulse-train` publica `main`, con `VITE_DEMO=1` en el entorno productivo al momento de la auditoría.
- El código heredado incluye `Login.jsx`, `PasswordAuth.jsx`, cliente API y backend Node, pero **no se verificó un servicio de autenticación productivo**, ni una cuenta personal creada.
- La importación privada existente es local y restringida; no sirve como alta de cuenta web.

## Gate de transición — no alterar producción antes de aprobarlo
1. Evaluar qué rutas/contratos Node son indispensables: registro cerrado, login, logout, sesiones, lectura/escritura del perfil, recuperación, medios y exportación.
2. Prototipo aislado sin cuentas reales para comparar compatibilidad y recursos de Workers+D1 frente a Node persistente. No portar la API con sustitución superficial de `node:fs`; evaluar contraseña scrypt, CPU, cookies, CSRF, WebAuthn y estrategias de migración.
3. Entorno de staging con configuración secreta (no `VITE_*`) y ruta de autenticación en el mismo origen o topología revisada, con HTTPS y cookies seguras. Proteger bootstrap y cerrar registro público.
4. Validar dos perfiles separados: rechazo de acceso cruzado y edición cruzada; rate limiting, logout, persistencia y recuperación. Añadir tests E2E y respaldos restaurables.
5. Validar costes y límites actuales del plan gratuito, controles de despliegue, datos, backups y rollback. Auditoría independiente antes de habilitar.
6. Migrar producción del modo demo al modo cuenta solo después de aceptación del gate; cuenta del titular se crea mediante flujo propio, sin compartir credenciales por chat.
7. Importar rutina exacta solo en la cuenta validada, preservando rangos de series/reps, alternativas y registros reales sin sembrar sets falsos.

## Reglas de seguridad
- No incluir rutina real, cargas, identificadores de usuario, secretos ni contraseñas en commits, Issues, demos o CI.
- No declarar cuenta creada ni backend habilitado antes de comprobarlo.
- Conservar la demo como plan de retroceso durante transición, no como producto principal.
- No fusionar trabajo en progreso no aprobado ni retirar verificaciones para acelerar el cambio.

Seguimiento: #19 (cuentas) y #16 (rutina). PR #18, de selección de equipamiento, es independiente.
