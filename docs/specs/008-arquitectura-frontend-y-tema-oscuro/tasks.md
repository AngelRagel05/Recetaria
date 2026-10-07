---
spec: "008"
status: in_progress
---

# Tareas: Arquitectura frontend por áreas y tema oscuro

- [ ] `T-01` — Crear `global.css`, cargarlo directamente una sola vez desde `app.tsx`, retirar `app.css`, definir los tokens aprobados y adaptar el progreso de Inertia al tema oscuro. Cubre: `CA-10`, `CA-11`, `CA-13`.
- [ ] `T-02` — Migrar `FormField`, `AuthenticatedLayout` y `GuestLayout` a carpetas visuales homónimas y aplicar estilos mobile first propios. Cubre: `CA-01`, `CA-04`, `CA-09`, `CA-11`, `CA-12`.
- [ ] `T-03` — Migrar las seis páginas Auth a carpetas independientes con CSS Module propio, imports `@/` y comportamiento de formularios intacto. Cubre: `CA-01`, `CA-04`, `CA-06`, `CA-09`, `CA-11`, `CA-12`, `CA-15`.
- [ ] `T-04` — Migrar Dashboard, Profile/Edit y los tres formularios de perfil a sus carpetas aprobadas, repartiendo estilos sin cambiar campos, rutas, errores ni foco. Cubre: `CA-01`, `CA-04`, `CA-06`, `CA-09`, `CA-11`, `CA-12`, `CA-15`.
- [ ] `T-05` — Reorganizar SocialFeed, mover sus tipos y extraer `PublicationCarousel` y `PublicationAction` con parejas TSX/CSS independientes y comportamiento accesible equivalente. Cubre: `CA-01`, `CA-03`, `CA-04`, `CA-08`, `CA-09`, `CA-13`, `CA-15`.
- [ ] `T-06` — Trasladar datos y tipos de Home y extraer los siete componentes aprobados, dejando la página Home como coordinadora del estado, las vistas y el foco existentes. Cubre: `CA-01`, `CA-03`, `CA-04`, `CA-07`, `CA-09`, `CA-11`, `CA-12`, `CA-13`, `CA-15`.
- [ ] `T-07` — Configurar la resolución anidada de Inertia, cambiar únicamente los componentes lógicos de `/` y `/dashboard` y añadir las aserciones backend de Home, Dashboard, Auth y Profile. Cubre: `CA-05`, `CA-06`, `CA-16`.
- [ ] `T-08` — Actualizar y ampliar las pruebas React para las nuevas rutas y componentes sin reducir la cobertura de visitante, miembro, registro, perfil, feed, carrusel, acciones y teclado. Cubre: `CA-06`, `CA-07`, `CA-08`, `CA-13`, `CA-15`.
- [ ] `T-09` — Ampliar la inclusión de Vitest y añadir las pruebas de arquitectura y contrato visual para estructura, ubicaciones permitidas, imports, carga global, paleta y contraste. Cubre: `CA-01`, `CA-02`, `CA-03`, `CA-04`, `CA-09`, `CA-10`, `CA-11`, `CA-13`, `CA-14`.
- [ ] `T-10` — Actualizar `AGENTS.md` y `docs/decisiones-tecnicas.md` con la arquitectura y dirección visual oficiales, sin crear documentación permanente adicional. Cubre: `CA-18`.
- [ ] `T-11` — Revisar Home, Auth, Dashboard y Profile a 320, 768 y 1440 píxeles, medir contraste y confirmar que no hay desbordamientos, recortes, acciones ocultas ni regresiones de teclado. Cubre: `CA-11`, `CA-12`, `CA-13`.
- [ ] `T-12` — Ejecutar Vitest, ESLint, Prettier, build, PHPUnit, Pint, auditorías y `git diff --check`; revisar imports antiguos, archivos huérfanos, rutas, dependencias y diff completo. Cubre: `CA-02`, `CA-05`, `CA-06`, `CA-15`, `CA-16`, `CA-17`.
- [ ] `T-13` — Presentar las evidencias a `test_reviewer` y, solo con `PASS`, completar los artefactos SDD y actualizar `MEMORY.md` con la publicación y GitHub Actions pendientes. Cubre: `CA-19`.
