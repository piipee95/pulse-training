# PULSE Train — Brand Kit V1.1

Identidad aprobada: Carbon `#11151B`, Volt `#B8F255`. Superficies Slate `#222A34`, texto Cloud `#F5F7F9` y Steel `#778397`. Los trazos originales de `frontend/public/pulse-icon.svg` y `pulse-logo.svg` se conservan.

## Recursos web

| Archivo en frontend/public | Uso |
| --- | --- |
| pulse-icon.svg | Isotipo original, favicon y arranque |
| pulse-logo.svg | Logotipo original para fondo oscuro |
| pulse-icon-mono-carbon.svg / pulse-logo-mono-carbon.svg | Monocromo Carbon para fondos claros |
| pulse-icon-mono-cloud.svg / pulse-logo-mono-cloud.svg | Monocromo Cloud para fondos oscuros |
| icon-180.png | Apple touch y exportación transparente |
| icon-192.png | PWA, transparente |
| icon-512.png | PWA, transparente |
| icon-maskable-512.png | PWA maskable, fondo Carbon opaco |

Los PNG se rasterizan desde el SVG original con `frontend/scripts/pulse-icons.cjs`, usando sharp (herramienta gratuita de desarrollo; no se incorpora al bundle). Ejecutar desde cualquier carpeta con sharp disponible para Node, por ejemplo mediante `NODE_PATH`. El script sobrescribe los cuatro PNG y las cuatro variantes monocromas enumeradas. No cambia iconos nativos de Capacitor. Las variantes solo cambian rellenos, conservan geometría y tipografía del SVG original; el logotipo original usa texto con Arial/Helvetica y puede variar levemente según las fuentes instaladas.

La marca completa de maskable se coloca en un cuadrado central de 266 px sobre 512 px: sus esquinas están dentro del círculo seguro central de radio 204,8 px. Las pruebas decodifican los PNG, comprueban dimensiones, transparencia y cada píxel fuera del círculo seguro.

El acento web predeterminado se representa con Volt. Las preferencias de color existentes y los colores estacionales elegidos se conservan. En tema claro, la adaptación de contraste existente oscurece el acento cuando corresponde; no usar Volt como texto pequeño sobre blanco. El tema del navegador acompaña Carbon/Cloud.

## Verificación

`cd frontend` y `npx vitest run src/lib/pulse-pwa.test.js src/pulse-theme.test.js`.

La instalación real en iPhone/Android, el comportamiento de Apple al componer el PNG transparente y la actualización de iconos ya instalados requieren comprobación en dispositivos. Una prueba de manifiesto o navegador de escritorio no los sustituye.
