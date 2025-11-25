import React, { useState, useRef, useEffect } from 'react';

interface SettingsMenuProps {
    userId: string | null;
    onLogout: () => void;
    onToggleTheme: () => void;
    theme: 'dark' | 'light';
    onOpenGuide: () => void;
    onOpenDevModal: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ userId, onLogout, onToggleTheme, theme, onOpenGuide, onOpenDevModal }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 shadow-lg border border-slate-700/50 ${isOpen ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' : 'bg-slate-900 dark:bg-black text-white hover:scale-105 hover:bg-slate-800'}`}
                title="Settings & Menu"
            >
                <span className={`text-lg transition-transform duration-500 ${isOpen ? 'rotate-90' : ''}`}>⚙️</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-72 glass-panel rounded-2xl shadow-2xl shadow-black/40 overflow-hidden animate-fade-in z-50 border border-slate-200 dark:border-white/10 p-2 flex flex-col gap-1 origin-top-right backdrop-blur-xl">
                    {/* User Info Header */}
                    <div className="px-4 py-4 bg-slate-50/50 dark:bg-white/5 rounded-xl mb-1 border border-slate-200 dark:border-white/5">
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Signed in as</p>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">
                                {userId?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <p className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[180px]" title={userId || ''}>
                                {userId?.includes('@') ? userId.split('@')[0] : userId || 'Guest User'}
                            </p>
                        </div>
                    </div>

                    {/* App Guide */}
                    <button
                        onClick={() => { onOpenGuide(); setIsOpen(false); }}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-600/10 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors text-left group"
                    >
                        <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 group-hover:bg-blue-200 dark:group-hover:bg-blue-500/30 transition-colors">📖</span> 
                        App Guide (গাইড)
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => { onToggleTheme(); }}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors text-left group"
                    >
                         <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-purple-500/20 text-amber-600 dark:text-purple-400 group-hover:bg-amber-200 dark:group-hover:bg-purple-500/30 transition-colors">
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </span>
                        {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    </button>

                    {/* Developer Info */}
                    <button
                        onClick={() => { onOpenDevModal(); setIsOpen(false); }}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-colors text-left group"
                    >
                        <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/30 transition-colors">👨‍💻</span>
                        Developer Info
                    </button>

                    <div className="h-px bg-slate-200 dark:bg-white/10 my-1 mx-2"></div>

                    {/* Logout */}
                    <button
                        onClick={() => { onLogout(); setIsOpen(false); }}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors text-left group"
                    >
                        <span className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-500/20 text-rose-600 group-hover:bg-rose-200 dark:group-hover:bg-rose-500/30 transition-colors">🚪</span>
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );
};