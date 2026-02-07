# 🦸 Heroes App

Una aplicación moderna de React + TypeScript para explorar y buscar héroes, construida con Vite, React Router 7 y shadcn/ui.

## ✨ Características

- 🎨 **Interfaz moderna** con Tailwind CSS y componentes shadcn/ui
- 🧭 **Navegación intuitiva** con React Router 7
- 🔍 **Búsqueda de héroes** con página dedicada
- 📱 **Diseño responsivo** optimizado para todos los dispositivos
- ⚡ **Carga rápida** con lazy loading de componentes
- 🎯 **TypeScript** para mayor seguridad de tipos
- 🎭 **Breadcrumbs dinámicos** para mejor navegación
- 📊 **Estadísticas de héroes** con tarjetas personalizadas

## 🚀 Tecnologías

- **React 18.3** - Framework UI
- **TypeScript 5.6** - Tipado estático
- **Vite 6** - Build tool y dev server
- **React Router 7** - Enrutamiento
- **Tailwind CSS 4** - Estilos utilitarios
- **shadcn/ui** - Componentes UI con Radix UI
- **Lucide React** - Iconos modernos

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🛠️ Scripts disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Construye para producción
npm run preview  # Previsualiza la build de producción
npm run lint     # Ejecuta ESLint
```

## 📁 Estructura del proyecto

```
src/
├── admin/              # Módulo de administración
│   ├── layouts/
│   └── pages/
├── auth/               # Autenticación (futuro)
├── components/
│   ├── custom/        # Componentes personalizados
│   │   ├── CustomMenu.tsx
│   │   ├── CustomBreadCrumbs.tsx
│   │   ├── CustomJumbotron.tsx
│   │   └── CustomPagination.tsx
│   └── ui/            # Componentes shadcn/ui
├── heroes/
│   ├── components/    # Componentes de héroes
│   │   ├── HeroGrid.tsx
│   │   ├── HeroGridCard.tsx
│   │   ├── HeroStatCard.tsx
│   │   └── HeroStats.tsx
│   ├── layouts/       # Layouts de héroes
│   └── pages/         # Páginas de héroes
│       ├── home/
│       ├── hero/
│       └── search/
├── lib/               # Utilidades
└── router/            # Configuración de rutas
```

## 🧭 Rutas

- `/` - Página principal con grid de héroes
- `/hero/:id` - Página de detalle de un héroe
- `/search` - Búsqueda de héroes
- `/admin` - Panel de administración

## 🎨 Componentes personalizados

### CustomMenu

Menú de navegación con estados activos y estilos modernos.

### CustomBreadCrumbs

Breadcrumbs dinámicos que muestran la ruta actual.

### CustomJumbotron

Hero section para destacar contenido.

### CustomPagination

Paginación reutilizable para listados.

## 🔧 Configuración

El proyecto usa:

- **ESLint** para linting
- **TypeScript** con configuración estricta
- **Tailwind CSS 4** con plugin de Vite
- **Path aliases** (`@/` apunta a `src/`)

## 📄 Licencia

Este proyecto es privado y está en desarrollo.

## 👨‍💻 Desarrollo

Para contribuir al proyecto:

1. Crea una rama para tu feature
2. Realiza tus cambios
3. Asegúrate de que no haya errores de lint
4. Crea un pull request

---

Desarrollado con ❤️ usando React + TypeScript
