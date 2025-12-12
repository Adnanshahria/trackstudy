/**
 * useOnboarding - Page-level hook for triggering and controlling onboarding
 * 
 * Usage: const { triggerIfNew, isCompleted, showAgain } = useOnboarding('syllabus');
 */

import { useEffect } from 'react';
import { useOnboardingContext } from '../components/onboarding/OnboardingProvider';
import { getTour } from '../constants/onboardingSteps';

interface UseOnboardingResult {
    isActive: boolean;
    isCompleted: boolean;
    triggerIfNew: () => void;
    showAgain: () => void;
    skip: () => void;
}

export const useOnboarding = (pageId: string): UseOnboardingResult => {
    const {
        state,
        startTour,
        skipTour,
        isPageTourCompleted,
        resetTour
    } = useOnboardingContext();

    const isCompleted = isPageTourCompleted(pageId);
    const isActive = state.isActive && state.activeTour === pageId;

    // Auto-trigger on first visit (if tour exists and not completed)
    const triggerIfNew = () => {
        const tour = getTour(pageId);
        if (tour && !isCompleted && !isActive && !state.isActive) {
            startTour(pageId);
        }
    };

    // Manually show tutorial again
    const showAgain = () => {
        resetTour(pageId);
    };

    return {
        isActive,
        isCompleted,
        triggerIfNew,
        showAgain,
        skip: skipTour
    };
};

/**
 * useAutoOnboarding - Automatically trigger tour on mount if not completed
 */
export const useAutoOnboarding = (pageId: string, enabled = true) => {
    const { triggerIfNew, isCompleted } = useOnboarding(pageId);

    useEffect(() => {
        if (enabled && !isCompleted) {
            // Delay to allow page to render
            const timer = setTimeout(() => {
                triggerIfNew();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [enabled, isCompleted, triggerIfNew]);
};
