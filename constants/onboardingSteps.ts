// Onboarding Step Definitions
// JSON-driven configuration for each page's guided tour

import { OnboardingTour } from '../types/onboarding';

// Global intro tour (shown on first login)
export const INTRO_TOUR: OnboardingTour = {
    pageId: 'intro',
    steps: [
        {
            id: 'welcome',
            selector: '#app-root',
            title: 'Welcome to TrackStudy! 🎓',
            description: 'Your personal study progress tracker. Let me show you around!',
            position: 'bottom',
            showSkip: true,
            nextText: "Let's Go!"
        },
        {
            id: 'sidebar',
            selector: '.sidebar',
            title: 'Subject Navigation',
            description: 'Switch between subjects here. Each subject tracks your progress separately.',
            position: 'right'
        },
        {
            id: 'progress',
            selector: '.hero-section',
            title: 'Progress Overview',
            description: 'See your overall progress at a glance with weighted calculations.',
            position: 'bottom'
        },
        {
            id: 'syllabus',
            selector: '.syllabus-section',
            title: 'Chapter Tracking',
            description: 'Click any cell to update your progress. Each column represents a study resource.',
            position: 'top'
        },
        {
            id: 'done',
            selector: '#app-root',
            title: "You're All Set! ✨",
            description: "Start tracking your study progress. You can view this tutorial again from Settings.",
            position: 'bottom',
            nextText: 'Start Studying'
        }
    ]
};

// Dashboard page tour
export const DASHBOARD_TOUR: OnboardingTour = {
    pageId: 'dashboard',
    steps: [
        {
            id: 'progress-bars',
            selector: '.performance-cards',
            title: 'Progress Bars',
            description: 'Track progress by category: Concept, Practice, and Revision.',
            position: 'bottom'
        },
        {
            id: 'subject-list',
            selector: '.subject-list',
            title: 'Subject Selector',
            description: 'Click any subject to view its detailed syllabus.',
            position: 'right'
        }
    ]
};

// Syllabus page tour
export const SYLLABUS_TOUR: OnboardingTour = {
    pageId: 'syllabus',
    steps: [
        {
            id: 'chapter-table',
            selector: '.syllabus-table',
            title: 'Chapter Progress Table',
            description: 'Each row is a chapter. Click cells to cycle through progress: 0% → 20% → 40% → 60% → 80% → 100%',
            position: 'top'
        },
        {
            id: 'status-button',
            selector: '.status-button',
            title: 'Status Buttons',
            description: 'Click to update progress. Colors indicate completion level.',
            position: 'bottom',
            highlightPadding: 10
        },
        {
            id: 'note-icon',
            selector: '.note-icon',
            title: 'Notes & History',
            description: 'Add study notes and view change history for each cell.',
            position: 'left'
        }
    ]
};

// Settings tour
export const SETTINGS_TOUR: OnboardingTour = {
    pageId: 'settings',
    steps: [
        {
            id: 'theme',
            selector: '.theme-toggle',
            title: 'Theme Settings',
            description: 'Switch between dark and light themes.',
            position: 'bottom'
        },
        {
            id: 'weights',
            selector: '.weight-config',
            title: 'Progress Weights',
            description: 'Customize how each resource contributes to overall progress.',
            position: 'top'
        }
    ]
};

// All tours indexed by pageId
export const ONBOARDING_TOURS: Record<string, OnboardingTour> = {
    intro: INTRO_TOUR,
    dashboard: DASHBOARD_TOUR,
    syllabus: SYLLABUS_TOUR,
    settings: SETTINGS_TOUR
};

// Get tour by page ID
export const getTour = (pageId: string): OnboardingTour | null => {
    return ONBOARDING_TOURS[pageId] || null;
};
