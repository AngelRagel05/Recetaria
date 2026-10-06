---
id: "007"
title: "Corrección de vulnerabilidad en shell-quote"
status: completed
---

# Especificación: Corrección de vulnerabilidad en shell-quote

## Problema y objetivo

La auditoría de dependencias de GitHub Actions bloquea la integración porque `concurrently 9.2.4`, utilizado por el comando local `composer run dev`, instala de forma transitiva `shell-quote 1.9.0`. Esa versión está afectada por una vulnerabilidad crítica de inyección de comandos y la versión corregida disponible es `1.11.0`. La versión más reciente de `concurrently` sigue declarando una versión vulnerable, por lo que actualizar únicamente esa dependencia no resuelve el problema.

El objetivo es que las instalaciones reproducibles de Recetaria utilicen la versión corregida de `shell-quote`, mantengan operativo `concurrently` y superen la auditoría de npm sin ocultar avisos ni relajar los controles de CI.

## Alcance

### Incluido

- La resolución explícita de `shell-quote 1.11.0` dentro del árbol de dependencias de desarrollo.
- La conservación de `concurrently` y del comando existente `composer run dev`.
- La actualización coherente de `package.json` y `package-lock.json` para que `npm ci` reproduzca la resolución segura.
- La comprobación del árbol instalado, la auditoría de npm y el funcionamiento básico de `concurrently`.
- La ejecución de las pruebas y controles frontend existentes para descartar incompatibilidades.
- La conservación del paso actual de auditoría en GitHub Actions.

### Fuera de alcance

- Eliminar `concurrently` o reescribir el flujo local agrupado por `composer run dev`.
- Desactivar `npm audit`, excluir las dependencias de desarrollo de la auditoría o reducir el nivel de severidad que bloquea CI.
- Actualizar dependencias no relacionadas o realizar una actualización general del frontend.
- Modificar código de aplicación, comportamiento visible, backend, base de datos, Supabase, Render o contratos de integración.
- Automatizar la retirada futura de la resolución explícita cuando `concurrently` publique una versión corregida.

## Actores

- Desarrollador: instala las dependencias y ejecuta el entorno local sin recibir una versión vulnerable conocida de `shell-quote`.
- Integrador: puede revisar una modificación limitada a la resolución de dependencias y sus documentos SDD.
- GitHub Actions: instala el árbol bloqueado y comprueba que la auditoría de npm no detecta la vulnerabilidad.

## Flujos

### Instalación reproducible

1. El desarrollador o GitHub Actions ejecuta `npm ci` a partir de los archivos versionados.
2. npm conserva `concurrently` como herramienta de desarrollo y resuelve `shell-quote` en la versión corregida aprobada.
3. La instalación termina sin necesitar opciones que ignoren conflictos o controles de seguridad.

### Auditoría de seguridad

1. GitHub Actions ejecuta la auditoría de npm existente sobre todas las dependencias incluidas las de desarrollo.
2. La vulnerabilidad de `shell-quote` deja de aparecer y la auditoría termina correctamente si no existe ningún otro aviso bloqueante.
3. El control de CI permanece activo y con el mismo alcance.

### Uso de concurrently

1. El desarrollador conserva el comando `composer run dev` y su invocación de `concurrently`.
2. `concurrently` puede iniciarse y coordinar comandos después de aplicar la resolución segura.
3. No cambia el comportamiento funcional de Recetaria ni el contenido enviado al navegador.

### Casos alternativos y errores

- Si el registro de npm no está disponible, la verificación que dependa de la red se detiene y no se declara completada.
- Si la versión corregida resulta incompatible con `concurrently`, la implementación se detiene para revisar la decisión; no se fuerza una instalación inválida ni se oculta el aviso.
- Si `npm audit` detecta otra vulnerabilidad, el resultado se informa y no se modifica una dependencia ajena sin ampliar y aprobar el alcance.
- Si una prueba, el lint, el formato o el build fallan, la tarea permanece abierta hasta explicar y resolver el fallo dentro del alcance aprobado.

## Reglas de seguridad y mantenimiento

- La resolución efectiva de `shell-quote` debe ser exactamente `1.11.0`, la versión corregida aprobada para esta tarea.
- `concurrently` continúa siendo una dependencia de desarrollo directa y no se sustituye por otra herramienta.
- No se permiten exclusiones, silenciamiento de auditorías ni opciones de instalación forzada para conseguir un resultado verde.
- El archivo de bloqueo debe representar exactamente la resolución declarada y ser reproducible mediante `npm ci`.
- No se aprovecha la corrección para actualizar paquetes no relacionados.
- La resolución explícita podrá retirarse en una tarea posterior cuando una versión de `concurrently` dependa de una versión segura y las verificaciones lo confirmen.

## Criterios de aceptación

- `CA-01`: Una instalación limpia con `npm ci` termina correctamente y el árbol resultante muestra `shell-quote 1.11.0` como resolución utilizada por `concurrently`.
- `CA-02`: `npm audit` termina con código de salida correcto y no informa vulnerabilidades conocidas en el árbol instalado.
- `CA-03`: `concurrently` continúa disponible y supera una comprobación básica de ejecución sin cambiar el comando `composer run dev`.
- `CA-04`: Las pruebas frontend, ESLint, Prettier y el build configurados en el proyecto terminan correctamente.
- `CA-05`: La corrección no modifica código de aplicación, migraciones, configuración de Supabase o Render, ni el comportamiento visible de Recetaria.
- `CA-06`: El paso existente de auditoría de GitHub Actions no se elimina, omite ni debilita; su comprobación externa queda pendiente hasta que el desarrollador publique o integre la rama.
- `CA-07`: Los cambios de dependencias se limitan a la resolución necesaria de `shell-quote` y no actualizan paquetes ajenos a la vulnerabilidad.

## Decisiones aprobadas

- Se conservará `concurrently` porque forma parte del flujo local agrupado definido en `composer run dev`.
- Se forzará la resolución de `shell-quote 1.11.0` mientras `concurrently` continúe declarando una versión vulnerable.
- La auditoría de npm seguirá incluyendo las dependencias de desarrollo y mantendrá su capacidad de bloquear CI.
- No se realizará una actualización general de dependencias ni se cambiará código de aplicación como parte de esta corrección.

## Decisiones pendientes

- No quedan decisiones de producto, seguridad o dependencias pendientes dentro del alcance de esta especificación.
