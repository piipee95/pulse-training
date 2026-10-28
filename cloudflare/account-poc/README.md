# PULSE — prueba aislada Workers + D1 (fundación)

**Estado:** prototipo de estructura, no desplegado ni integrado. No crea cuentas.

## Alcance
- Esquema SQL inicial: cuentas, credenciales, sesiones y perfiles, con claves foráneas y tabla de estados.
- Worker de salud: `GET /health`, responde solamente `ok` o `unavailable`. Cualquier otra ruta responde 404; no hay registro ni login.
- Configuración de ejemplo sin identificadores de recursos ni secretos reales.

## Validación y gate
1. Crear **D1 staging**, nunca producción, y configurar Wrangler localmente fuera del repositorio.
2. Ejecutar migración local/staging y probar integridad referencial, persistencia entre reinicios, lecturas y escritura cruzada denegada.
3. Diseñar hashing compatible con Worker Free sin reducir seguridad; instrumentar límites por cuenta/IP, sesiones revocables, cookies Secure HttpOnly SameSite y CSRF.
4. Implementar registro cerrado con bootstrap administrativo privado, recovery, WebAuthn o método de contraseña validado.
5. Demostrar tests E2E de dos cuentas, backup/restauración y rollback.
6. Solo entonces revisar integración con la API de openGym y el cambio de `VITE_DEMO=1` en Pages.

No almacenar datos personales ni credenciales en GitHub y no declarar cuenta operativa antes de comprobar un despliegue de staging.
