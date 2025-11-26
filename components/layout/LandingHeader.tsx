
import React from 'react';
import { SettingsMenu } from '../settings/SettingsMenu';

export const LandingHeader: React.FC<{ onDev: () => void, onLogin: () => void, onGuide: () => void, theme: any, onToggleTheme: () => void }> = ({ onDev, onGuide, theme, onToggleTheme }) => (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/5 transition-colors duration-300 no-print">
        <div className="glass-card border-none rounded-none bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
             <div className="max-w-screen-xl mx-auto flex justify-between items-center py-3 px-4">
                <div className="flex items-center gap-3">
                    <div onClick={onDev} className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-black shadow-lg cursor-pointer hover:scale-105 transition-transform">TS</div>
                    <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">TrackStudy</h1>
                </div>
                <div className="flex items-center gap-3">
                     <SettingsMenu userId={null} onLogout={() => {}} onToggleTheme={onToggleTheme} theme={theme} onOpenGuide={onGuide} onOpenDevModal={onDev} onOpenAppearance={() => {}} />
                </div>
             </div>
        </div>
    </header>
);
