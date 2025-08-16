# Technology Stack

## Framework & Runtime
- **Next.js 15** with App Router architecture
- **React 19** with TypeScript (strict mode)
- **Node.js** runtime environment

## Styling & UI
- **Tailwind CSS** for styling with dark mode support
- **Headless UI** and **Heroicons** for accessible components
- **Framer Motion** for animations
- **Lucide React** for additional icons

## Internationalization
- **next-intl** for bilingual support (English/Chinese)
- Locale-based routing with `/[locale]` pattern
- Font optimization with Inter and Noto Sans SC

## State Management & Utils
- **Zustand** for lightweight state management
- **clsx** and **tailwind-merge** for conditional styling
- **Vercel Analytics** for performance tracking

## Development Tools
- **ESLint** with Next.js configuration
- **PostCSS** with Autoprefixer
- **Canvas** for image generation scripts

## Common Commands

```bash
# Development
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint checks

# Additional scripts
npm run generate-og  # Generate OG images (custom script)
```

## Build System
- Next.js built-in bundling and optimization
- TypeScript compilation with strict mode
- Tailwind CSS processing via PostCSS