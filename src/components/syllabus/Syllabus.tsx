
import React, { useState, useEffect, useCallback } from 'react';
import { calculateProgress } from '../../utils/calculations';
import { UserData, UserSettings } from '../../types';
import { SyllabusHeader } from './SyllabusHeader';
import { PaperSection } from './PaperSection';
import { SyllabusModals } from './SyllabusModals';
import { ConfirmModal } from '../ui/ConfirmModal';
import { PrintModal } from './modals/PrintModal';
import { useSyllabusUI } from '../../hooks/ui/useSyllabusUI';

interface SyllabusProps {
    activeSubject: string;
    userData: UserData;
    settings: UserSettings;
    userId: string | null;
    onUpdateStatus: (key: string) => void;
    onUpdateNote: (key: string, text: string) => void;
    onTogglePaper: (key: string) => void;
    onRenameColumn: (subject: string, key: string, newName: string) => void;
    onAddColumn: (subject: string, name: string, color: string) => void;
    onAddChapter: (subject: string, paper: 1 | 2, name: string) => void;
    onDeleteChapter: (subject: string, chapterId: number | string) => void;
    onDeleteColumn: (subject: string, itemKey: string) => void;
    onRenameChapter: (subject: string, chapterId: number | string, newName: string) => void;
}

export const Syllabus: React.FC<SyllabusProps> = ({ activeSubject, userData, settings, userId, ...handlers }) => {
    // ALL HOOKS MUST BE CALLED UNCONDITIONALLY - no early returns allowed
    const ui = useSyllabusUI();
    const [confirmAction, setConfirmAction] = useState<{ type: 'chapter' | 'column'; id: string | number; subject: string; } | null>(null);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [printMode, setPrintMode] = useState<'p1' | 'p2' | 'both'>('both');

    useEffect(() => {
        const resetPrintMode = () => {
            setPrintMode('both');
        };
        window.addEventListener('afterprint', resetPrintMode);
        return () => window.removeEventListener('afterprint', resetPrintMode);
    }, []);

    const handlePrint = useCallback((mode: 'p1' | 'p2' | 'both') => {
        setPrintMode(mode);
        setShowPrintModal(false);
        setTimeout(() => {
            window.print();
        }, 0);
    }, []);

    // Get subject (may be undefined for new users)
    const subject = settings.syllabus?.[activeSubject];

    // Compute derived values only if subject exists
    const allItems = subject ? (settings.subjectConfigs?.[activeSubject] || settings.trackableItems) : [];

    const safeHandlers = {
        ...handlers,
        onDeleteChapter: (sub: string, id: string | number) => setConfirmAction({ type: 'chapter', id, subject: sub }),
        onDeleteColumn: (sub: string, key: string) => setConfirmAction({ type: 'column', id: key, subject: sub }),
    };

    const actions = { ...safeHandlers, ...ui };

    const executeDelete = () => {
        if (!confirmAction) return;
        if (confirmAction.type === 'chapter') {
            handlers.onDeleteChapter(confirmAction.subject, confirmAction.id);
        } else {
            handlers.onDeleteColumn(confirmAction.subject, confirmAction.id as string);
        }
        setConfirmAction(null);
    };

    // Subject is guaranteed to exist by parent component (DashboardPage)

    return (
        <div className={`flex flex-col gap-6 min-w-0 ${printMode === 'p1' ? 'print-show-p1' : printMode === 'p2' ? 'print-show-p2' : ''}`}>
            <SyllabusHeader subject={subject} onOpenPrintModal={() => setShowPrintModal(true)} />

            <div className="flex flex-col gap-6 print-grid">
                {(settings.academicLevel === 'SSC' ? [1] : [1, 2]).map(paper => {
                    const p = calculateProgress(activeSubject, allItems.map(i => i.key), userData, undefined, allItems, settings.syllabus);
                    return (
                        <div key={paper} className={`paper-section-${paper}`}>
                            <PaperSection paper={paper} activeSubject={activeSubject} userData={userData} settings={settings} allItems={allItems} allChapters={subject.chapters} pVal={paper === 1 ? p.p1 : p.p2} isOpen={settings.syllabusOpenState[`${activeSubject}-p${paper}`] !== false} editMode={ui.editMode} actions={actions} />
                        </div>
                    );
                })}
            </div>

            <SyllabusModals modals={ui.modals} setModals={ui.setModals} handlers={handlers} ui={ui} activeSubject={activeSubject} settings={settings} userId={userId} />

            <ConfirmModal
                isOpen={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                onConfirm={executeDelete}
                title={confirmAction?.type === 'chapter' ? "Delete Chapter" : "Delete Column"}
                message={`Are you sure you want to delete this ${confirmAction?.type}? Data associated with it will be lost.`}
                confirmText="Delete"
                isDanger={true}
            />

            <PrintModal
                isOpen={showPrintModal}
                onClose={() => setShowPrintModal(false)}
                onPrint={handlePrint}
            />
        </div>
    );
};
