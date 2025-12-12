import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { OnboardingState, OnboardingContextValue, OnboardingStep } from '../../types/onboarding';
import { getTour, ONBOARDING_TOURS } from '../../constants/onboardingSteps';
import { Spotlight } from './Spotlight';
import { OnboardingTooltip } from './Tooltip';
import { firestore } from '../../utils/firebase/core';

const ONBOARDING_COLLECTION = 'onboarding';

const defaultState: OnboardingState = {
    activeTour: null,
    currentStep: 0,
    isActive: false,
    completedTours: {}
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export const useOnboardingContext = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboardingContext must be used within OnboardingProvider');
    }
    return context;
};

interface OnboardingProviderProps {
    children: React.ReactNode;
    userId: string | null;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children, userId }) => {
    const [state, setState] = useState<OnboardingState>(defaultState);
    const [hasLoadedState, setHasLoadedState] = useState(false);

    // Load completed tours from localStorage first (instant), then sync with Firestore
    useEffect(() => {
        // Load from localStorage immediately
        const localKey = `onboarding_completed_${userId || 'guest'}`;
        const localCompleted = localStorage.getItem(localKey);
        if (localCompleted) {
            try {
                const parsed = JSON.parse(localCompleted);
                setState(prev => ({ ...prev, completedTours: parsed }));
                setHasLoadedState(true);
            } catch (e) {
                console.error('Error parsing local onboarding state:', e);
            }
        }

        if (!userId || !firestore) {
            setHasLoadedState(true);
            return;
        }

        const loadCompletedTours = async () => {
            try {
                const snapshot = await firestore
                    .collection('users')
                    .doc(userId)
                    .collection(ONBOARDING_COLLECTION)
                    .get();

                const completed: Record<string, boolean> = {};
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    if (data.completed) {
                        completed[doc.id] = true;
                    }
                });

                // Update localStorage for next time
                localStorage.setItem(localKey, JSON.stringify(completed));

                setState(prev => ({ ...prev, completedTours: completed }));
                setHasLoadedState(true);

                // Auto-trigger intro tour ONLY for genuinely new users (no completed tours at all)
                if (Object.keys(completed).length === 0 && !localCompleted) {
                    setTimeout(() => startTour('intro'), 1500);
                }
            } catch (error) {
                console.error('Error loading onboarding state:', error);
                setHasLoadedState(true);
            }
        };

        loadCompletedTours();
    }, [userId]);

    // Save tour completion to Firestore
    const saveTourCompletion = useCallback(async (pageId: string, skipped = false) => {
        if (!userId || !firestore) return;

        try {
            await firestore
                .collection('users')
                .doc(userId)
                .collection(ONBOARDING_COLLECTION)
                .doc(pageId)
                .set({
                    completed: true,
                    completedAt: new Date().toISOString(),
                    skipped
                });
        } catch (error) {
            console.error('Error saving onboarding state:', error);
        }
    }, [userId]);

    const startTour = useCallback((pageId: string) => {
        const tour = getTour(pageId);
        if (!tour || tour.steps.length === 0) return;

        setState(prev => ({
            ...prev,
            activeTour: pageId,
            currentStep: 0,
            isActive: true
        }));
    }, []);

    const nextStep = useCallback(() => {
        setState(prev => {
            const tour = prev.activeTour ? getTour(prev.activeTour) : null;
            if (!tour) return prev;

            const nextIndex = prev.currentStep + 1;
            if (nextIndex >= tour.steps.length) {
                // Tour complete
                saveTourCompletion(prev.activeTour!, false);
                return {
                    ...prev,
                    isActive: false,
                    activeTour: null,
                    currentStep: 0,
                    completedTours: { ...prev.completedTours, [prev.activeTour!]: true }
                };
            }

            return { ...prev, currentStep: nextIndex };
        });
    }, [saveTourCompletion]);

    const prevStep = useCallback(() => {
        setState(prev => ({
            ...prev,
            currentStep: Math.max(0, prev.currentStep - 1)
        }));
    }, []);

    const skipTour = useCallback(() => {
        setState(prev => {
            if (prev.activeTour) {
                saveTourCompletion(prev.activeTour, true);
            }
            return {
                ...prev,
                isActive: false,
                activeTour: null,
                currentStep: 0,
                completedTours: prev.activeTour
                    ? { ...prev.completedTours, [prev.activeTour]: true }
                    : prev.completedTours
            };
        });
    }, [saveTourCompletion]);

    const completeTour = useCallback(() => {
        nextStep(); // Same as next on last step
    }, [nextStep]);

    const getCurrentStep = useCallback((): OnboardingStep | null => {
        if (!state.activeTour) return null;
        const tour = getTour(state.activeTour);
        return tour?.steps[state.currentStep] || null;
    }, [state.activeTour, state.currentStep]);

    const getTourProgress = useCallback(() => {
        const tour = state.activeTour ? getTour(state.activeTour) : null;
        return {
            current: state.currentStep,
            total: tour?.steps.length || 0
        };
    }, [state.activeTour, state.currentStep]);

    const isPageTourCompleted = useCallback((pageId: string): boolean => {
        return state.completedTours[pageId] === true;
    }, [state.completedTours]);

    const resetTour = useCallback(async (pageId: string) => {
        // Remove completion from Firestore
        if (userId && firestore) {
            try {
                await firestore
                    .collection('users')
                    .doc(userId)
                    .collection(ONBOARDING_COLLECTION)
                    .doc(pageId)
                    .delete();
            } catch (error) {
                console.error('Error resetting tour:', error);
            }
        }

        setState(prev => {
            const newCompleted = { ...prev.completedTours };
            delete newCompleted[pageId];
            return { ...prev, completedTours: newCompleted };
        });

        // Start the tour
        startTour(pageId);
    }, [userId, startTour]);

    const value: OnboardingContextValue = {
        state,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        completeTour,
        getCurrentStep,
        getTourProgress,
        isPageTourCompleted,
        resetTour
    };

    const currentStep = getCurrentStep();
    const tour = state.activeTour ? getTour(state.activeTour) : null;

    return (
        <OnboardingContext.Provider value={value}>
            {children}

            {/* Render spotlight and tooltip when tour is active */}
            {state.isActive && currentStep && (
                <>
                    <Spotlight
                        targetSelector={currentStep.selector}
                        padding={currentStep.highlightPadding || 8}
                        isActive={true}
                    />
                    <OnboardingTooltip
                        step={currentStep}
                        currentIndex={state.currentStep}
                        totalSteps={tour?.steps.length || 0}
                        onNext={nextStep}
                        onPrev={prevStep}
                        onSkip={skipTour}
                        isFirst={state.currentStep === 0}
                        isLast={state.currentStep === (tour?.steps.length || 1) - 1}
                    />
                </>
            )}
        </OnboardingContext.Provider>
    );
};
