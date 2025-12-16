
import React, { useState } from 'react';
import { UserData } from '../../types';

interface MobileSettingsProps {
    userId: string | null;
    userData?: UserData;
    theme: 'dark' | 'light';
    onLogout: () => void;
    onToggleTheme: () => void;
    onOpenGuide: () => void;
    onOpenDevModal: () => void;
    onOpenAppearance: () => void;
    onForceSync: () => void;
}

const SettingsItem: React.FC<{
    icon: string;
    title: string;
    subtitle?: string;
    colorClass: string;
    onClick: () => void;
    disabled?: boolean;
}> = ({ icon, title, subtitle, colorClass, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex items-center gap-4 p-4 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98] ${disabled ? 'opacity-50 cursor-wait' : ''}`}
    >
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colorClass} shadow-sm`}>
            {icon}
        </span>
        <div className="flex flex-col items-start">
            <span className="font-semibold text-slate-800 dark:text-white">{title}</span>
            {subtitle && <span className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</span>}
        </div>
        <span className="ml-auto text-slate-400">›</span>
    </button>
);

// Compact version for mobile - smaller, no subtitle
const SettingsItemCompact: React.FC<{
    icon: string;
    title: string;
    colorClass: string;
    onClick: () => void;
    disabled?: boolean;
}> = ({ icon, title, colorClass, onClick, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full flex items-center gap-3 p-2.5 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 transition-all ${disabled ? 'opacity-50 cursor-wait' : ''}`}
    >
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${colorClass}`}>
            {icon}
        </span>
        <span className="font-semibold text-sm text-slate-800 dark:text-white">{title}</span>
        <span className="ml-auto text-slate-400 text-sm">›</span>
    </button>
);

export const MobileSettings: React.FC<MobileSettingsProps> = ({
    userId,
    userData,
    theme,
    onLogout,
    onToggleTheme,
    onOpenGuide,
    onOpenDevModal,
    onOpenAppearance,
    onForceSync
}) => {
    const [isSyncing, setIsSyncing] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const displayName = userData?.username || (userId?.includes('@') ? userId.split('@')[0] : userId || 'Guest User');
    const displayInitial = displayName.charAt(0).toUpperCase();

    const handleForceSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            onForceSync();
            setIsSyncing(false);
        }, 500);
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await onLogout();
        } catch (e) {
            console.error('Logout error:', e);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 pb-16 px-3 pt-3">
            {/* Header */}
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">Settings</h1>

            {/* User Profile Card */}
            <div className="glass-panel rounded-2xl p-3">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-md ${userId ? 'bg-gradient-to-br from-blue-500 to-purple-500' : 'bg-slate-400'}`}>
                        {displayInitial}
                    </div>
                    <div>
                        <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                            {userId ? 'Signed in as' : 'Welcome'}
                        </p>
                        <p className="font-bold text-sm text-slate-800 dark:text-white truncate max-w-[180px]" title={displayName}>
                            {displayName}
                        </p>
                    </div>
                </div>
            </div>

            {/* General Settings */}
            <div className="flex flex-col gap-2">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1">
                    General
                </h2>
                <SettingsItemCompact icon="📖" title="App Guide" colorClass="bg-blue-100 dark:bg-blue-500/20 text-blue-600" onClick={onOpenGuide} />
                <SettingsItemCompact icon="🎨" title="Appearance" colorClass="bg-pink-100 dark:bg-pink-500/20 text-pink-600" onClick={onOpenAppearance} />
                <SettingsItemCompact icon={theme === 'dark' ? '🌙' : '☀️'} title={theme === 'dark' ? 'Dark Mode' : 'Light Mode'} colorClass="bg-amber-100 dark:bg-amber-500/20 text-amber-600" onClick={onToggleTheme} />
            </div>

            {/* Data & Tools */}
            <div className="flex flex-col gap-2">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1">
                    Data & Tools
                </h2>
                <SettingsItemCompact icon={isSyncing ? '⏳' : '🔄'} title={isSyncing ? 'Syncing...' : 'Force Sync'} colorClass="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600" onClick={handleForceSync} disabled={isSyncing} />
                <SettingsItemCompact icon="👨‍💻" title="Developer Info" colorClass="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600" onClick={onOpenDevModal} />
            </div>

            {/* Account */}
            {userId && (
                <div className="flex flex-col gap-2">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1">
                        Account
                    </h2>
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className={`w-full flex items-center gap-3 p-2.5 bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-200 dark:border-rose-500/20 transition-all ${isLoggingOut ? 'opacity-50 cursor-wait' : ''}`}
                    >
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-rose-100 dark:bg-rose-500/20 text-rose-600">
                            {isLoggingOut ? '⏳' : '🚪'}
                        </span>
                        <span className="font-semibold text-sm text-rose-600">{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
                    </button>
                </div>
            )}
        </div>
    );
};
