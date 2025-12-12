
import React from 'react';
import { Button } from '../ui/Button';

export const WelcomeHero: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in mt-10">
        <div className="w-32 h-32 mb-8 rounded-3xl shadow-2xl shadow-blue-500/20 dark:shadow-emerald-500/20 animate-fade-in hover:scale-110 transition-transform duration-500">
            <img src="./icons/icon-512.png" alt="TrackStudy Logo" className="w-full h-full object-contain drop-shadow-2xl" />
        </div>
        <h2 className="text-4xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">TrackStudy</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8 text-lg font-medium">Track your syllabus, crush your goals, and master every chapter with your personal weighted study tracker.</p>
        <Button onClick={onLogin} className="px-10 py-4 text-base rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold transform transition hover:scale-105 animate-pulse-slow border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)] hover:shadow-[0_0_30px_rgba(244,63,94,0.7)]">
            Go To Your Personal Study Tracker
        </Button>
    </div>
);
