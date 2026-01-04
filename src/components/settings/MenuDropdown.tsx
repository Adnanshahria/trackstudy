
import React, { useState } from 'react';
import { UserData, UserSettings } from '../../types';
import { getSyllabusData } from '../../constants/data';

interface MenuDropdownProps {
    userId: string | null;
    userData?: UserData;
    settings: UserSettings;
    theme: 'dark' | 'light';
    onLogout: () => void;
    onToggleTheme: () => void;
    onOpenGuide: () => void;
    onOpenDevModal: () => void;
    onOpenAppearance: () => void;
    onForceSync: () => void;
    onUpdateSettings: (s: UserSettings) => void;
    onClose: () => void;
}

export const MenuDropdown: React.FC<MenuDropdownProps> = ({ userId, userData, settings, theme, onLogout, onToggleTheme, onOpenGuide, onOpenDevModal, onOpenAppearance, onForceSync, onUpdateSettings, onClose }) => {
    const [isSyncing, setIsSyncing] = useState(false);

    const MenuItem = ({ onClick, icon, text, colorClass, disabled = false }: any) => (
        <button
            onClick={(e) => { if (!disabled) { onClick(e); if (!disabled) onClose(); } }}
            disabled={disabled}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-white/10 rounded-lg transition-all text-left group hover:pl-4 ${disabled ? 'opacity-50 cursor-wait' : ''}`}
        >
            <span className={`p-1.5 rounded-lg ${colorClass} transition-colors shadow-sm`}>{icon}</span>
            <div className="flex flex-col leading-none">
                <span>{text}</span>
            </div>
        </button>
    );

    const handleForceSync = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSyncing(true);
        setTimeout(() => {
            onForceSync(); // Trigger soft sync (react state reset)
            setIsSyncing(false);
            onClose();
        }, 500);
    };

    const handleLogoutClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsSyncing(true);
        try {
            await onLogout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsSyncing(false);
            onClose();
        }
    };

    const displayName = userData?.username || (userId?.includes('@') ? userId.split('@')[0] : userId || 'Guest User');
    const displayInitial = displayName.charAt(0).toUpperCase();

    return (
        <div className="absolute right-0 mt-3 w-72 glass-panel rounded-3xl shadow-2xl shadow-black/40 overflow-hidden animate-fade-in z-50 border border-slate-200 dark:border-white/10 p-3 origin-top-right backdrop-blur-xl">

            <div className="flex flex-col gap-3">
                <div className="px-4 py-3 bg-slate-50/80 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">{userId ? 'Signed in as' : 'Welcome'}</p>
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-md shrink-0 ${userId ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-slate-400'}`}>
                            {displayInitial}
                        </div>
                        <span className="text-sm font-semibold text-slate-700 dark:text-white truncate">{displayName}</span>
                    </div>
                </div>

                {/* Academic Level Section */}
                <div className="bg-indigo-50/50 dark:bg-indigo-500/10 rounded-2xl p-2 border border-indigo-200/50 dark:border-indigo-500/20 shadow-sm">
                    <div className="px-2 py-1 text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">Academic Level</div>
                    <div className="flex gap-1 p-1">
                        <button
                            onClick={() => { onUpdateSettings({ ...settings, academicLevel: 'HSC', syllabus: getSyllabusData('HSC') }); onClose(); }}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${settings.academicLevel === 'HSC' ? 'bg-blue-500 text-white shadow-md' : 'bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-500/20'}`}
                        >
                            🎓 HSC
                        </button>
                        <button
                            onClick={() => { onUpdateSettings({ ...settings, academicLevel: 'SSC', syllabus: getSyllabusData('SSC') }); onClose(); }}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${settings.academicLevel === 'SSC' ? 'bg-indigo-500 text-white shadow-md' : 'bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/20'}`}
                        >
                            📚 SSC
                        </button>
                    </div>
                </div>

                <div className="bg-slate-50/50 dark:bg-white/5 rounded-2xl p-1 border border-slate-200/50 dark:border-white/5 shadow-sm">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">General</div>
                    <MenuItem onClick={onOpenGuide} icon="📖" text="App Guide" colorClass="bg-blue-100 dark:bg-blue-500/20 text-blue-600" />
                    <MenuItem onClick={onOpenAppearance} icon="🎨" text="Appearance" colorClass="bg-pink-100 dark:bg-pink-500/20 text-pink-600" />
                </div>

                <div className="bg-slate-50/50 dark:bg-white/5 rounded-2xl p-1 border border-slate-200/50 dark:border-white/5 shadow-sm">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data & Tools</div>
                    <MenuItem
                        onClick={handleForceSync}
                        icon={isSyncing ? "⏳" : "🔄"}
                        text={isSyncing ? "Syncing..." : "Force Sync"}
                        colorClass="bg-amber-100 dark:bg-amber-500/20 text-amber-600"
                        disabled={isSyncing}
                    />
                    <MenuItem onClick={onOpenDevModal} icon="👨‍💻" text="Developer Info" colorClass="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" />
                </div>

                {userId && (
                    <div className="bg-rose-50/50 dark:bg-rose-500/10 rounded-2xl p-1 border border-rose-200/50 dark:border-rose-500/20 shadow-sm">
                        <MenuItem onClick={handleLogoutClick} icon={isSyncing ? "⏳" : "🚪"} text={isSyncing ? "Logging out..." : "Log Out"} colorClass="bg-rose-100 dark:bg-rose-500/20 text-rose-600" disabled={isSyncing} />
                    </div>
                )}
            </div>
        </div>
    );
};
