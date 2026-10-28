# PULSE Train V1.2 — Personal Training

Estado: especificación de trabajo; funcionalidad **no implementada** por este documento.

## Objetivo y alcance

Transformar PULSE de una demostración visual en un registro de entrenamiento personalizado, sin perder el motor de entrenamiento existente, la privacidad ni la compatibilidad PWA. El usuario cuenta con acceso a equipamiento de gimnasio comercial convencional (Smart Fit / Full Fit u otros equivalentes): poleas, mancuernas, barras, bancos y máquinas. No atar la rutina a una marca ni atribuir equivalencias de kilogramos a máquinas diferentes.

## Regla de privacidad, no negociable

- Los ejercicios, cargas, series y progreso personales no se introducen en `demoSeed.js`, plantillas públicas ni archivos versionados.
- El importador existente (`frontend/src/lib/private-plan.js`) opera únicamente en localhost, sin cuenta conectada, con `VITE_PRIVATE_IMPORT=1` y `VITE_DEMO!=1`. **El sitio público Cloudflare no admite importación privada en la cuenta**.
- Mantener esta restricción hasta verificar autenticación, autorización, aislamiento entre usuarios, políticas de sincronización y pruebas reales de backend.
- Conservar créditos y licencias del proyecto de origen.

## Evidencia de entrenamiento y límites

Existe un esquema histórico de cuatro días con énfasis en espalda/tríceps, pecho/bíceps/hombros, sesión ligera y piernas. El calendario y las variantes más recientes todavía requieren contraste con el registro de entrenamiento completo. No fijarlos como verdad definitiva.

Ejemplo documentado de sesión del 26/10/2026, con finalidad de cotejo **fuera del código público y sin sembrar historial**: usar los registros privados aportados por el propietario como fuente directa, evitando replicar cargas personales en documentación pública.

Los números de la demo actual son ficticios y no representan al propietario.

## Formato de importación de rutina

Usar el contrato existente `pulse-private-plan` versión 1: `id`, `unit: kg`, `routines[]` con `name`, `note`, `ex[]` y por ejercicio `id` de catálogo, `sets`, `reps`, `note`. Resolver nombres contra `EXIDX` y marcar ejercicios aún no mapeados. No inventar series ni convertir rangos a enteros sin revisión. El importador fija `weight: 0`: referencias históricas en notas no son prescripción ni set completado.

## Progresión guiada (futuro)

- Observación: usar únicamente series confirmadas y persistidas; conservar ejercicio, variante, máquina, kg, repeticiones, RIR y fecha.
- Recomendación determinista: ofrecer repetir, sumar repeticiones dentro del rango o proponer incremento conservador cuando la técnica y esfuerzo cumplan condiciones acordadas.
- Separar propuesta de ejecución: el usuario confirma, ajusta o rechaza la recomendación; nunca marcar series completadas por sugerencia.
- No mezclar historial de variantes incompatibles, ni duplicar sets al reabrir una sesión.
- Tratar falta de RIR o técnica reportada como información insuficiente, no como un éxito de progresión.

## Camino de entrega

1. Completar recuperación de la rutina de 4 días, variantes y ejercicios contra evidencia del usuario.
2. Validar el mapa de catálogo y generar **artefacto local privado**, con vista previa y respaldo.
3. Implementar progresión con tests unitarios de edge cases y regresión del modelo de sesión.
4. Diseñar permisos y sincronización en cuentas, habilitando importación remota solo cuando pase un gate de seguridad independiente.
5. Pruebas de interfaz en móvil/escritorio, almacenamiento, offline y consistencia de idioma.

## Criterios de aceptación

- Cero datos personales en bundles y repositorios públicos.
- Plan revisable antes de importar; nada se sobrescribe sin confirmación.
- Sin cambios en sesiones, pesos o calendario existentes por una importación de rutina.
- Acceso remoto multiusuario deshabilitado hasta cumplir gate de seguridad.
- Registros y progresión reflejan solo actividad real guardada y validada.
