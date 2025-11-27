
import React, { useState } from 'react';
import { UserData, UserSettings, CompositeData } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { ConfirmModal } from './ui/ConfirmModal';
import { AddSubjectModal } from './sidebar/AddSubjectModal';
import { PerformanceConfigModal } from './sidebar/PerformanceConfigModal';
import { SubjectConfigModal } from './sidebar/SubjectConfigModal';
import { PerformanceWidget } from './sidebar/PerformanceWidget';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarSubjectList } from './sidebar/SidebarSubjectList';
import { ProgressCard } from './hero/ProgressCard';
import { CountdownCard } from './hero/CountdownCard';
import { WeightsEditor } from './hero/WeightsEditor';
import { CountdownEditModal } from './hero/CountdownEditModal';
import { useCountdown } from '../hooks/useCountdown';
import { useHeroLogic } from '../hooks/ui/useHeroLogic';

interface SidebarProps {
    activeSubject: string;
    onChangeSubject: (key: string) => void;
    userData: UserData;
    settings: UserSettings;
    onUpdateSettings: (s: UserSettings) => void;
    onDeleteSubject: (key: string) => void;
    compositeData: CompositeData;
    onUpdateWeights: (newWeights: any, subjectKey?: string) => void;
    onUpdateCountdown: (target: string, label: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSubject, onChangeSubject, userData, settings, onUpdateSettings, onDeleteSubject, compositeData, onUpdateWeights, onUpdateCountdown }) => {
    const [modals, setModals] = useState({ perf: false, subConfig: false, addSub: false, rename: null as {key: string, name: string} | null, weights: false });
    const [isEditingSubjects, setIsEditingSubjects] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const target = settings.countdownTarget || '2025-12-12T00:00';
    const label = settings.countdownLabel || 'Time Remaining';
    const countdown = useCountdown(target);
    const logic = useHeroLogic(settings, onUpdateWeights);

    const handleRename = () => { if(modals.rename) { onUpdateSettings({ ...settings, customNames: { ...settings.customNames, [modals.rename.key]: modals.rename.name } }); setModals({ ...modals, rename: null }); }};

    return (
        <aside className="flex flex-col gap-4 h-full lg:overflow-hidden">
            {/* ROW 1: Progress & Countdown */}
            <div className="grid grid-cols-2 gap-3 shrink-0">
                <ProgressCard 
                    compositeData={compositeData} 
                    onEdit={() => setModals({ ...modals, weights: true })}
                />
                <CountdownCard 
                    countdown={countdown} 
                    label={label} 
                    onEdit={() => logic.setIsEditingCountdown(true)} 
                />
            </div>

            {/* ROW 2: Performance Widget (Standalone Card) */}
            <div className="glass-panel rounded-3xl p-5 shadow-sm shrink-0">
                <PerformanceWidget 
                    settings={settings} 
                    userData={userData} 
                    activeSubject={activeSubject} 
                    onConfig={() => setModals({ ...modals, perf: true })} 
                />
            </div>

            {/* ROW 3: Subjects List (Remaining Space, Scrollable) */}
            <div className="glass-panel rounded-3xl flex-1 min-h-0 flex flex-col overflow-hidden shadow-sm">
                <div className="pt-5 px-5 shrink-0">
                    <SidebarHeader isEditing={isEditingSubjects} setIsEditing={setIsEditingSubjects} setModals={setModals} />
                </div>
                <div className="px-5 pb-5 flex-1 overflow-y-auto custom-scrollbar">
                    <SidebarSubjectList 
                        settings={settings} activeSubject={activeSubject} isEditing={isEditingSubjects} 
                        userData={userData} onChangeSubject={onChangeSubject} setModals={setModals}
                        onUpdateSettings={onUpdateSettings} 
                        onDeleteSubject={(key) => setDeleteConfirm(key)}
                    />
                </div>
            </div>

            {/* Modals */}
            {modals.weights && (
                <Modal isOpen={true} onClose={() => setModals({ ...modals, weights: false })} title="Weighted Progress Config">
                    <WeightsEditor 
                        settings={settings}
                        selectedSubject={logic.selectedSubject} setSelectedSubject={logic.setSelectedSubject}
                        weightTotal={logic.weightTotal} tempWeights={logic.tempWeights}
                        handleWeightChange={logic.handleWeightChange} saveWeights={() => { logic.saveWeights(); setModals({ ...modals, weights: false }); }}
                        currentConfigItems={logic.currentConfigItems} compositeData={compositeData}
                        isEditing={true} // Always edit in modal
                    />
                </Modal>
            )}

            <CountdownEditModal 
                isOpen={logic.isEditingCountdown} 
                onClose={() => logic.setIsEditingCountdown(false)} 
                initialTarget={target}
                initialLabel={label}
                onSave={onUpdateCountdown} 
            />

            {modals.perf && <PerformanceConfigModal currentConfig={settings.progressBars} allItems={settings.subjectConfigs?.[activeSubject] || settings.trackableItems} onSave={(c) => { onUpdateSettings({ ...settings, progressBars: c }); setModals({ ...modals, perf: false }); }} onClose={() => setModals({ ...modals, perf: false })} />}
            {modals.subConfig && <SubjectConfigModal currentItems={settings.subjectProgressItems || []} currentWeights={settings.subjectProgressWeights || {}} allItems={settings.subjectConfigs?.[activeSubject] || settings.trackableItems} onSave={(i, w) => { onUpdateSettings({ ...settings, subjectProgressItems: i, subjectProgressWeights: w }); setModals({ ...modals, subConfig: false }); }} onClose={() => setModals({ ...modals, subConfig: false })} />}
            {modals.rename && <Modal isOpen={true} onClose={() => setModals({ ...modals, rename: null })} title="Rename Subject"><div className="flex flex-col gap-4"><input type="text" value={modals.rename.name} onChange={(e) => setModals({ ...modals, rename: { ...modals.rename!, name: e.target.value } })} className="bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm dark:text-white" /><div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setModals({ ...modals, rename: null })}>Cancel</Button><Button onClick={handleRename}>Save Name</Button></div></div></Modal>}
            {modals.addSub && <AddSubjectModal onClose={() => setModals({ ...modals, addSub: false })} onAdd={(name, emoji, color) => { const newSyllabus = { ...settings.syllabus, [`subj_${Date.now()}`]: { name, icon: emoji, color, chapters: [] } }; onUpdateSettings({ ...settings, syllabus: newSyllabus }); }} />}
            
            <ConfirmModal 
                isOpen={!!deleteConfirm} 
                onClose={() => setDeleteConfirm(null)} 
                onConfirm={() => { if (deleteConfirm) onDeleteSubject(deleteConfirm); }}
                title="Delete Subject"
                message={`Are you sure you want to delete this subject? All associated data will be lost permanently.`}
                confirmText="Delete Subject"
                isDanger={true}
            />
        </aside>
    );
};
