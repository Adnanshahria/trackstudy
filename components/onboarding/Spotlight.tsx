import React, { useEffect, useState, useRef } from 'react';

interface SpotlightProps {
    targetSelector: string;
    padding?: number;
    isActive: boolean;
    onClick?: () => void;
}

interface TargetRect {
    top: number;
    left: number;
    width: number;
    height: number;
}

export const Spotlight: React.FC<SpotlightProps> = ({
    targetSelector,
    padding = 8,
    isActive,
    onClick
}) => {
    const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isActive) {
            setTargetRect(null);
            return;
        }

        const updatePosition = () => {
            const element = document.querySelector(targetSelector);
            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect({
                    top: rect.top - padding,
                    left: rect.left - padding,
                    width: rect.width + padding * 2,
                    height: rect.height + padding * 2
                });

                // Scroll element into view if needed
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [targetSelector, padding, isActive]);

    if (!isActive || !targetRect) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[100] pointer-events-auto"
            onClick={onClick}
            style={{ backgroundColor: 'transparent' }}
        >
            {/* Dark overlay with spotlight cutout using CSS clip-path */}
            <svg
                className="absolute inset-0 w-full h-full"
                style={{ pointerEvents: 'none' }}
            >
                <defs>
                    <mask id="spotlight-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <rect
                            x={targetRect.left}
                            y={targetRect.top}
                            width={targetRect.width}
                            height={targetRect.height}
                            rx="8"
                            fill="black"
                        />
                    </mask>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="rgba(0, 0, 0, 0.75)"
                    mask="url(#spotlight-mask)"
                />
            </svg>

            {/* Highlight border animation */}
            <div
                className="absolute rounded-lg border-2 border-blue-400 animate-pulse pointer-events-none"
                style={{
                    top: targetRect.top,
                    left: targetRect.left,
                    width: targetRect.width,
                    height: targetRect.height,
                    boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.3), 0 0 20px rgba(59, 130, 246, 0.5)'
                }}
            />
        </div>
    );
};
