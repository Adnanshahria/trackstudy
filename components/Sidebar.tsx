import React, { useState } from 'react';
import { UserData, UserSettings } from '../types';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { ConfirmModal } from './ui/ConfirmModal';
import { AddSubjectModal } from './sidebar/AddSubjectModal';
import { PerformanceConfigModal } from './sidebar/PerformanceConfigModal';
import { SubjectConfigModal } from './sidebar/SubjectConfigModal';
import { PerformanceWidget } from './sidebar/PerformanceWidget';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarSubjectList } from './sidebar/SidebarSubjectList';

interface SidebarProps {
    activeSubject: string;
    onChangeSubject: (key: string) => void;
    userData: UserData;
    settings: UserSettings;
    onUpdateSettings: (s: UserSettings) => void;
    onDeleteSubject: (key: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSubject, onChangeSubject, userData, settings, onUpdateSettings, onDeleteSubject }) => {
    const [modals, setModals] = useState({ perf: false, subConfig: false, addSub: false, rename: null as {key: string, name: string} | null });
    const [isEditing, setIsEditing] = useState(false);
    // State for delete confirmation
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const handleRename = () => { if(modals.rename) { onUpdateSettings({ ...settings, customNames: { ...settings.customNames, [modals.rename.key]: modals.rename.name } }); setModals({ ...modals, rename: null }); }};

    return (
        <aside className="flex flex-col gap-6">
            <div className="glass-panel p-5 rounded-3xl">
                <SidebarHeader isEditing={isEditing} setIsEditing={setIsEditing} setModals={setModals} />
                <SidebarSubjectList 
                    settings={settings} activeSubject={activeSubject} isEditing={isEditing} 
                    userData={userData} onChangeSubject={onChangeSubject} setModals={setModals}
                    onUpdateSettings={onUpdateSettings} 
                    // Pass a function that sets the confirmation state instead of deleting immediately
                    onDeleteSubject={(key) => setDeleteConfirm(key)}
                />
            </div>
            <PerformanceWidget settings={settings} userData={userData} activeSubject={activeSubject} onConfig={() => setModals({ ...modals, perf: true })} />
            
            {modals.perf && <PerformanceConfigModal currentConfig={settings.progressBars} allItems={settings.subjectConfigs?.[activeSubject] || settings.trackableItems} onSave={(c) => { onUpdateSettings({ ...settings, progressBars: c }); setModals({ ...modals, perf: false }); }} onClose={() => setModals({ ...modals, perf: false })} />}
            {modals.subConfig && <SubjectConfigModal currentItems={settings.subjectProgressItems || []} currentWeights={settings.subjectProgressWeights || {}} allItems={settings.subjectConfigs?.[activeSubject] || settings.trackableItems} onSave={(i, w) => { onUpdateSettings({ ...settings, subjectProgressItems: i, subjectProgressWeights: w }); setModals({ ...modals, subConfig: false }); }} onClose={() => setModals({ ...modals, subConfig: false })} />}
            {modals.rename && <Modal isOpen={true} onClose={() => setModals({ ...modals, rename: null })} title="Rename Subject"><div className="flex flex-col gap-4"><input type="text" value={modals.rename.name} onChange={(e) => setModals({ ...modals, rename: { ...modals.rename!, name: e.target.value } })} className="bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm dark:text-white" /><div className="flex justify-end gap-3"><Button variant="secondary" onClick={() => setModals({ ...modals, rename: null })}>Cancel</Button><Button onClick={handleRename}>Save Name</Button></div></div></Modal>}
            {modals.addSub && <AddSubjectModal onClose={() => setModals({ ...modals, addSub: false })} onAdd={(name, emoji, color) => { const newSyllabus = { ...settings.syllabus, [`subj_${Date.now()}`]: { name, icon: emoji, color, chapters: [] } }; onUpdateSettings({ ...settings, syllabus: newSyllabus }); }} />}
            
            {/* Confirmation Modal */}
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