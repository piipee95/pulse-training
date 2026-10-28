# PULSE Train V1.1 — Entrega coherente, web primero

**Estado:** implementación parcial con validaciones locales; publicación pendiente de CI y controles finales. **Fecha:** 2026-10-28.

## Implementado en esta revisión
- PNG reales 180/192/512 con transparencia y maskable separado; variantes monocromas SVG, sin alterar trazos aprobados. Ver `BRAND_KIT.md`.
- Arranque con isotipo PULSE, tema Carbon y carga del idioma antes del primer render. Elección manual conservada. Nombres del demo traducidos solo al presentarlos, sin modificar seed ni historial.
- Importador local opcional, excluido de demo, con vista previa, respaldo, validación y guardado aditivo/idempotente. Ver `PRIVATE_IMPORT.md`.
- Evaluación de cuentas privadas y backend gratuito en `BACKEND_EVALUATION.md`; no hay cuentas de producción creadas.
- La rutina fuente y los archivos propuestos se mantienen fuera del checkout público. Las variantes ambiguas y selecciones dentro de rangos siguen sujetas a revisión antes de importar.

## Evidencia y límites
- Compilaciones demo y privada completadas localmente. 19 idiomas / 2575 claves: sincronizados.
- Suite completa inicial en Windows: 6530 pruebas aprobadas y 18 fallos en 7 archivos, antes de corregir las pruebas del watchdog y el hash CSP. Otros fallos corresponden a rutas POSIX, ejecución de shell y comparación de archivos generados con finales de línea; comprobar en CI Linux, no declararlos aprobados.
- Pruebas posteriores específicas de PWA, CSP, watchdog, store/importación e identidad aprobadas. Consultar CI del commit final para el resultado integral.
- Inicio revisado en navegador a 390×844, 768×1024 y 1440×900 sin desbordamiento horizontal; cambio a inglés y persistencia tras recarga comprobados, y regreso manual a español.
- No se ha verificado instalación real en teléfono, actualización de una instalación antigua, funcionamiento autenticado ni aislamiento de cuentas web.
- El control CLA más reciente del commit 3352fbab1 terminó aprobado. No se firmó automáticamente ni se eliminó el control; se verificó el resultado del bot.
- Configuración de Pages comprobada con cf CLI autenticado: producción main, repositorio correcto y VITE_DEMO=1. Falta comprobar el despliegue de producción del commit integrado.
- Auditoría histórica: el documento de una revisión anterior de esta rama contenía términos de la rutina personal. El borrado del texto en HEAD no lo elimina de commits anteriores. No reescribir historial ni eliminar Issues sin un plan y autorización específicos; revisar exposición histórica por separado, sin volver a reproducir datos personales en el PR.

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
