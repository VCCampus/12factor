# Project Structure

## Root Level Organization
- **Configuration files**: `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`
- **Package management**: `package.json`, `package-lock.json`
- **Documentation**: `README.md`, `CLAUDE.md`, translation reports
- **Scripts**: Custom utilities in `/scripts` folder

## Source Code Structure (`/src`)

### App Router (`/src/app`)
```
/app
├── layout.tsx              # Root layout with fonts and theme
├── page.tsx               # Root redirect page
├── globals.css            # Global styles
└── [locale]/              # Internationalized routes
    ├── layout.tsx         # Locale-specific layout
    ├── page.tsx          # Home page
    ├── principles/        # Learning principles section
    ├── flashcards/        # Interactive flashcards
    ├── quiz/             # Quiz functionality
    └── prompt-engineering/ # Course content
        └── [course]/      # Dynamic course pages
```

### Components (`/src/components`)
- **UI Components**: Reusable React components
- **Interactive Elements**: FlashCard, InteractivePromptEditor, Quiz components
- **Navigation**: Navigation, ThemeToggle, mobile menus
- **Layout**: LearningCard, LessonCard, specialized layouts

### Data Layer (`/src/data`)
- **Content**: Static content definitions (principles, lessons, notebooks)
- **Type-safe**: TypeScript interfaces for all data structures

### Internationalization (`/src/i18n` & `/src/messages`)
- **Routing**: Locale configuration and navigation setup
- **Messages**: JSON files for English (`en.json`) and Chinese (`zh.json`)
- **Request handling**: Server-side i18n configuration

### Utilities & Libraries (`/src/lib`, `/src/utils`)
- **Metadata**: SEO and structured data helpers
- **Theme**: Dark/light mode utilities
- **Helpers**: Business logic utilities (principle helpers)

### State & Providers (`/src/providers`, `/src/hooks`)
- **Theme Provider**: Global theme state management
- **WebView Provider**: Platform detection for mobile apps
- **Custom Hooks**: Reusable logic (WebView detection)

## Key Architectural Patterns

### Internationalization Pattern
- Locale-based routing with `[locale]` dynamic segments
- Centralized message files with nested JSON structure
- Type-safe translations using next-intl

### Component Organization
- Atomic design principles with reusable components
- Consistent naming: PascalCase for components
- Co-located styles using Tailwind classes

### Data Flow
- Static data in `/src/data` with TypeScript interfaces
- Zustand for client-side state management
- Server components for data fetching where possible