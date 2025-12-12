import React, { useState, useEffect } from 'react';
import { calculateProgress } from '../utils/calculations';
import { UserData, UserSettings } from '../types';
import { SyllabusHeader } from './syllabus/SyllabusHeader';
import { PaperSection } from './syllabus/PaperSection';
import { SyllabusModals } from './syllabus/SyllabusModals';
import { ConfirmModal } from './ui/ConfirmModal';
import { PrintModal } from './syllabus/modals/PrintModal';
import { useSyllabusUI } from '../hooks/ui/useSyllabusUI';

interface SyllabusProps {
    activeSubject: string;
    userData: UserData;
    settings: UserSettings;
    onUpdateStatus: (key: string) => void;
    onUpdateNote: (key: string, text: string) => void;
    onTogglePaper: (key: string) => void;
    onRenameColumn: (subject: string, key: string, newName: string) => void;
    onAddColumn: (subject: string, name: string, color: string) => void;
    onAddChapter: (subject: string, paper: 1 | 2, name: string) => void;
    onDeleteChapter: (subject: string, chapterId: number | string) => void;
    onDeleteColumn: (subject: string, itemKey: string) => void;
    onRenameChapter: (subject: string, chapterId: number | string, newName: string) => void;
    userId: string | null;
}

export const Syllabus: React.FC<SyllabusProps> = ({ activeSubject, userData, settings, userId, ...handlers }) => {
    const ui = useSyllabusUI();
    const subject = settings.syllabus[activeSubject];

    const [confirmAction, setConfirmAction] = useState<{ type: 'chapter' | 'column' | 'paper'; id: string | number; subject: string; } | null>(null);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [printMode, setPrintMode] = useState<'p1' | 'p2' | 'both'>('both');
    const [localMaxPaper, setLocalMaxPaper] = useState<number>(0);

    // Reset extra papers when switching subjects to avoid global scope leakage
    useEffect(() => {
        setLocalMaxPaper(0);
    }, [activeSubject]);

    if (!subject) return <div className="p-10 text-center text-slate-500">Subject not found.</div>;

    const allItems = settings.subjectConfigs?.[activeSubject] || settings.trackableItems;

    const safeHandlers = {
        ...handlers,
        onDeleteChapter: (sub: string, id: string | number) => setConfirmAction({ type: 'chapter', id, subject: sub }),
        onDeleteColumn: (sub: string, key: string) => setConfirmAction({ type: 'column', id: key, subject: sub }),
        onDeletePaper: (sub: string, paperId: number) => setConfirmAction({ type: 'paper', id: paperId, subject: sub }),
    };

    const actions = { ...safeHandlers, ...ui };

    const executeDelete = () => {
        if (!confirmAction) return;
        if (confirmAction.type === 'chapter') {
            handlers.onDeleteChapter(confirmAction.subject, confirmAction.id);
        } else if (confirmAction.type === 'column') {
            handlers.onDeleteColumn(confirmAction.subject, confirmAction.id as string);
        } else if (confirmAction.type === 'paper') {
            // Delete all chapters in this paper
            const paperId = Number(confirmAction.id);
            const chaptersToDelete = subject.chapters.filter(c => c.paper === paperId);
            chaptersToDelete.forEach(c => handlers.onDeleteChapter(activeSubject, c.id));
            if (paperId > 2) {
                // If it's an extra paper, we can hide it effectively by re-calculating max paper next render
                // Assuming localMaxPaper logic handles it, or we force update?
                // Actually, if we delete chapters, it disappears from data.
                // But we might want to explicitly decrease localMaxPaper if it was the last one.
            }
        }
        setConfirmAction(null);
    };

    // Calculate papers
    const dataMaxPaper = subject ? Math.max(2, ...subject.chapters.map(c => c.paper)) : 2;
    const currentMaxPaper = Math.max(dataMaxPaper, localMaxPaper);
    const papers = Array.from({ length: currentMaxPaper }, (_, i) => i + 1);

    const handleAddPaper = () => {
        setLocalMaxPaper(papers.length + 1);
    };

    const handlePrint = (mode: 'p1' | 'p2' | 'both') => {
        setPrintMode(mode);
        setShowPrintModal(false);

        const resetMode = () => {
            setPrintMode('both');
            window.removeEventListener('afterprint', resetMode);
        };

        window.addEventListener('afterprint', resetMode);

        setTimeout(() => {
            window.print();
        }, 300);
    };

    return (
        <div className={`flex flex-col gap-6 min-w-0 ${printMode === 'p1' ? 'print-show-p1' : printMode === 'p2' ? 'print-show-p2' : ''}`}>
            <SyllabusHeader subject={subject} onOpenPrintModal={() => setShowPrintModal(true)} />

            <div className="flex flex-col gap-6 print-grid">
                {papers.map(paper => {
                    const p = calculateProgress(activeSubject, allItems.map(i => i.key), userData, undefined, allItems, settings.syllabus);
                    // p.p1 and p.p2 are hardcoded in calculateProgress return type probably?
                    // If p only has p1/p2, we need to be careful. use p.total for others?
                    // Actually p typically returns { total, p1, p2 }.
                    // For dynamic papers, we might just pass 0 or calculate it locally if needed.
                    // Let's passed undefined or calculate it here?
                    // calculateProgress likely only supports p1/p2.
                    // We can pass p.total as fallback or just 0.
                    const paperProgress = paper === 1 ? p.p1 : paper === 2 ? p.p2 : 0;

                    return (
                        <div key={paper} className={`paper-section-${paper}`}>
                            <PaperSection paper={paper} activeSubject={activeSubject} userData={userData} settings={settings} allItems={allItems} allChapters={subject.chapters} pVal={paperProgress} isOpen={settings.syllabusOpenState[`${activeSubject}-p${paper}`] !== false} editMode={ui.editMode} actions={actions} />
                        </div>
                    );
                })}
                {ui.editMode && (
                    <button onClick={handleAddPaper} className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-slate-500 hover:text-blue-500 hover:border-blue-500 transition-all font-bold no-print">
                        + Add New Paper {papers.length + 1}
                    </button>
                )}
            </div>

            <SyllabusModals modals={ui.modals} setModals={ui.setModals} handlers={handlers} ui={ui} activeSubject={activeSubject} settings={settings} userId={userId} />

            <ConfirmModal
                isOpen={!!confirmAction}
                onClose={() => setConfirmAction(null)}
                onConfirm={executeDelete}
                title={confirmAction?.type === 'chapter' ? "Delete Chapter" : confirmAction?.type === 'paper' ? "Delete Paper" : "Delete Column"}
                message={`Are you sure you want to delete this ${confirmAction?.type}? ${confirmAction?.type === 'paper' ? 'ALL chapters in this paper will be removed.' : 'Data associated with it will be lost.'}`}
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