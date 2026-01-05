# Frontend Architecture Documentation

## Overview
The frontend is built using **React + Vite + TypeScript**, prioritizing performance, type safety, and a premium "Glassmorphism" aesthetic.

## Directory Structure
- `/src/components`: Reusable UI components.
    - `/Layout`: Sidebar, Layout wrapper.
    - `/Applications`: KanbanBoard, ApplicationCard, ApplicationModal, ApplicationTable.
- `/src/pages`: Main page views (Dashboard, Analytics, etc.).
- `/src/store`: Zustand stores for global state management.
- `/src/types`: Centralized TypeScript interfaces and types.
- `/src/constants`: Configuration for statuses, colors, and API endpoints.
- `/src/data`: Mock data for initial development and testing.

## Design System
We use a centralized CSS variable system defined in `index.css`.
- **Primary Color**: Amethyst Purple (`#8b5cf6`)
- **Accent Color**: Electric Pink (`#d946ef`)
- **Theme**: Dark Mode (default) with deep blues and purples.
- **Glassmorphism**: Reusable `.glass` class for cards and overlays.

## Key Features Implementation
### 1. State Management (Zustand)
Divided into three slices:
- `useAuthStore`: Handles user login state and profile.
- `useApplicationStore`: Manages the list of job applications, filtering, and sorting.
- `useUIStore`: Manages sidebar state and theme preference.

### 2. Kanban Board
The Kanban board groups applications by their current status.
- **Mock Drag and Drop**: Currently uses a simplified native HTML5 DnD implementation.
- **Refinement Recommendation**: Consider upgrading to `@dnd-kit/core` for more robust touch support and animations.

### 3. Application Modal
A complex form to capture job details.
- **Validation**: Ensures required fields like Company Name and Position are filled.
- **Integration**: Automatically updates the store and adds a mock "Fit Score" upon creation.

## Build and Quality Control
- **TypeScript**: Configured with `verbatimModuleSyntax: true`. All imports must use `import type` where applicable.
- **Linting**: Strict rules for unused locals and parameters (prefixed with `_` to ignore).

## Environment Variables
Create a `.env` file in the `frontend` root:
```env
VITE_API_URL=http://localhost:8080/api
```
