
import React from 'react';
import { Button } from '../ui/Button';

export const WelcomeHero: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in mt-10">
        <div className="w-24 h-24 glass-card rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-900/20 dark:shadow-black/40 bg-gradient-to-br from-white/10 to-white/5">
            <span className="text-5xl drop-shadow-lg">🚀</span>
        </div>
        <h2 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">TrackStudy</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8 text-lg font-medium">Track your syllabus, crush your goals, and master every chapter with your personal weighted study tracker.</p>
        <Button onClick={onLogin} className="px-10 py-4 text-base rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold transform transition hover:scale-105 animate-pulse-slow border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)] hover:shadow-[0_0_30px_rgba(244,63,94,0.7)]">
            Go To Your Personal Study Tracker
        </Button>
    </div>
);
