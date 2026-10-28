# PULSE Train V1.1 — Entrega coherente, web primero

**Estado:** especificación de implementación, no funcionalidad completada. **Fecha:** 2026-10-28.

## Objetivo de la entrega
Una única rama, un único PR y una única web pública de demostración, con identidad PULSE completa y un mecanismo **privado** y verificable para incorporar el plan del propietario sin publicar su historial.

## Identidad / PWA
- Nombre aprobado: PULSE Train. Carbón #11151B, Volt #B8F255.
- Los SVG `pulse-icon.svg` y `pulse-logo.svg` ya están en main; no cambiar sus trazos sin una revisión de diseño.
- Completar íconos PNG transparentes de 180/192/512 px y variante maskable a partir del SVG oficial, comprobar safe area y referencia en `manifest.json` y Apple touch.
- Retirar referencias gráficas residuales al icono original solamente después de verificar los PNG nuevos en dispositivos.
- Probar instalación PWA, cache, tema claro y oscuro, nombre visible e iconos 16/32/180/192/512.
- Mantener atribuciones legales del proyecto derivado de openGym en documentos de licencia.

## Rutina privada — requisitos, no datos personales
- La planificación vigente debe recuperarse de la fuente autorizada y mantenerse en almacenamiento privado del usuario.
- No publicar nombres personales, registros, cargas, historial, notas ni datos de salud en GitHub, Issues, demostraciones o archivos del catálogo.
- Permitir equipamiento habitual de un gimnasio comercial, sin establecer limitaciones artificiales.
- Cualquier discrepancia entre versiones históricas debe resolverse fuera del repositorio público, antes de la importación.
- No guardar una plantilla global basada en datos de una sola persona.

### Importación segura
- Nunca modificar `demoSeed.js` ni exponer datos personales en la demo pública.
- Crear una importación explícita a perfil autenticado o exclusivamente local del propietario, con copia de respaldo previa y vista previa de lo que se añadirá.
- Validar identificadores de ejercicios con catálogo existente; explicar sustituciones y conservar unidades.
- Importación idempotente (evitar duplicar rutina al repetir operación), no escribir entrenamientos inexistentes.
- Mantener aislados pesos reales, historial, salud y notas personales.
- Añadir pruebas de guardado y reanudación y de aislamiento de cuentas antes del despliegue multiusuario.

## Reglas de aceptación
- Build web + tests del fork aprobados; QA manual en teléfono y escritorio.
- Íconos PWA consistentes y sin iconografía antigua.
- Español como idioma inicial y persistencia del cambio manual de idioma.
- Rutina personal exacta, validada contra el registro fuente, importable solo en el perfil privado.
- PR único para V1.1; sin despliegue de backend público ni cambios automáticos en main.
