import React from 'react';
import { UserData, UserSettings, CompositeData } from '../../types';
import { ProgressCard } from '../hero/ProgressCard';
import { CountdownCard } from '../hero/CountdownCard';
import { SidebarSubjectList } from '../sidebar/SidebarSubjectList';
import { useCountdown } from '../../hooks/useCountdown';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';
import { AddSubjectModal } from '../sidebar/AddSubjectModal';

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
    onDeleteSubject: (key: string) => void;
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
    onConfigSubjectProgress,
    onDeleteSubject
}) => {
    const target = settings.countdownTarget || '2025-12-12T00:00';
    const label = settings.countdownLabel || 'Time Remaining';
    const countdown = useCountdown(target);

    const [isEditing, setIsEditing] = React.useState(false);
    const [modals, setModals] = React.useState({ addSub: false, rename: null as { key: string, name: string } | null });
    const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);

    const handleRename = () => {
        if (modals.rename) {
            onUpdateSettings({ ...settings, customNames: { ...settings.customNames, [modals.rename.key]: modals.rename.name } });
            setModals({ ...modals, rename: null });
        }
    };

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
                {/* Header with interactions */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                        Subjects
                    </h2>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setModals({ ...modals, addSub: true })}
                            className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 p-1 rounded-lg font-bold text-lg leading-none transition-colors"
                            title="Add New Subject"
                        >
                            +
                        </button>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`p-1 rounded-lg transition-colors ${isEditing ? 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                            title="Edit Subjects"
                        >
                            ✏️
                        </button>
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
                    isEditing={isEditing}
                    userData={userData}
                    onChangeSubject={onChangeSubject}
                    setModals={setModals}
                    onUpdateSettings={onUpdateSettings}
                    onDeleteSubject={(key) => setDeleteConfirm(key)}
                />

                {/* Local Modals */}
                {modals.addSub && <AddSubjectModal onClose={() => setModals({ ...modals, addSub: false })} onAdd={(name, emoji, color) => { const subKey = `subj_${Date.now()}`; const newSyllabus = { ...settings.syllabus, [subKey]: { name, icon: emoji, color, chapters: [] } }; const newOpenState = { ...settings.syllabusOpenState, [`${subKey}-p1`]: true, [`${subKey}-p2`]: true }; onUpdateSettings({ ...settings, syllabus: newSyllabus, syllabusOpenState: newOpenState }); }} />}

                {modals.rename && (
                    <Modal isOpen={true} onClose={() => setModals({ ...modals, rename: null })} title="Rename Subject">
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                value={modals.rename.name}
                                onChange={(e) => setModals({ ...modals, rename: { ...modals.rename!, name: e.target.value } })}
                                className="bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm dark:text-white"
                            />
                            <div className="flex justify-end gap-3">
                                <Button variant="secondary" onClick={() => setModals({ ...modals, rename: null })}>Cancel</Button>
                                <Button onClick={handleRename}>Save Name</Button>
                            </div>
                        </div>
                    </Modal>
                )}

                <ConfirmModal
                    isOpen={!!deleteConfirm}
                    onClose={() => setDeleteConfirm(null)}
                    onConfirm={() => { if (deleteConfirm) onDeleteSubject(deleteConfirm); setDeleteConfirm(null); }}
                    title="Delete Subject"
                    message={`Are you sure you want to delete this subject? All associated data will be lost permanently.`}
                    confirmText="Delete Subject"
                    isDanger={true}
                />
            </div>
        </div>
    );
};
