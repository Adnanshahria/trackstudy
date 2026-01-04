import React from 'react';
import { LandingHeader } from '../components/layout/LandingHeader';
import { WelcomeHero } from '../components/layout/WelcomeHero';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
    onDev: () => void;
    onGuide: () => void;
    theme: 'dark' | 'light';
    onToggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onDev, onGuide, theme, onToggleTheme }) => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/auth');
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <LandingHeader
                onDev={onDev}
                onLogin={handleLoginClick}
                onGuide={onGuide}
                theme={theme}
                onToggleTheme={onToggleTheme}
            />
            <main className="flex-1 overflow-y-auto">
                <WelcomeHero onLogin={handleLoginClick} />
            </main>
        </div>
    );
};
