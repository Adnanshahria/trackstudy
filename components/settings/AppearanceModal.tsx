
import React from 'react';
import { Modal } from '../ui/Modal';
import { UserSettings } from '../../types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    settings: UserSettings;
    onUpdateSettings: (s: UserSettings) => void;
}

export const AppearanceModal: React.FC<Props> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
    const glowOptions = [
        { id: 'red', name: 'Red Glow', colorClass: 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]' },
        { id: 'green', name: 'Green Glow', colorClass: 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]' },
        { id: 'violet', name: 'Violet Glow', colorClass: 'bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.6)]' },
        { id: 'none', name: 'No Glow', colorClass: 'bg-slate-400' },
    ];

    const currentGlow = settings.glowColor || 'green';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Appearance Settings">
            <div className="flex flex-col gap-6">
                {/* Theme Toggle Section */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Theme Mode</span>
                        <span className="text-[10px] text-slate-600 dark:text-slate-400">Switch between Light and Dark</span>
                    </div>
                    <button 
                        onClick={() => onUpdateSettings({ ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' })}
                        className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-black/40 border border-slate-300 dark:border-white/10 text-xs font-bold flex items-center gap-2 transition-all hover:scale-105"
                    >
                        {settings.theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                    </button>
                </div>

                <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Card Border Glow</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {glowOptions.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => onUpdateSettings({ ...settings, glowColor: opt.id as any })}
                                className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${currentGlow === opt.id ? 'bg-blue-50 dark:bg-white/10 border-blue-500 ring-1 ring-blue-500' : 'bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                            >
                                <div className={`w-6 h-6 rounded-full border border-white/20 ${opt.colorClass}`}></div>
                                <span className={`text-xs font-bold ${currentGlow === opt.id ? 'text-blue-600 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {opt.name}
                                </span>
                            </button>
                        ))}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">Changes the neon glow color of all glass cards and panels.</p>
                </div>
            </div>
        </Modal>
    );
};
