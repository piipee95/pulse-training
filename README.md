<div align="center">

# PULSE Train

**Entrenamiento personal · Registro · Progresión**

Una aplicación web de seguimiento de fuerza e hipertrofia, desarrollada a partir de [openGym](https://github.com/DuarteSantos8/openGym).

[**Abrir PULSE Train**](https://pulse-train.pages.dev) · [Estado de cuentas](https://github.com/piipee95/pulse-training/issues/19) · [Código fuente](https://github.com/piipee95/pulse-training)

</div>

## Qué es PULSE

PULSE Train está evolucionando desde una versión demostrativa hacia una aplicación personal con **cuentas privadas, rutina real, historial persistente y recomendaciones transparentes de progresión**.

**Principio del producto:** tu rutina manda. PULSE debe registrar lo que realmente entrenas y sugerir ajustes, no reemplazar automáticamente tus ejercicios, series, repeticiones o cargas.

## Estado actual

| Área | Estado |
| --- | --- |
| Sitio web / PWA | Publicado en Cloudflare Pages |
| Interfaz y registro de sesiones | Disponibles en la base actual |
| Sugerencias de progresión basadas en historial | Implementación incremental; no modifican cargas automáticamente |
| Backend Workers + D1 | Esquema y base de **staging** preparados |
| Registro, inicio de sesión y sincronización privada en producción | **No habilitados todavía** |
| Importación de rutinas a una cuenta en producción | **Pendiente** |

**Importante:** el sitio publicado puede seguir ejecutándose en modo demostración durante la transición. No ingreses información personal sensible ni supongas que existe una cuenta privada o sincronización garantizada hasta que el sistema de autenticación esté validado.

## Dirección del desarrollo

- **Cuenta personal:** registro cerrado, acceso seguro, sesiones revocables y recuperación.
- **Datos propios:** perfiles separados, historial persistente, exportación y respaldos.
- **Rutinas fieles:** conservar ejercicios, alternativas, orden, rangos de series y repeticiones.
- **Progresión asistida:** recomendaciones opcionales según historial, técnica, RIR y variante de equipamiento.
- **Interfaz adaptable:** uso práctico en escritorio y móvil.

La prioridad actual es la [migración de cuentas](https://github.com/piipee95/pulse-training/issues/19). Los requisitos de transición y sus controles de seguridad se documentan en [ACCOUNT_FIRST_TRANSITION.md](docs/pulse/ACCOUNT_FIRST_TRANSITION.md).

## Arquitectura

| Componente | Tecnología |
| --- | --- |
| Frontend | React + Vite |
| Sitio web | Cloudflare Pages |
| API de cuentas en evaluación | Cloudflare Workers |
| Base de datos de pruebas | Cloudflare D1 |
| Proyecto de origen | openGym |

La API Node original continúa presente en el repositorio por compatibilidad y trazabilidad. **Workers + D1 no sustituye todavía sus funcionalidades de autenticación.** La prueba aislada se encuentra en [cloudflare/account-poc](cloudflare/account-poc/).

## Desarrollo local

Para trabajar en el frontend:

```bash
git clone https://github.com/piipee95/pulse-training.git
cd pulse-training/frontend
npm ci
npm run dev
```

Consulta `frontend/package.json` para los scripts disponibles y los documentos de `docs/` antes de configurar un backend o efectuar despliegues. Nunca incorpores contraseñas, claves, datos personales ni sesiones al repositorio.

## Proyecto original y licencia

PULSE Train se basa en **[openGym de Duarte Santos](https://github.com/DuarteSantos8/openGym)**, un proyecto de código abierto. Se conserva el reconocimiento a su autor, el historial y las obligaciones de licencia pertinentes.

Este repositorio mantiene la licencia **[GNU AGPL-3.0](LICENSE)**. Los recursos, dependencias y componentes de terceros conservan sus propias condiciones, cuando corresponda.

La documentación histórica de openGym y sus características originales puede consultarse directamente en su [repositorio oficial](https://github.com/DuarteSantos8/openGym). Las descargas, enlaces a tiendas y servicios de openGym no deben confundirse con versiones oficiales de PULSE Train.
