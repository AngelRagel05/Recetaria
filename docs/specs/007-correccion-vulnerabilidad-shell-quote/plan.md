---
spec: "007"
status: approved
---

# Plan técnico: Corrección de vulnerabilidad en shell-quote

## Resumen

La corrección se implementará mediante una sustitución de npm limitada a la dependencia `shell-quote` que utiliza `concurrently`. `package.json` declarará la versión segura exacta `1.11.0` dentro del ámbito de `concurrently`, y `package-lock.json` se regenerará de forma controlada para que `npm ci` reproduzca esa resolución sin actualizar dependencias ajenas.

Después se comprobarán el árbol instalado, la auditoría, una ejecución finita de `concurrently` y todos los controles frontend existentes. El workflow de GitHub Actions y el comando `composer run dev` permanecerán sin cambios.

## Componentes afectados

- `package.json`: declaración de la sustitución dirigida de `shell-quote` bajo `concurrently`.
- `package-lock.json`: resolución reproducible de `shell-quote 1.11.0` y metadatos derivados de la sustitución.
- `docs/specs/007-correccion-vulnerabilidad-shell-quote/`: seguimiento SDD de requisitos, plan, tareas y cierre.
- `MEMORY.md`: estado operativo de la corrección y comprobación externa pendiente.

No se modificarán `composer.json`, `.github/workflows/ci.yml`, código de aplicación, migraciones ni configuración de servicios.

## Contratos, datos e interfaces

- El contrato de instalación npm añade una sustitución específica para que la dependencia `shell-quote` de `concurrently` se resuelva exactamente como `1.11.0`.
- `concurrently` continúa como dependencia directa de desarrollo con su declaración vigente y `composer run dev` conserva su comando actual.
- No cambian interfaces de usuario, rutas, APIs, modelos de datos, variables de entorno ni contratos de despliegue.
- La auditoría de GitHub Actions conserva su comando y sigue incluyendo dependencias de desarrollo.

## Fases de implementación

1. **Declarar la resolución segura**
   - Añadir a `package.json` un `overrides` limitado a `concurrently > shell-quote` con el valor exacto `1.11.0`.
   - No cambiar la versión directa de `concurrently` ni otras dependencias.

2. **Actualizar el bloqueo de npm**
   - Regenerar `package-lock.json` mediante npm a partir del manifiesto aprobado, sin usar `--force` ni editar manualmente integridades.
   - Revisar el diff inmediatamente y detenerse si npm cambia paquetes ajenos a la resolución de `shell-quote`.

3. **Comprobar la instalación reproducible**
   - Ejecutar una instalación limpia con el mismo modelo de `npm ci` utilizado en CI.
   - Confirmar con el árbol de npm que `concurrently` sigue instalado y que su resolución efectiva de `shell-quote` es `1.11.0`.

4. **Verificar seguridad y compatibilidad**
   - Ejecutar `npm audit` sin exclusiones y exigir un resultado correcto sin vulnerabilidades conocidas.
   - Ejecutar el binario local de `concurrently` con dos comandos breves y finitos, comprobando que coordina ambos y termina correctamente sin arrancar el entorno completo.
   - Ejecutar `npm run test`, `npm run lint`, `npm run format:check` y `npm run build`.

5. **Revisión y cierre local**
   - Confirmar que `composer.json` y `.github/workflows/ci.yml` no han cambiado.
   - Ejecutar `git diff --check`, revisar el diff completo y comprobar que no hay secretos ni actualizaciones ajenas.
   - Actualizar `MEMORY.md` con el resultado local y dejar explícitamente pendiente la nueva ejecución de GitHub Actions.
   - Someter las evidencias a `test_reviewer`; cerrar especificación y tareas únicamente si devuelve `PASS`.

## Pruebas y criterios de aceptación

- `CA-01`: `npm ci` debe completar una instalación limpia y `npm ls concurrently shell-quote --all` debe mostrar `concurrently` operativo con `shell-quote 1.11.0` como resolución efectiva.
- `CA-02`: `npm audit` debe finalizar con código `0` y sin vulnerabilidades conocidas.
- `CA-03`: una ejecución local, breve y finita de `concurrently` con dos comandos independientes debe finalizar correctamente; se comprobará además que `composer.json` no cambia.
- `CA-04`: deben pasar `npm run test`, `npm run lint`, `npm run format:check` y `npm run build`.
- `CA-05`: la revisión del diff debe confirmar que no cambian código de aplicación, migraciones ni configuración de Supabase o Render.
- `CA-06`: `.github/workflows/ci.yml` debe permanecer sin cambios y conservar su auditoría independiente; el resultado externo se registrará después de que el desarrollador publique o integre la rama.
- `CA-07`: el diff de dependencias debe limitarse a la sustitución declarada y a la resolución de `shell-quote`, sin actualizaciones ajenas.

No se añadirá una prueba automatizada de aplicación porque no cambia comportamiento funcional. Las comprobaciones del árbol, la auditoría y la ejecución finita cubren directamente el contrato modificado.

## Documentación

- La especificación, el plan y las tareas de `007-correccion-vulnerabilidad-shell-quote` recogerán el alcance y las evidencias de cierre.
- `MEMORY.md` reflejará la verificación local y mantendrá el nuevo CI como pendiente hasta observarlo realmente.
- No se modificará documentación técnica permanente porque la sustitución es una medida temporal y localizada de mantenimiento de dependencias.

## Despliegue y compatibilidad

- No hay migraciones, despliegue manual ni cambios en Supabase o Render.
- La corrección afecta únicamente a herramientas de desarrollo instaladas por npm y no forma parte del código servido al navegador.
- El desarrollador gestionará la publicación e integración de la rama. GitHub Actions comprobará la instalación y auditoría reales después de esa publicación.
- La sustitución podrá retirarse en una tarea posterior cuando `concurrently` declare una versión segura y la eliminación supere las mismas verificaciones.

## Riesgos y medidas

- **Cambio accidental de otras dependencias:** regenerar el bloqueo de forma controlada y revisar el diff antes de continuar.
- **Incompatibilidad entre `concurrently` y `shell-quote 1.11.0`:** ejecutar una coordinación real pero finita; detener la tarea si falla en lugar de forzar la instalación.
- **Resultado variable de la auditoría remota:** registrar la evidencia local y mantener el CI pendiente; una vulnerabilidad nueva y ajena no autoriza ampliar el alcance.
- **Falso positivo de éxito por usar otro binario:** invocar la instalación local y comprobar el árbol resuelto antes de la prueba funcional.
