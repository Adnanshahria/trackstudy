import React, { useState } from 'react';
import { DashboardHeader } from '../components/layout/DashboardHeader';
import { Sidebar } from '../components/Sidebar';
import { Syllabus } from '../components/Syllabus';
import { UserData, UserSettings, CompositeData } from '../types';
import { MobileLayout } from '../components/mobile/MobileLayout';
import { useHeroLogic } from '../hooks/ui/useHeroLogic';

// Modals
import { Modal } from '../components/ui/Modal';
import { WeightsEditor } from '../components/hero/WeightsEditor';
import { CountdownEditModal } from '../components/hero/CountdownEditModal';
import { PerformanceConfigModal } from '../components/sidebar/PerformanceConfigModal';
import { SubjectConfigModal } from '../components/sidebar/SubjectConfigModal';

const MemoizedSidebar = React.memo(Sidebar);
const MemoizedSyllabus = React.memo(Syllabus);

interface DashboardPageProps {
    userId: string;
    userData: UserData;
    settings: UserSettings;
    activeSubject: string;
    setActiveSubject: (subject: string) => void;
    isLoading: boolean;
    connectionStatus: 'connected' | 'disconnected';
    onLogout: () => void;
    onToggleTheme: () => void;
    onDev: () => void;
    onGuide: () => void;
    onAppearance: () => void;
    onForceSync: () => void;
    onUpdateSettings: (s: UserSettings) => void;
    onUpdateStatus: (key: string) => Promise<void>;
    onUpdateNote: (key: string, text: string) => Promise<void>;
    compositeData: CompositeData;
    dataMgr: any; // Using any for brevity if types are complex, otherwise Import DataManagerReturn type
}

export const DashboardPage: React.FC<DashboardPageProps> = (props) => {
    const {
        userId, userData, settings, activeSubject, setActiveSubject,
        isLoading, connectionStatus, onLogout, onToggleTheme, onDev, onGuide, onAppearance, onForceSync,
        onUpdateSettings, onUpdateStatus, onUpdateNote, compositeData, dataMgr
    } = props;

    // Dashboard-specific modals
    const [showWeightsModal, setShowWeightsModal] = useState(false);
    const [showCountdownModal, setShowCountdownModal] = useState(false);
    const [showPerfConfig, setShowPerfConfig] = useState(false);
    const [showSubjectConfig, setShowSubjectConfig] = useState(false);

    // Hero logic needed for Weights Editor
    const heroLogic = useHeroLogic(settings, dataMgr.handleWeightUpdate);

    return (
        <div className="flex flex-col h-screen lg:overflow-hidden transition-colors duration-300">
            {/* DESKTOP LAYOUT */}
            <div className="hidden md:flex flex-col h-full overflow-hidden">
                <DashboardHeader
                    onDev={onDev}
                    status={connectionStatus}
                    userId={userId}
                    userData={userData}
                    settings={settings}
                    onLogout={onLogout}
                    onToggleTheme={onToggleTheme}
                    theme={settings.theme}
                    onGuide={onGuide}
                    onAppearance={onAppearance}
                    onForceSync={onForceSync}
                    onUpdateSettings={onUpdateSettings}
                />

                {isLoading ? (
                    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start lg:overflow-hidden animate-pulse p-4 lg:py-6 max-w-7xl mx-auto w-full">
                        <div className="hidden lg:flex flex-col gap-4 h-full">
                            <div className="grid grid-cols-2 gap-3 shrink-0">
                                <div className="h-32 bg-slate-200 dark:bg-white/5 rounded-2xl border border-slate-300 dark:border-white/5"></div>
                                <div className="h-32 bg-slate-200 dark:bg-white/5 rounded-2xl border border-slate-300 dark:border-white/5"></div>
                            </div>
                            <div className="h-40 bg-slate-200 dark:bg-white/5 rounded-3xl shrink-0 border border-slate-300 dark:border-white/5"></div>
                            <div className="flex-1 bg-slate-200 dark:bg-white/5 rounded-3xl border border-slate-300 dark:border-white/5"></div>
                        </div>
                        <div className="h-full flex flex-col gap-6 lg:overflow-y-auto pr-1 pb-20 lg:pb-0">
                            <div className="h-20 bg-slate-200 dark:bg-white/5 rounded-2xl shrink-0 border border-slate-300 dark:border-white/5"></div>
                            <div className="h-96 bg-slate-200 dark:bg-white/5 rounded-3xl shrink-0 border border-slate-300 dark:border-white/5"></div>
                        </div>
                    </div>
                ) : (
                    <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:py-6 lg:overflow-hidden flex-col flex">
                        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start lg:overflow-hidden print:block">
                            <div className="no-print lg:h-full lg:overflow-hidden flex flex-col pb-10 lg:pb-0">
                                <MemoizedSidebar
                                    activeSubject={activeSubject}
                                    onChangeSubject={setActiveSubject}
                                    userData={userData}
                                    settings={settings}
                                    onUpdateSettings={onUpdateSettings}
                                    onDeleteSubject={dataMgr.handleDeleteSubject}
                                    compositeData={compositeData}
                                    onUpdateWeights={dataMgr.handleWeightUpdate}
                                    onUpdateCountdown={(t, l) => onUpdateSettings({ ...settings, countdownTarget: t, countdownLabel: l })}
                                />
                            </div>
                            <div id="syllabus-print-container" className="lg:h-full lg:overflow-y-auto custom-scrollbar pr-1 pb-20 lg:pb-0">
                                {settings.syllabus?.[activeSubject] ? (
                                    <MemoizedSyllabus
                                        activeSubject={activeSubject}
                                        userData={userData}
                                        settings={settings}
                                        userId={userId}
                                        onUpdateStatus={onUpdateStatus}
                                        onUpdateNote={onUpdateNote}
                                        onTogglePaper={(key) => onUpdateSettings({ ...settings, syllabusOpenState: { ...settings.syllabusOpenState, [key]: !settings.syllabusOpenState[key] } })}
                                        onRenameColumn={dataMgr.onRenameColumn}
                                        onAddColumn={dataMgr.onAddColumn}
                                        onAddChapter={dataMgr.onAddChapter}
                                        onDeleteChapter={dataMgr.onDeleteChapter}
                                        onDeleteColumn={dataMgr.onDeleteColumn}
                                        onRenameChapter={dataMgr.handleRenameChapter}
                                        onDeletePaper={dataMgr.onDeletePaper}
                                    />
                                ) : (
                                    <div className="p-10 text-center text-slate-500">Select a subject or complete onboarding.</div>
                                )}
                            </div>
                        </div>
                    </main>
                )}
            </div>

            {/* MOBILE LAYOUT */}
            <div className="md:hidden flex-1 flex flex-col">
                {!isLoading && (
                    <MobileLayout
                        userId={userId}
                        userData={userData}
                        settings={settings}
                        compositeData={compositeData}
                        activeSubject={activeSubject}
                        onChangeSubject={setActiveSubject}
                        onUpdateSettings={onUpdateSettings}
                        onUpdateStatus={onUpdateStatus}
                        onUpdateNote={onUpdateNote}
                        onTogglePaper={(key) => onUpdateSettings({ ...settings, syllabusOpenState: { ...settings.syllabusOpenState, [key]: !settings.syllabusOpenState[key] } })}
                        onRenameColumn={dataMgr.onRenameColumn}
                        onAddColumn={dataMgr.onAddColumn}
                        onAddChapter={dataMgr.onAddChapter}
                        onDeleteChapter={dataMgr.onDeleteChapter}
                        onDeletePaper={dataMgr.onDeletePaper}
                        onDeleteColumn={dataMgr.onDeleteColumn}
                        onDeleteSubject={dataMgr.handleDeleteSubject}
                        onRenameChapter={dataMgr.handleRenameChapter}
                        onLogout={onLogout}
                        onToggleTheme={onToggleTheme}

                        // Modals triggered from Mobile Menu
                        onOpenGuide={onGuide}
                        onOpenDevModal={onDev}
                        onOpenAppearance={onAppearance}
                        onForceSync={onForceSync}
                        onEditWeights={() => setShowWeightsModal(true)}
                        onEditCountdown={() => setShowCountdownModal(true)}
                        onConfigPerformance={() => setShowPerfConfig(true)}
                        onConfigSubjectProgress={() => setShowSubjectConfig(true)}
                    />
                )}
            </div>

            {/* Modals Rendered Here */}
            {showWeightsModal && (
                <Modal isOpen={true} onClose={() => setShowWeightsModal(false)} title="Weighted Progress Config">
                    <WeightsEditor
                        settings={settings}
                        selectedSubject={heroLogic.selectedSubject}
                        setSelectedSubject={heroLogic.setSelectedSubject}
                        weightTotal={heroLogic.weightTotal}
                        tempWeights={heroLogic.tempWeights}
                        handleWeightChange={heroLogic.handleWeightChange}
                        saveWeights={() => { heroLogic.saveWeights(); setShowWeightsModal(false); }}
                        currentConfigItems={heroLogic.currentConfigItems}
                        compositeData={compositeData}
                        isEditing={true}
                    />
                </Modal>
            )}

            <CountdownEditModal
                isOpen={showCountdownModal}
                onClose={() => setShowCountdownModal(false)}
                initialTarget={settings.countdownTarget || '2025-12-12T00:00'}
                initialLabel={settings.countdownLabel || 'Time Remaining'}
                onSave={(t, l) => onUpdateSettings({ ...settings, countdownTarget: t, countdownLabel: l })}
            />

            {showPerfConfig && (
                <PerformanceConfigModal
                    currentConfig={settings.progressBars}
                    allItems={settings.subjectConfigs?.[activeSubject] || settings.trackableItems}
                    onSave={(c) => { onUpdateSettings({ ...settings, progressBars: c }); setShowPerfConfig(false); }}
                    onClose={() => setShowPerfConfig(false)}
                />
            )}

            {showSubjectConfig && (
                <SubjectConfigModal
                    currentItems={settings.subjectProgressItems || []}
                    currentWeights={settings.subjectProgressWeights || {}}
                    allItems={settings.subjectConfigs?.[activeSubject] || settings.trackableItems}
                    onSave={(i, w) => { onUpdateSettings({ ...settings, subjectProgressItems: i, subjectProgressWeights: w }); setShowSubjectConfig(false); }}
                    onClose={() => setShowSubjectConfig(false)}
                />
            )}
        </div>
    );
};
