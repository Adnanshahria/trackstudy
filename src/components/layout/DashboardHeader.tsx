
import React from 'react';
import { SettingsMenu } from '../settings/SettingsMenu';
import { UserData, UserSettings } from '../../types';

export const DashboardHeader: React.FC<{ onDev: () => void, status: string, userId: string, userData: UserData, settings: UserSettings, onLogout: () => Promise<void>, onToggleTheme: () => void, theme: any, onGuide: () => void, onAppearance: () => void, onForceSync: () => void, onUpdateSettings: (s: UserSettings) => void }> = ({ onDev, status, userId, userData, settings, onLogout, onToggleTheme, theme, onGuide, onAppearance, onForceSync, onUpdateSettings }) => (
    <div className="flex flex-row justify-between items-center mb-6 no-print gap-4">
        <div onClick={onDev} className="glass-panel py-2 px-3 lg:px-4 rounded-2xl flex items-center gap-3 transition-all hover:bg-white/50 dark:hover:bg-white/5 cursor-pointer select-none shadow-lg shadow-blue-500/5 dark:shadow-black/20 border border-slate-200 dark:border-white/10 max-w-[70%] group">
            <img src="./icons/icon-192.png" alt="TrackStudy" className="w-9 h-9 lg:w-10 lg:h-10 shrink-0 rounded-xl shadow-lg group-hover:scale-105 transition-transform ring-1 ring-white/20 object-cover" />
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <h1 className="text-lg lg:text-xl font-bold tracking-tight text-slate-800 dark:text-white leading-tight truncate drop-shadow-sm">
                    TrackStudy
                </h1>
                <div
                    className={`w-2.5 h-2.5 shrink-0 rounded-full ${status === 'connected' ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]'}`}
                    title={status === 'connected' ? 'Online' : 'Offline'}
                ></div>
            </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
            <SettingsMenu userId={userId} userData={userData} settings={settings} onLogout={onLogout} onToggleTheme={onToggleTheme} theme={theme} onOpenGuide={onGuide} onOpenDevModal={onDev} onOpenAppearance={onAppearance} onForceSync={onForceSync} onUpdateSettings={onUpdateSettings} />
        </div>
    </div>
);
