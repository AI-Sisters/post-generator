# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (Turbopack)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Architecture

Next.js 16 App Router project (TypeScript + Tailwind CSS v4) that generates LinkedIn posts using Google Gemini.

### API Routes

- `src/app/api/generate-post/route.ts` — Text generation via **gemini-3.1-flash-lite-preview**. Accepts `{ topic, tone, format, language }` and returns `{ post }`.
- `src/app/api/generate-image/route.ts` — Image generation via **gemini-3.1-flash-image-preview**. Accepts `{ topic, style }` and returns `{ image (base64), mimeType }`.

Both routes use `@google/genai` SDK and read `GEMINI_API_KEY` from environment.

### Frontend

Single-page app in `src/app/page.tsx` (client component). The form collects topic, tone (5 options), format (4 options), and language, then calls both API routes in parallel. Results render in a LinkedIn-style preview card with copy-to-clipboard and image download.

### Branding

AI Sisters pink theme. Colors are defined as Tailwind `@theme inline` custom properties in `globals.css`. Primary palette: `pink-50` through `pink-900`.

## Environment

Requires `GEMINI_API_KEY` in `.env.local`. See `.env.example`.
