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

## Rutina personal: NO confundir con starter global
Registros previos muestran que el usuario ha iterado distintas divisiones. Una planificación aprobada con claridad el 24 de agosto fue rotación:
1. Upper A — pecho dominante + espalda + deltoides lateral + tríceps.
2. Lower B — cuádriceps + femoral + pantorrilla + zona media.
3. Upper C — espalda dominante + pecho + deltoides posterior/lateral + bíceps.
4. Lower D — cadena posterior + cuádriceps + pantorrilla + zona media.

La preferencia posterior de sesiones por músculos (espalda/tríceps, pecho/bíceps/hombro, hombros complementarios, piernas) existe como otra referencia, **no se debe asumir que es el último plan confirmado**. El usuario también mencionó semanas alternadas de cuatro y cinco sesiones. Recuperar y conciliar el plan más reciente antes de registrar ejercicios. Es obligatorio preservar el historial verdadero; no fabricar sets.

**Objetivo:** hipertrofia; énfasis en pecho superior, dorsales y deltoides; técnica como prioridad. Parámetros de referencia históricos del plan Upper/Lower: compuestos 5–10 repeticiones, accesorios 10–20, 1–3 RIR, descansos largos 2.5–4 min y accesorios 1–2 min. Deben revisarse frente al plan actual antes de aplicarlos a ejercicios concretos.

**Disponibilidad de equipos:** gimnasio comercial completo, máquinas selectorizadas, poleas, bancos, barra, discos, mancuernas y prensas. No limitar la selección a un gimnasio doméstico.

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
