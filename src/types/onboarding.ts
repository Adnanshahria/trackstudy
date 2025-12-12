// Onboarding Types
// Server-controlled guided tour system

export interface OnboardingStep {
    id: string;
    selector: string;          // CSS selector for target element
    title: string;             // Step title
    description: string;       // Step description
    position?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
    highlightPadding?: number; // Extra padding around highlight
    showSkip?: boolean;        // Show skip button
    nextText?: string;         // Custom next button text
    prevText?: string;         // Custom prev button text
}

export interface OnboardingTour {
    pageId: string;
    steps: OnboardingStep[];
    version?: number;          // For cache invalidation
}

export interface OnboardingState {
    activeTour: string | null;
    currentStep: number;
    isActive: boolean;
    completedTours: Record<string, boolean>;
}

export interface OnboardingContextValue {
    state: OnboardingState;
    startTour: (pageId: string) => void;
    nextStep: () => void;
    prevStep: () => void;
    skipTour: () => void;
    completeTour: () => void;
    getCurrentStep: () => OnboardingStep | null;
    getTourProgress: () => { current: number; total: number };
    isPageTourCompleted: (pageId: string) => boolean;
    resetTour: (pageId: string) => void;
}

// Firestore document structure
export interface OnboardingUserDoc {
    completed: boolean;
    completedAt?: string;
    skipped?: boolean;
}
