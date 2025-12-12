
import React from 'react';
import { SettingsMenu } from '../settings/SettingsMenu';

export const LandingHeader: React.FC<{ onDev: () => void, onLogin: () => void, onGuide: () => void, theme: any, onToggleTheme: () => void }> = ({ onDev, onGuide, theme, onToggleTheme }) => (
    <div className="fixed top-6 right-6 z-50 no-print">
        <SettingsMenu
            userId={null}
            onLogout={async () => { }}
            onToggleTheme={onToggleTheme}
            theme={theme}
            onOpenGuide={onGuide}
            onOpenDevModal={onDev}
            onOpenAppearance={() => { }}
            onForceSync={() => { }}
            className="bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl hover:bg-white/20 dark:hover:bg-black/40 text-slate-800 dark:text-white"
        />
    </div>
);
