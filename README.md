# Red & Green Game

Prueba técnica / juego de reflejos desarrollado con Angular (Standalone Components y Signals). El objetivo es pulsar el botón cuando el semáforo esté en verde y evitar hacerlo en rojo, gestionando la sesión del jugador y registrando las puntuaciones.

Más detalles sobre las decisiones de diseño y estructura en [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Requisitos previos

- **Node.js**: v20 o superior
- **npm**: v10 o superior

## Instalación y ejecución

Clonar el repositorio e instalar dependencias:

```bash
npm install
```

Arrancar en local:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200/`.

---

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm start` | Levanta el servidor de desarrollo en local (`ng serve`) |
| `npm run build` | Compila el proyecto para producción en `dist/` |
| `npm test` | Ejecuta la suite de pruebas unitarias con Jest |
| `npm run test:watch` | Ejecuta Jest en modo interactivo/watch |
| `npm run test:coverage` | Genera el informe de cobertura de tests |
| `npm run lint` | Ejecuta ESLint sobre el código TypeScript y plantillas HTML |

---

## Notas técnicas del proyecto

- **Angular zoneless + Signals**: Se aprovechan los signals de Angular para el manejo de estado reactivo y change detection `OnPush`, prescindiendo de dependencias pesadas para estado global.
- **Estructura de estilos (ITCSS / SCSS)**: Los estilos están organizados por capas (`settings`, `tools`, `generic`, `objects`), usando variables CSS nativas y tipografía/espaciados fluidos.
- **Accesibilidad**: Se ha tenido en cuenta el contraste de colores, soporte para usuarios con daltonismo (añadiendo apoyo visual y texto además del color) y navegación por teclado con foco visible.
- **Testing con Jest**: Configurado con `jest-preset-angular` (modo zoneless) para ejecutar los tests de forma más rápida que con Karma.
