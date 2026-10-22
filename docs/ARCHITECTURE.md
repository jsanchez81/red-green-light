# Arquitectura y Decisiones Técnicas: Red & Green App

## 1. Arquitectura CSS (ITCSS + BEM)

Los estilos se estructuran siguiendo **ITCSS** para controlar la especificidad, combinados con nomenclatura **BEM**:

* **`settings/` y `tools/`**: Variables SASS, design tokens y mixins globales.
* **`generic/`**: Reset y estilos base normalizados.
* **`objects/`**: Estructuras de maquetación (`.o-container`, `.o-stack`).
* **`components/`**: Estilos encapsulados por componente con prefijo `.c-` (`.c-btn`, `.c-ui-input`).

Se utilizan **CSS Custom Properties** (`var(--...)`) en `:root` para valores dinámicos y temas en tiempo de ejecución.

---

## 2. Diseño Responsivo Intrínseco (Mobile-First)

En lugar de media queries rígidas, la interfaz se adapta fluidamente al viewport mediante diseño intrínseco:

* **Funciones matemáticas CSS (`clamp`, `min`, `max`)**: Tipografías y espaciados calculados dinámicamente según el tamaño de pantalla.
* **Contenedor elástico**: Ancho adaptativo (`max-width: min(100% - 2rem, 480px)`) centrado automáticamente.
* **Flexbox intrínseco**: Espaciados consistentes mediante `.o-stack` y propiedad `gap`.
* **Viewport dinámico (`100dvh`)**: Ajuste exacto a la altura visible en navegadores móviles (evita saltos con barras de navegación en iOS/Android).

---

## 3. Accesibilidad (WCAG 2.2 AA)

La accesibilidad está integrada desde el diseño inicial:

* **Inclusión visual**: Ratios de contraste superiores a 7:1 y diferenciación geométrica en iconografía (apoyo a usuarios con daltonismo).
* **Semántica y lectores de pantalla**: Atributos ARIA (`role="alert"`, `aria-live="polite"`, `aria-describedby`) para anunciar eventos en tiempo real.
* **Navegación y ergonomía**: Foco por teclado visible, objetivos táctiles mínimos de 48px y respeto por `prefers-reduced-motion`.

---

## 4. Componentes Smart / Presentational

Separación clara de responsabilidades para maximizar la mantenibilidad y reusabilidad:

* **Componentes Presentacionales (Dummy)**:
  - Sin dependencias de negocio, APIs ni enrutador.
  - Estrategia `ChangeDetectionStrategy.OnPush`.
  - Comunicación estricta mediante `input()` y `output()`.
  - Ejemplos: `UiButtonComponent`, `UiInputComponent` (ControlValueAccessor), `SplitCircleIconComponent`.

* **Componentes Contenedor (Smart)**:
  - Orquestan la vista, gestionan el estado e inyectan servicios y enrutamiento.
  - Ejemplo: `HomeComponent` (gestión de sesión y navegación), `GameComponent` (orquestación de la partida).

---

## 5. Validación y Sanitización de Entrada

Enfoque defensivo para garantizar la integridad de los datos:

* **Validación síncrona estricta**: Expresión regular alfanumérica (`/^[a-zA-Z0-9]+$/`) y mínimo 4 caracteres en `playerNameValidator()`.
* **Sanitización en capa de servicio**: `PlayerService` normaliza y limpia el valor antes de procesar o persistir la entidad.
* **Control en interfaz**: El botón de acción permanece deshabilitado hasta que el formulario es válido.

---

## 6. Estrategia de Testing (Jest + Zoneless)

Entorno de pruebas configurado con Jest sobre Angular Zoneless:

* **Configuración**: `jest-preset-angular/setup-env/zoneless` para ejecución rápida sin dependencia de `zone.js`.
* **Tipado e integración**: Referencias en `tsconfig.json` a `tsconfig.spec.json` para soporte nativo en el IDE.
* **Comandos**: `npm test` para ejecución de suites y `npm run test:coverage` para análisis de cobertura.

---

## 7. Gestión de Estado y Persistencia

Estructura modular dividida en dos capas:

* **Infraestructura (`LocalStorageService`)**: Capa de abstracción tipada y tolerante a fallos para lectura/escritura en almacenamiento local (compatible con SSR).
* **Dominio y Reactividad (`Signals`)**:
  - `PlayerService`: Controla la sesión y récord personal mediante señales reactivas (`currentPlayer`, `hasActivePlayer`).
  - `LeaderboardService`: Mantiene el ranking ordenado por puntuación y fecha, acotado a los mejores registros.
