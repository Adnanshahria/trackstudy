import React, { useEffect, useState, useRef } from 'react';
import { OnboardingStep } from '../../types/onboarding';

interface TooltipProps {
    step: OnboardingStep;
    currentIndex: number;
    totalSteps: number;
    onNext: () => void;
    onPrev: () => void;
    onSkip: () => void;
    isFirst: boolean;
    isLast: boolean;
}

interface Position {
    top: number;
    left: number;
}

export const OnboardingTooltip: React.FC<TooltipProps> = ({
    step,
    currentIndex,
    totalSteps,
    onNext,
    onPrev,
    onSkip,
    isFirst,
    isLast
}) => {
    const [position, setPosition] = useState<Position>({ top: 0, left: 0 });
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const calculatePosition = () => {
            const target = document.querySelector(step.selector);
            if (!target || !tooltipRef.current) return;

            const targetRect = target.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const padding = 16;

            let top = 0;
            let left = 0;

            const pos = step.position || 'auto';

            switch (pos) {
                case 'top':
                    top = targetRect.top - tooltipRect.height - padding;
                    left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                    break;
                case 'bottom':
                    top = targetRect.bottom + padding;
                    left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
                    break;
                case 'left':
                    top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                    left = targetRect.left - tooltipRect.width - padding;
                    break;
                case 'right':
                    top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
                    left = targetRect.right + padding;
                    break;
                default: // auto - prefer bottom, fallback to top
                    if (targetRect.bottom + tooltipRect.height + padding < window.innerHeight) {
                        top = targetRect.bottom + padding;
                    } else {
                        top = targetRect.top - tooltipRect.height - padding;
                    }
                    left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
            }

            // Keep within viewport
            left = Math.max(16, Math.min(left, window.innerWidth - tooltipRect.width - 16));
            top = Math.max(16, Math.min(top, window.innerHeight - tooltipRect.height - 16));

            setPosition({ top, left });
        };

        // Delay to allow for DOM updates
        const timer = setTimeout(calculatePosition, 100);
        window.addEventListener('resize', calculatePosition);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', calculatePosition);
        };
    }, [step]);

    return (
        <div
            ref={tooltipRef}
            className="fixed z-[110] w-80 max-w-[90vw] animate-[fadeInUp_0.3s_ease-out]"
            style={{ top: position.top, left: position.left }}
        >
            <div className="bg-slate-800 dark:bg-slate-900 rounded-2xl shadow-2xl shadow-black/50 border border-white/10 overflow-hidden">
                {/* Progress indicator */}
                <div className="h-1 bg-slate-700">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
                    />
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
                </div>

                {/* Navigation */}
                <div className="px-5 py-3 bg-slate-700/50 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                        {currentIndex + 1} of {totalSteps}
                    </span>

                    <div className="flex items-center gap-2">
                        {step.showSkip !== false && !isLast && (
                            <button
                                onClick={onSkip}
                                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                            >
                                Skip
                            </button>
                        )}

                        {!isFirst && (
                            <button
                                onClick={onPrev}
                                className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
                            >
                                {step.prevText || 'Back'}
                            </button>
                        )}

                        <button
                            onClick={onNext}
                            className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg transition-all shadow-lg shadow-blue-500/25"
                        >
                            {isLast ? (step.nextText || 'Finish') : (step.nextText || 'Next')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
