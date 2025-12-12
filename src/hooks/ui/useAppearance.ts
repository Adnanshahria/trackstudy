import { useEffect } from 'react';
import { UserSettings } from '../../types';

export const useAppearance = (settings: UserSettings) => {
    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;
        const color = settings.glowColor || 'red';

        // Reset class
        body.classList.remove('no-glow');

        if (color === 'red') {
            root.style.setProperty('--glow-rgb', '244, 63, 94'); // Rose-500
            root.style.setProperty('--border-opacity', '0.4');
            root.style.setProperty('--shadow-opacity', '0.15');
        } else if (color === 'green') {
            root.style.setProperty('--glow-rgb', '16, 185, 129'); // Emerald-500
            root.style.setProperty('--border-opacity', '0.4');
            root.style.setProperty('--shadow-opacity', '0.15');
        } else if (color === 'violet') {
            root.style.setProperty('--glow-rgb', '139, 92, 246'); // Violet-500
            root.style.setProperty('--border-opacity', '0.4');
            root.style.setProperty('--shadow-opacity', '0.15');
        } else if (color === 'none') {
            body.classList.add('no-glow');
        }

    }, [settings.glowColor]);
};