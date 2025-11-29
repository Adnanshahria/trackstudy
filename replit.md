# TrackStudy - Personal Study Tracker

## Overview
TrackStudy is a comprehensive study tracking dashboard built with React, Vite, and Firebase. It allows students to track their syllabus progress, monitor weighted scores across subjects, maintain study streaks, and visualize their academic performance.

**Current State**: Fully functional study tracking application with Firebase authentication and real-time data synchronization.

## Recent Changes
- **2025-11-29**: UI/UX Improvements and Print Optimization
  - Moved glow effect from Paper toggle buttons to table headers for better visual hierarchy
  - Compact table columns: reduced min-width (45px) and padding for better space efficiency
  - Advanced print logic: landscape mode with single-paper or side-by-side dual-paper layouts
  - Conditional Add Column button: only visible in Edit Mode for cleaner default UI
  - Always-visible note icons with circular border styling (amber for notes, slate for empty)
  - Print table headers now bold with improved styling
- **2025-11-29**: PWABuilder Store Ready Compliance
  - Added custom TrackStudy logo as 192x192 and 512x512 PNG icons
  - Icons configured with separate "any" and "maskable" purposes for Play Store
  - Added mobile (1080x1920) and desktop (1920x1080) screenshots
  - Updated manifest with: id, scope, detailed description, portrait orientation
  - Added categories: education, productivity, utilities
  - Added iarc_rating_id for content rating
  - Updated apple-touch-icon to use new PNG icon
  - Service worker properly caches start URL for offline support
- **2024-11-29**: Major UI and Feature Enhancements
  - Modal transparency updated to 80% opacity with backdrop-blur
  - Add/Note buttons now always visible for better discoverability
  - Glowing headers added for Paper 1/Paper 2 tables
  - Drag-and-drop subject reordering with stable order persistence
  - Sync toast notifications (0.35s duration) guarded by authentication
  - Note Modal ID now displays dynamic format: "Subject / Chapter / Column"
  - PWA support: manifest.json, service worker, standalone display mode
  - Fixed subject order duplicates and toast authentication guards
- **2024-11-29**: Configured for Replit environment
  - Updated Vite dev server to run on port 5000 with host 0.0.0.0
  - Configured workflow for automatic dev server startup
  - Installed all npm dependencies

## Project Architecture

### Tech Stack
- **Frontend**: React 19.2.0 with TypeScript
- **Build Tool**: Vite 6.2.0
- **Styling**: TailwindCSS (via CDN)
- **Authentication**: Firebase Auth
- **Database**: Firebase Realtime Database
- **Deployment Target**: Static site (Vite build)

### Project Structure
```
/
├── components/          # React components organized by feature
│   ├── auth/           # Authentication modals and forms
│   ├── guide/          # App guide and changelog
│   ├── hero/           # Dashboard hero section (progress, streaks, weights)
│   ├── layout/         # Header, landing, and skeleton components
│   ├── settings/       # Appearance and settings modals
│   ├── sidebar/        # Subject list, performance widgets
│   ├── syllabus/       # Main syllabus tracking interface
│   └── ui/             # Reusable UI components
├── constants/          # Firebase config and app constants
├── hooks/              # Custom React hooks
│   ├── data/          # Data manipulation hooks
│   ├── sync/          # Firebase sync and migration hooks
│   └── ui/            # UI state management hooks
├── services/           # Firebase and auth services
├── utils/              # Utility functions
│   ├── calc/          # Progress and streak calculations
│   └── firebase/      # Firebase helpers and writers
├── App.tsx             # Main application component
├── index.tsx           # React entry point
├── index.html          # HTML template
└── vite.config.ts      # Vite configuration
```

### Key Features
1. **Authentication**: Firebase-based user authentication with guest mode
2. **Syllabus Tracking**: Multi-subject syllabus management with chapter-level tracking
3. **Progress Analytics**: Weighted progress calculation across subjects
4. **Study Streaks**: Daily streak tracking and countdown timers
5. **Performance Widgets**: Visual performance indicators and graphs
6. **Theme Support**: Dark/light mode with glassmorphism design
7. **Print Support**: Optimized print layouts for syllabus tables
8. **Drag-and-Drop**: Reorder subjects via drag-and-drop in sidebar
9. **PWA Support**: Installable as standalone app on mobile/desktop
10. **Sync Toasts**: Real-time sync confirmation with 0.35s toast notifications

### Firebase Configuration
- Firebase project: `my-study-dashboard`
- Services used: Authentication, Realtime Database
- Config stored in: `constants/firebaseConfig.ts`

### Development
- **Dev Server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build` (outputs to `dist/`)
- **Preview**: `npm run preview`

### Deployment Configuration
- **Type**: Static site
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Public Directory**: `dist`

## User Preferences
None specified yet.

## Notes
- The app uses Firebase Realtime Database for data persistence
- Authentication is optional (supports guest mode)
- All styling is done via TailwindCSS loaded from CDN
- The app includes comprehensive print optimization for syllabus tables
