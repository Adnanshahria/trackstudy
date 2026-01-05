
import React, { useState } from 'react';
import { UserData, UserSettings } from '../../types';
import { PerformanceWidget } from '../sidebar/PerformanceWidget';
import { SubjectProgressCard } from '../sidebar/SubjectProgressCard';
import { PaperSection } from '../syllabus/PaperSection';
import { SyllabusModals } from '../syllabus/SyllabusModals';
import { calculateProgress } from '../../utils/calculations';
import { useSyllabusUI } from '../../hooks/ui/useSyllabusUI';

interface MobileSyllabusProps {
    activeSubject: string;
    onChangeSubject: (key: string) => void;
    userData: UserData;
    settings: UserSettings;
    userId: string | null;
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
    onConfigPerformance: () => void;
    onConfigSubjectProgress: () => void;
}

type SubTab = 'widgets' | 'papers';

export const MobileSyllabus: React.FC<MobileSyllabusProps> = ({
    activeSubject,
    onChangeSubject,
    userData,
    settings,
    userId,
    onUpdateStatus,
    onUpdateNote,
    onTogglePaper,
    onConfigPerformance,
    onConfigSubjectProgress,
    ...paperHandlers
}) => {
    const [subTab, setSubTab] = useState<SubTab>('papers');
    const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
    const ui = useSyllabusUI();

    const subject = settings.syllabus[activeSubject];
    if (!subject) {
        return (
            <div className="p-10 text-center text-slate-500 pb-20">
                Select a subject from the Dashboard tab
            </div>
        );
    }

    const allItems = settings.subjectConfigs?.[activeSubject] || settings.trackableItems;
    const progress = calculateProgress(activeSubject, allItems.map(i => i.key), userData, undefined, allItems, settings.syllabus);

    // Get all subjects for dropdown
    const syllabusKeys = Object.keys(settings.syllabus || {});
    const existingOrder = settings.subjectOrder || [];
    const validOrder = existingOrder.filter(key => settings.syllabus?.[key]);
    const newKeys = syllabusKeys.filter(key => !validOrder.includes(key));
    const orderedSubjects = [...validOrder, ...newKeys];

    // Actions object with modal handlers
    const actions = {
        onTogglePaper,
        onUpdateStatus,
        onUpdateNote,
        ...paperHandlers,
        ...ui,
        setModals: ui.setModals,
        setNoteModal: ui.setNoteModal,
        setRenameModal: ui.setRenameModal,
        setAddChapterModal: ui.setAddChapterModal,
        setAddColumnModal: ui.setAddColumnModal,
        chapterNotes: {},
        setChapterNotes: () => { }
    };

    // Handlers for modals
    const modalHandlers = {
        onUpdateNote,
        onRenameColumn: paperHandlers.onRenameColumn,
        onRenameChapter: paperHandlers.onRenameChapter,
        onAddColumn: paperHandlers.onAddColumn,
        onAddChapter: paperHandlers.onAddChapter,
        onDeleteChapter: paperHandlers.onDeleteChapter,
        onDeleteColumn: paperHandlers.onDeleteColumn,
    };

    return (
        <div className="flex flex-col pb-16">
            {/* Subject Header with Dropdown - Compact */}
            <div className="px-3 pt-3 pb-1 relative">
                <button
                    onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                    className="flex items-center gap-2 group"
                >
                    <span className="text-xl">{subject.icon}</span>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-white">
                        {settings.customNames?.[activeSubject] || subject.name}
                    </h1>
                    <span className={`text-slate-400 text-sm transition-transform duration-200 ${showSubjectDropdown ? 'rotate-180' : ''}`}>
                        ▼
                    </span>
                </button>

                {/* Subject Dropdown */}
                {showSubjectDropdown && (
                    <div className="absolute left-3 right-3 top-12 z-50 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden">
                        {orderedSubjects.map(key => {
                            const subj = settings.syllabus[key];
                            if (!subj) return null;
                            const isActive = key === activeSubject;
                            return (
                                <button
                                    key={key}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChangeSubject(key);
                                        setShowSubjectDropdown(false);
                                    }}
                                    className={`w-full flex items-center gap-2 p-2.5 transition-colors ${isActive
                                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                        : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                                        }`}
                                >
                                    <span className="text-base">{subj.icon}</span>
                                    <span className="font-semibold text-sm">
                                        {settings.customNames?.[key] || subj.name}
                                    </span>
                                    {isActive && <span className="ml-auto text-blue-500 text-sm">✓</span>}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Sub-Tab Switcher - Compact */}
            <div className="px-3 pb-2">
                <div className="flex gap-1 p-0.5 bg-slate-100 dark:bg-white/5 rounded-lg">
                    <button
                        onClick={() => setSubTab('widgets')}
                        className={`flex-1 py-1.5 px-2 rounded-md text-xs font-bold transition-all ${subTab === 'widgets'
                            ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400'
                            }`}
                    >
                        📊 Widgets
                    </button>
                    <button
                        onClick={() => setSubTab('papers')}
                        className={`flex-1 py-1.5 px-2 rounded-md text-xs font-bold transition-all ${subTab === 'papers'
                            ? 'bg-white dark:bg-white/10 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-500 dark:text-slate-400'
                            }`}
                    >
                        📝 Papers
                    </button>
                </div>
            </div>

            {/* Content based on sub-tab */}
            {subTab === 'widgets' ? (
                <div className="px-3 flex flex-col gap-3">
                    {/* Performance Widget */}
                    <div className="glass-panel rounded-2xl p-3">
                        <PerformanceWidget
                            settings={settings}
                            userData={userData}
                            activeSubject={activeSubject}
                            onConfig={onConfigPerformance}
                        />
                    </div>

                    {/* Subject Progress Card */}
                    <SubjectProgressCard
                        activeSubject={activeSubject}
                        settings={settings}
                        userData={userData}
                        onConfig={onConfigSubjectProgress}
                    />
                </div>
            ) : (
                <div className="px-3 flex flex-col gap-3">
                    {/* Paper 1 */}
                    <PaperSection
                        paper={1}
                        activeSubject={activeSubject}
                        userData={userData}
                        settings={settings}
                        allItems={allItems}
                        allChapters={subject.chapters}
                        pVal={progress.p1}
                        isOpen={settings.syllabusOpenState[`${activeSubject}-p1`] !== false}
                        editMode={ui.editMode}
                        actions={actions}
                    />

                    {/* Paper 2 - Only for HSC */}
                    {settings.academicLevel !== 'SSC' && (
                        <PaperSection
                            paper={2}
                            activeSubject={activeSubject}
                            userData={userData}
                            settings={settings}
                            allItems={allItems}
                            allChapters={subject.chapters}
                            pVal={progress.p2}
                            isOpen={settings.syllabusOpenState[`${activeSubject}-p2`] !== false}
                            editMode={ui.editMode}
                            actions={actions}
                        />
                    )}
                </div>
            )}

            {/* Syllabus Modals - for NoteModal, RenameModal, etc */}
            <SyllabusModals
                modals={ui.modals}
                setModals={ui.setModals}
                handlers={modalHandlers}
                ui={ui}
                activeSubject={activeSubject}
                settings={settings}
                userId={userId}
            />
        </div>
    );
};
