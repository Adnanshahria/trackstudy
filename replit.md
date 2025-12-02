# TrackStudy - Personal Study Tracker

## Overview
TrackStudy is a comprehensive study tracking dashboard built with React, Vite, and Firebase. It allows students to track their syllabus progress, monitor weighted scores across subjects, maintain study streaks, and visualize their academic performance.

**Current State**: Fully functional study tracking application with Firebase authentication and real-time data synchronization.

## Recent Changes
- **2025-12-02**: Firebase Domain Authorization & Mobile Chrome Fix
  - ✅ Fixed mobile Chrome desktop mode - now shows proper side-by-side layout (lg: breakpoint = 1024px)
  - ✅ Mobile Chrome was reporting 1000px viewport, so xl:(1280px) wasn't triggering - lowered to lg:
  - ✅ Added Firebase Domain Error screen with setup instructions
  - ✅ Users deploying to new domains see helpful error + step-by-step Firebase whitelist guide
  - ✅ "Continue as Guest" option for offline exploration without Firebase
- **2025-12-01**: Responsive Design Consolidated - Mobile & Desktop Only
  - ✅ Removed tablet breakpoint view (lg:)
  - ✅ Implemented true desktop-only view using xl: breakpoint (1280px)
  - ✅ Mobile mode shows stacked layout (sidebar below syllabus)
  - ✅ Desktop mode shows side-by-side layout (sidebar left, syllabus right)
  - ✅ Fixed desktop mode no longer looks like tablet
  - ✅ Breakpoints consolidated: xl: for desktop, default for mobile
- **2025-12-01**: Universal Deployment Ready - Multi-Platform Support
  - ✅ App is now deployable to ANY domain (GitHub Pages, Vercel, Netlify, AWS, etc)
  - ✅ GitHub Actions workflow configured for automatic GitHub Pages deployment
  - ✅ Created comprehensive DEPLOYMENT_GUIDE.md with step-by-step instructions for all platforms
  - ✅ Fixed vite.config for universal hosting compatibility (removed homepage lock)
  - ✅ Updated Firebase error messages for better domain setup guidance
  - ✅ Package.json version updated to 1.0.0, homepage field removed for multi-domain support
  - ✅ All files verified: builds successfully without errors
- **2025-12-01**: Password Change & Recovery - Final Implementation
  - FIXED: Implemented proper Firebase reauthentication for secure password updates
  - FIXED: Password change now updates both Firebase Auth AND Firestore, then signs out user
  - FIXED: Users can now login successfully with new passwords after change
  - FIXED: Forgot password properly retrieves saved passwords from Firestore
  - NEW: Change password requires old password verification with reauthentication
  - NEW: Added frosted glass button styling around all auth buttons
- **2025-12-01**: Security and Logic Audit Complete
  - SECURITY FIX: Removed plaintext password storage in Firebase auth
  - Fixed status cycle logic (now correctly 0-5 range instead of 0-6)
  - Added comprehensive input validation to all data action hooks
  - Fixed race conditions in Firebase sync hooks with proper cleanup
  - Enhanced debounce utility with cancel/flush methods
  - Added null/undefined/NaN guards in calculation utilities
  - Improved error messages in authentication handlers
- **2025-11-29**: Note Icons and Print View Refinements
  - Refined note icons: smaller (14px), positioned top-right (2px offset), semi-transparent (opacity 0.4 default, 1 on hover)
  - Note icons now have transparent background with thin soft border for minimal distraction
  - Added padding-right to table cells to prevent text overlap with icons
  - Print CSS uses CSS Grid for proper layout: Paper 1 left, Paper 2 right (1fr 1fr)
  - Single paper printing: full width when only one paper selected
  - Note icons hidden in print view
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
- **Responsive Design**: Mobile-First (mobile stacked view, desktop side-by-side at 1280px+)

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

## Version Management
**Automatic Version Syncing**: Version is now centralized in `constants/version.ts`
- Update `APP_VERSION` and `VERSION_LABEL` once to sync across app
- Developer Modal automatically shows the latest version
- Changelog automatically displays the latest version
- No more manual duplicate updates needed!

## Notes
- The app uses Firebase Realtime Database for data persistence
- Authentication is optional (supports guest mode)
- All styling is done via TailwindCSS loaded from CDN
- The app includes comprehensive print optimization for syllabus tables
