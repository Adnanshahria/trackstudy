
import React, { useState } from 'react';
import { UserData, UserSettings, CompositeData } from '../../types';
import { BottomNav, TabType } from './BottomNav';
import { MobileDashboard } from './MobileDashboard';
import { MobileSyllabus } from './MobileSyllabus';
import { MobileSettings } from './MobileSettings';

interface MobileLayoutProps {
    userId: string | null;
    userData: UserData;
    settings: UserSettings;
    compositeData: CompositeData;
    activeSubject: string;
    onChangeSubject: (key: string) => void;
    onUpdateSettings: (s: UserSettings) => void;
    onUpdateStatus: (key: string) => void;
    onUpdateNote: (key: string, text: string) => void;
    onTogglePaper: (key: string) => void;
    onRenameColumn: (subject: string, key: string, newName: string) => void;
    onAddColumn: (subject: string, name: string, color: string) => void;
    onAddChapter: (subject: string, paper: number, name: string) => void;
    onDeleteChapter: (subject: string, chapterId: number | string) => void;
    onDeletePaper: (subject: string, paperId: number) => void;
    onDeleteColumn: (subject: string, itemKey: string) => void;
    onRenameChapter: (subject: string, chapterId: number | string, newName: string) => void;
    onDeleteSubject: (key: string) => void;
    onLogout: () => void;
    onToggleTheme: () => void;
    onOpenGuide: () => void;
    onOpenDevModal: () => void;
    onOpenAppearance: () => void;
    onForceSync: () => void;
    onEditWeights: () => void;
    onEditCountdown: () => void;
    onConfigPerformance: () => void;
    onConfigSubjectProgress: () => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
    userId,
    userData,
    settings,
    compositeData,
    activeSubject,
    onChangeSubject,
    onUpdateSettings,
    onUpdateStatus,
    onUpdateNote,
    onTogglePaper,
    onLogout,
    onToggleTheme,
    onOpenGuide,
    onOpenDevModal,
    onOpenAppearance,
    onForceSync,
    onEditWeights,
    onEditCountdown,
    onConfigPerformance,
    onConfigSubjectProgress,
    ...paperHandlers
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black md:hidden">
            {/* Main Content Area */}
            <main className="overflow-y-auto">
                {activeTab === 'dashboard' && (
                    <MobileDashboard
                        activeSubject={activeSubject}
                        onChangeSubject={onChangeSubject}
                        userData={userData}
                        settings={settings}
                        onUpdateSettings={onUpdateSettings}
                        compositeData={compositeData}
                        onEditWeights={onEditWeights}
                        onEditCountdown={onEditCountdown}
                        onConfigSubjectProgress={onConfigSubjectProgress}
                        onDeleteSubject={props.onDeleteSubject}
                    />
                )}
                {activeTab === 'syllabus' && (
                    <MobileSyllabus
                        activeSubject={activeSubject}
                        onChangeSubject={onChangeSubject}
                        userData={userData}
                        settings={settings}
                        userId={userId}
                        onUpdateStatus={onUpdateStatus}
                        onUpdateNote={onUpdateNote}
                        onTogglePaper={onTogglePaper}
                        onConfigPerformance={onConfigPerformance}
                        onConfigSubjectProgress={onConfigSubjectProgress}
                        {...paperHandlers}
                    />
                )}
                {activeTab === 'settings' && (
                    <MobileSettings
                        userId={userId}
                        userData={userData}
                        theme={settings.theme}
                        onLogout={onLogout}
                        onToggleTheme={onToggleTheme}
                        onOpenGuide={onOpenGuide}
                        onOpenDevModal={onOpenDevModal}
                        onOpenAppearance={onOpenAppearance}
                        onForceSync={onForceSync}
                    />
                )}
            </main>

            {/* Bottom Navigation */}
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    );
};
