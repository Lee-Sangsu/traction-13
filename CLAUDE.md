# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language Settings
**Important**: This project supports English. When developing, add the ui texts under /dictionaries/[lang].json files.
- All the annotations should be written in English.
- Tailwind css styling should follow and/or reference app/[lang]/page.tsx. And utilize the pre-determined colors and other styling settings on /app/[lang]/globals.css. 
- When to add the ui component / section, use <section> tag.

## Project Overview
Traction 13 is a hands-on sprint for students and early founders. 
The challenge is designed for young entrepreneurs to develop a business in 13 days you’ll find a real problem, build a buyable offer, talk to customers, leave with real outcomes. Pitch for multiple prizes, including a ₩1,000,000 top award. 

## Figma Dev Mode MCP Rules

- The Figma Dev Mode MCP Server provides an assets endpoint which can serve image and SVG assets
- IMPORTANT: If the Figma Dev Mode MCP Server returns a localhost source for an image or an SVG, use that image or SVG source directly
- IMPORTANT: DO NOT import/add new icon packages, all the assets should be in the Figma payload
- IMPORTANT: do NOT use or create placeholders if a localhost source is provided


## Technology Stack
- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **State Management**: TanStack React Query
- **UI Components**: shadcn/ui with Tailwind CSS
- **Form Handling**: React Hook Form with Zod validation
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit
- **File Processing**: react-dropzone, xlsx
- **Date Handling**: dayjs

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build the project
npm run build

# Run production server
npm start

# Type checking (always run before commits)
npm run type-check

# Linting (always run before commits)
npm run lint

# Generate Supabase types (run after database schema changes)
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
```