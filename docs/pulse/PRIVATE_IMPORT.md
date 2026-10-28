# Importación privada de planes

## Separación de la demo

El importador no incluye datos personales ni plantillas del propietario. Solo se incorpora con `VITE_PRIVATE_IMPORT=1`, `VITE_DEMO` distinto de `1` y fuera de Capacitor. Además, cada lectura y cada guardado requieren localhost/127.0.0.1, ausencia de usuario autenticado y ausencia de servidor/propietario conectado. En la demo oficial se excluye la interfaz y no se modifica `demoSeed.js`.

Para una prueba local, usar un directorio de salida distinto: desde frontend, establecer `VITE_PRIVATE_IMPORT=1`, quitar `VITE_DEMO` y ejecutar `npm run build -- --outDir dist-private`. Servir solo en loopback: `npm run preview -- --outDir dist-private --host 127.0.0.1 --port 4175`. Usar un origen/puerto separado y entrar sin cuenta. No publicar este directorio.

## Archivo del usuario

JSON con `format: "pulse-private-plan"`, `version: 1`, `id` estable alfanumérico con guiones, `unit: "kg"` y `routines`. Cada rutina contiene `name`, `note` opcional y `ex`; cada ejercicio lleva `id` del catálogo, `sets` y `reps` enteros y `note` opcional. Tamaño máximo 256 KB, hasta 12 rutinas y 30 ejercicios por rutina. Rechaza identificadores desconocidos, rangos sin resolver y unidades incompatibles. Seleccionar las alternativas reales antes de confirmar; nunca equiparar automáticamente cargas de máquinas distintas.

Las notas conservan referencias históricas; el importador fija `weight: 0` y no crea entrenamientos, pesajes ni series realizadas. Un archivo propuesto debe señalar explícitamente cualquier selección dentro de un rango, para revisión del usuario. El material fuente completo y las decisiones pendientes se conservan fuera del checkout público.

## Secuencia de seguridad

1. Leer archivo local y validar sin escribir.
2. Mostrar nombres del catálogo, series/repeticiones, notas y rutinas añadidas/omitidas.
3. Descargar el estado completo previo como respaldo JSON y confirmar que se guardó y revisó el plan.
4. Revalidar contexto y coincidencia exacta del estado en memoria y disco; rechazar una vista previa obsoleta.
5. Guardar y releer además una copia local `pulse-private-backup-<timestamp>`; si falla, no iniciar la importación.
6. Añadir solo las rutinas nuevas mediante el store existente, sin push. Verificar que están en disco. Mantener entrenamientos, sesión activa, calendario y resto de campos.

Los IDs deterministas permiten repetir el mismo archivo sin duplicar rutinas, incluso tras recargar. Una rutina ya importada y modificada genera un conflicto explícito; no se sobrescribe. Una nueva versión del plan necesita otro ID y revisión consciente.

Si falla el guardado final, se informa el fallo y se conserva el respaldo; no asumir éxito. La persistencia existente puede mantener cambios solo en memoria cuando no hay espacio. Recargar y revisar el estado antes de reintentar. Para restaurar, usar el importador de respaldos existente sobre el origen local privado y revisar su confirmación. Las fotos y vídeos se mantienen en sus almacenes; el respaldo JSON contiene referencias, no los binarios: exportar ZIP si se necesita una copia portátil completa con medios.

Esto proporciona aislamiento local respecto de la demo y del repositorio, no control de acceso frente a otra persona con acceso al mismo navegador/equipo. No está habilitado para importar sobre cuentas web; esa ampliación requiere backend, aislamiento entre cuentas y pruebas de autorización.

## Pruebas

`npx vitest run src/lib/private-plan.test.js src/store/useStore.private-plan.test.jsx`

Incluyen importación mediante el store real, persistencia, repetición tras recarga, preservación de historial/calendario, ausencia de llamadas API, conflictos, validación de catálogo, rechazo de demo/cuenta/servidor y fallo del respaldo.
