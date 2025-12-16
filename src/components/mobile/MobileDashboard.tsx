
import React from 'react';
import { UserData, UserSettings, CompositeData } from '../../types';
import { ProgressCard } from '../hero/ProgressCard';
import { CountdownCard } from '../hero/CountdownCard';
import { SidebarSubjectList } from '../sidebar/SidebarSubjectList';
import { useCountdown } from '../../hooks/useCountdown';

interface MobileDashboardProps {
    activeSubject: string;
    onChangeSubject: (key: string) => void;
    userData: UserData;
    settings: UserSettings;
    onUpdateSettings: (s: UserSettings) => void;
    compositeData: CompositeData;
    onEditWeights: () => void;
    onEditCountdown: () => void;
    onConfigSubjectProgress?: () => void;
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({
    activeSubject,
    onChangeSubject,
    userData,
    settings,
    onUpdateSettings,
    compositeData,
    onEditWeights,
    onEditCountdown,
    onConfigSubjectProgress
}) => {
    const target = settings.countdownTarget || '2025-12-12T00:00';
    const label = settings.countdownLabel || 'Time Remaining';
    const countdown = useCountdown(target);

    return (
        <div className="flex flex-col gap-3 pb-16 px-3 pt-3">
            {/* Header - Compact */}
            <div className="text-center py-1">
                <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
                    TrackStudy
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Personal Study Tracker</p>
            </div>

            {/* Progress & Countdown Row */}
            <div className="grid grid-cols-2 gap-2">
                <ProgressCard
                    compositeData={compositeData}
                    onEdit={onEditWeights}
                />
                <CountdownCard
                    countdown={countdown}
                    label={label}
                    onEdit={onEditCountdown}
                />
            </div>

            {/* Subject List */}
            <div className="glass-panel rounded-2xl p-3">
                {/* Header with gear icons */}
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Subjects
                    </h2>
                    <div className="flex gap-1">
                        {onConfigSubjectProgress && (
                            <button
                                onClick={onConfigSubjectProgress}
                                className="text-slate-400 hover:text-blue-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-xs"
                                title="Configure Subject Progress"
                            >
                                ⚙️
                            </button>
                        )}
                    </div>
                </div>
                <SidebarSubjectList
                    settings={settings}
                    activeSubject={activeSubject}
                    isEditing={false}
                    userData={userData}
                    onChangeSubject={onChangeSubject}
                    setModals={() => { }}
                    onUpdateSettings={onUpdateSettings}
                    onDeleteSubject={() => { }}
                />
            </div>
        </div>
    );
};
