
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { OnboardingState, OnboardingContextValue, OnboardingStep } from '../../types/onboarding';
import { getTour } from '../../constants/onboardingSteps';
import { Spotlight } from './Spotlight';
import { OnboardingTooltip } from './Tooltip';
import { supabase } from '../../utils/supabase/client';

const ONBOARDING_TABLE = 'onboarding_progress';

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

    useEffect(() => {
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

        if (!userId) {
            setHasLoadedState(true);
            return;
        }

        const loadCompletedTours = async () => {
            try {
                const { data, error } = await supabase
                    .from(ONBOARDING_TABLE)
                    .select('tour_id, completed')
                    .eq('user_id', userId);

                if (error) throw error;

                const completed: Record<string, boolean> = {};
                data?.forEach((row: any) => {
                    if (row.completed) {
                        completed[row.tour_id] = true;
                    }
                });

                localStorage.setItem(localKey, JSON.stringify(completed));
                setState(prev => ({ ...prev, completedTours: completed }));
                setHasLoadedState(true);

                // if (Object.keys(completed).length === 0 && !localCompleted) {
                //     setTimeout(() => startTour('intro'), 1500);
                // }
            } catch (error) {
                console.error('Error loading onboarding state:', error);
                setHasLoadedState(true);
            }
        };

        loadCompletedTours();
    }, [userId]);

    const saveTourCompletion = useCallback(async (pageId: string, skipped = false) => {
        if (!userId) return;

        try {
            await supabase.from(ONBOARDING_TABLE).upsert({
                user_id: userId,
                tour_id: pageId,
                completed: true,
                skipped: skipped,
                completed_at: new Date().toISOString()
            }, { onConflict: 'user_id, tour_id' }); // Assuming composite key or just insert

            // Note: If table doesn't have unique constraint, upsert might duplicate.
            // But we assume proper schema.
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
        nextStep();
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
        if (userId) {
            try {
                await supabase
                    .from(ONBOARDING_TABLE)
                    .delete()
                    .eq('user_id', userId)
                    .eq('tour_id', pageId);
            } catch (error) {
                console.error('Error resetting tour:', error);
            }
        }

        setState(prev => {
            const newCompleted = { ...prev.completedTours };
            delete newCompleted[pageId];
            return { ...prev, completedTours: newCompleted };
        });

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
