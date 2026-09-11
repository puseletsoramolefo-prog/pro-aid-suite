# AI Workplace Productivity Assistant

A modern, responsive SaaS web application built for professionals, administrators, managers, and job seekers who want to save time, stay organised, and work smarter with AI-powered workplace tools.

Built as a Capaciti project presentation, this app demonstrates three practical AI productivity features in a clean, professional interface that works seamlessly on desktop, tablet, and mobile.

## Live Demo

- **Preview URL:** https://id-preview--fe8456c0-ecfc-4291-be39-49f5c6399436.lovable.app
- **Published URL:** https://pro-aid-suite.lovable.app

## Features

### ✉️ Smart Email Generator

Create professional workplace emails quickly with AI.

- Enter the purpose, recipient, and key points
- Choose a tone: Formal, Professional, Friendly, or Persuasive
- Choose a length: Short, Medium, or Detailed
- Generate a polished email subject and body
- Edit, copy, regenerate, or clear the form with one click

The generator preserves your intended meaning, uses the selected tone and length, and never invents names, dates, facts, promises, or commitments.

### 📝 Meeting Notes Summarizer

Turn raw meeting notes into clear summaries, decisions, and action items.

- Paste meeting notes in a simple text area
- Generate:
  - A concise meeting summary
  - Key discussion points
  - Decisions made
  - Action items with task, responsible person, and deadline
  - Important follow-up items
- Copy results or clear notes to start again

If a responsible person or deadline is not provided in the notes, the app displays "Not specified" instead of guessing.

### 📋 AI Task Planner

Organise tasks, set priorities, and create an efficient daily or weekly plan.

- Add multiple tasks with name, priority, deadline, and estimated duration
- Generate an organised plan for the day or week
- View:
  - Priority ranking
  - Recommended task order
  - Suggested schedule with breaks
  - Scheduling conflicts
  - Practical productivity recommendations

The planner prioritises urgency and importance, considers estimated duration, identifies conflicts, and never invents deadlines or information you did not provide.

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) — full-stack React framework with SSR/SSG and server functions
- **Build Tool:** Vite 7
- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui, Radix UI primitives, Lucide icons
- **Notifications:** Sonner
- **AI Integration:** Lovable AI Gateway with client-side fallbacks
- **Routing:** TanStack Router (file-based routing)

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm or bun

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080` by default.

### Build for Production

```bash
npm run build
```

### Lint and Format

```bash
npm run lint
npm run format
```

## Project Structure

```
src/
├── components/          # Shared UI components
│   ├── AppShell.tsx     # Responsive layout with sidebar, header, and navigation
│   ├── ResponsibleAi.tsx# Responsible AI badge and banner
│   └── ai-elements/     # Reusable AI UI primitives
├── lib/                 # Utilities and business logic
│   ├── ai.ts            # AI request helpers and fallback handling
│   ├── ai.functions.ts  # Server functions for AI generation
│   ├── mock.ts          # Deterministic sample data and client-side fallbacks
│   ├── nav.ts           # Navigation configuration
│   └── utils.ts         # General utilities
├── routes/              # TanStack Start file-based routes
│   ├── __root.tsx       # Root layout and metadata
│   ├── index.tsx        # Dashboard
│   ├── email.tsx        # Smart Email Generator
│   ├── meetings.tsx     # Meeting Notes Summarizer
│   ├── planner.tsx      # AI Task Planner
│   └── settings.tsx     # Settings
├── styles.css           # Tailwind CSS v4 theme and global styles
└── start.ts             # TanStack Start app configuration
```

## Responsible AI

> AI-generated content may contain errors or omissions. Always review and verify AI outputs before using them for important workplace decisions. Do not enter confidential, private, financial, password, or sensitive personal information.

This application is designed to assist, not replace, human judgement. All generated content should be reviewed before it is used in a professional setting.

## Responsive Design

The application is built to work correctly across:

- Desktop
- Tablet
- Mobile phone

The layout adapts automatically so that content is not cut off, buttons remain usable, input fields fit the screen, AI results remain readable, and navigation works smoothly on smaller screens.

## Author

Built by Puseletso Ramolefo as part of a Capaciti project presentation.

## License

This project was built with [Lovable](https://lovable.dev). The source code is provided for demonstration and educational purposes.
