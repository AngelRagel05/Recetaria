---
spec: "005"
status: completed
---

# Tareas: Prototipo visual del feed social

- [x] `T-01` — Crear seis SVG culinarios originales, contratos de presentación y fixtures deterministas; hacer nullable `auth.user` y migrar `AuthenticatedLayout` y `UpdateProfileInformationForm` a `AuthenticatedPageProps`. Cubre: `CA-05`, `CA-13`, `CA-14`.
- [x] `T-02` — Construir el shell responsive y la navegación diferenciada de visitante y miembro dentro de `Welcome`, conservando las rutas existentes. Cubre: `CA-01`, `CA-03`, `CA-10`, `CA-11`, `CA-14`.
- [x] `T-03` — Implementar feed, tarjeta, referencia textual de receta, acciones sociales y carrusel accesible mediante props y callbacks, manteniendo controles montados, foco estable y anuncio `Imagen X de Y`. Cubre: `CA-05`, `CA-06`, `CA-07`, `CA-11`, `CA-13`.
- [x] `T-04` — Implementar el límite de seis publicaciones y CTA del visitante, las pestañas `Inicio`/`Explorar` y el estado vacío. Cubre: `CA-01`, `CA-02`, `CA-03`, `CA-04`, `CA-09`.
- [x] `T-05` — Implementar las vistas ficticias de creación, invitaciones y perfil, trasladar el foco a sus encabezados, restaurarlo al regresar y conservar las interacciones locales reiniciables. Cubre: `CA-08`, `CA-12`.
- [x] `T-06` — Completar estilos responsive y estados accesibles, y revisar manualmente 320 píxeles y escritorio. Cubre: `CA-10`, `CA-11`.
- [x] `T-07` — Comprobar que cada SVG no supera 50 KB, que el conjunto no supera 300 KB y que todos se sirven localmente con texto alternativo procedente de los fixtures. Cubre: `CA-05`, `CA-14`.
- [x] `T-08` — Añadir pruebas con Vitest y React Testing Library para visitante, miembro, feeds, carrusel, estado vacío, vistas ficticias, acciones sociales y conservación/restauración de foco mediante `document.activeElement`. Cubre: `CA-01`, `CA-02`, `CA-03`, `CA-04`, `CA-05`, `CA-06`, `CA-07`, `CA-08`, `CA-09`, `CA-11`, `CA-12`, `CA-13`, `CA-15`.
- [x] `T-09` — Buscar todos los consumidores de `PageProps`, ejecutar PHPUnit, Pint, Vitest, ESLint, Prettier, build y `git diff --check`; revisar el diff, actualizar `MEMORY.md` y preparar la revisión de `test_reviewer`. Cubre: `CA-10`, `CA-14`, `CA-15`.
