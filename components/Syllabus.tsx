import React, { useState } from 'react';
import { calculateProgress } from '../utils/calculations';
import { UserData, UserSettings } from '../types';
import { StatusButton } from './syllabus/StatusButton';
import { AddColumnModal } from './syllabus/modals/AddColumnModal';
import { AddChapterModal } from './syllabus/modals/AddChapterModal';
import { NoteModal } from './syllabus/modals/NoteModal';
import { RenameModal } from './syllabus/modals/RenameModal';

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
}

export const Syllabus: React.FC<SyllabusProps> = ({ activeSubject, userData, settings, onUpdateStatus, onUpdateNote, onTogglePaper, onRenameColumn, onAddColumn, onAddChapter, onDeleteChapter, onDeleteColumn, onRenameChapter }) => {
    const [noteModal, setNoteModal] = useState<{ isOpen: boolean; key: string; text: string } | null>(null);
    const [renameModal, setRenameModal] = useState<{ isOpen: boolean; key: string | number; currentName: string; type: 'column' | 'chapter' } | null>(null);
    const [addColumnModal, setAddColumnModal] = useState(false);
    const [addChapterModal, setAddChapterModal] = useState<{ isOpen: boolean; paper: 1 | 2 } | null>(null);
    const [editMode, setEditMode] = useState(false);
    
    const subject = settings.syllabus[activeSubject];
    if (!subject) return <div className="p-10 text-center text-slate-500">Subject not found.</div>;

    const allItems = settings.subjectConfigs?.[activeSubject] || settings.trackableItems;
    const allChapters = subject.chapters;

    const handlePrint = () => window.print();

    return (
        <div className="flex flex-col gap-6 min-w-0">
             <div className="flex items-center justify-between no-print glass-panel p-4 rounded-2xl">
                <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
                    <span className="text-3xl filter drop-shadow-md">{subject.icon}</span> 
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">{subject.name} Syllabus</span>
                </h3>
                <div className="flex items-center gap-4">
                    <button onClick={handlePrint} className="px-4 py-2 text-xs font-bold bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-2 shadow-sm">
                         🖨️ Print View
                    </button>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 hidden md:flex gap-4">
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow shadow-emerald-500/50"></span> Done</div>
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500 shadow shadow-rose-500/50"></span> Skip</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 print-grid">
                {[1, 2].map(paper => {
                    const chapters = allChapters.filter(c => c.paper === paper);
                    const itemKeys = allItems.map(i => i.key);
                    const progress = calculateProgress(activeSubject, itemKeys, userData, undefined, allItems, settings.syllabus);
                    const pVal = paper === 1 ? progress.p1 : progress.p2;
                    const isOpen = settings.syllabusOpenState[`${activeSubject}-p${paper}`] !== false;

                    return (
                        <div key={paper} className="group glass-panel rounded-3xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-sm print:border print:shadow-none print:rounded-lg">
                            <div className="relative flex items-center justify-between p-4 bg-slate-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors z-10 print:bg-gray-100">
                                <div 
                                    className="font-bold text-lg flex items-center gap-4 text-slate-800 dark:text-slate-200 cursor-pointer flex-1 select-none"
                                    onClick={() => onTogglePaper(`${activeSubject}-p${paper}`)}
                                >
                                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/20 dark:to-indigo-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-serif font-black italic shadow-inner">P{paper}</span>
                                    <span>Paper {paper}</span>
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-black/30 px-3 py-1 rounded-full ml-2 border border-black/5 dark:border-white/10">{pVal.toFixed(0)}% Done</span>
                                </div>
                                <div className="flex items-center gap-3 no-print">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setEditMode(!editMode); }}
                                        className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${editMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-white/10 hover:text-blue-500'}`}
                                        title={editMode ? "Exit Edit Mode" : "Edit Syllabus"}
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={() => onTogglePaper(`${activeSubject}-p${paper}`)}
                                        className={`w-9 h-9 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all transform duration-300 hover:bg-white/20 ${isOpen ? 'bg-blue-600 text-white border-transparent rotate-180' : 'text-slate-400 dark:text-slate-400'}`}
                                    >
                                        ▼
                                    </button>
                                </div>
                            </div>
                            
                            {isOpen && (
                                <div className="overflow-auto custom-scrollbar max-h-[60vh] md:max-h-[70vh] relative print:max-h-none print:overflow-visible">
                                    <table className="w-full text-left border-collapse min-w-[900px] print:min-w-0">
                                        <thead className="sticky top-0 z-30 print:static">
                                            <tr className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500 border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#0f172a] shadow-sm print:bg-white">
                                                <th className="p-3 pl-6 w-56 sticky left-0 top-0 z-40 bg-slate-100 dark:bg-[#0f172a] border-r border-slate-200 dark:border-white/5 print:static print:shadow-none print:w-auto print:bg-white">
                                                    Chapter
                                                </th>
                                                {allItems.map(t => (
                                                    <th key={t.key} className="p-3 text-center min-w-[70px] group/th relative border-r border-slate-200/50 dark:border-white/5 print:min-w-0 print:text-[8px] print:p-1">
                                                        <div className="flex flex-col items-center justify-center gap-1">
                                                            <span className="font-bold">{t.name}</span>
                                                            {editMode && (
                                                                <div className="flex gap-1 no-print">
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setRenameModal({ isOpen: true, key: t.key, currentName: t.name, type: 'column' });
                                                                        }}
                                                                        className="text-slate-400 hover:text-blue-500 transition-colors p-1 hover:bg-slate-200 dark:hover:bg-white/10 rounded"
                                                                    >
                                                                        ✏️
                                                                    </button>
                                                                    <button 
                                                                        onClick={(e) => { e.stopPropagation(); onDeleteColumn(activeSubject, t.key); }}
                                                                        className="text-slate-400 hover:text-rose-500 transition-colors p-1 hover:bg-rose-100 dark:hover:bg-rose-500/10 rounded"
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </th>
                                                ))}
                                                {editMode && (
                                                    <th className="p-2 text-center w-12 bg-blue-500/5 sticky right-0 z-30 no-print">
                                                        <button 
                                                            onClick={() => setAddColumnModal(true)}
                                                            className="w-8 h-8 rounded-full bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white flex items-center justify-center transition-colors mx-auto"
                                                        >
                                                            +
                                                        </button>
                                                    </th>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm print:text-xs">
                                            {chapters.map(ch => {
                                                return (
                                                    <tr key={ch.id} className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group/tr break-inside-avoid">
                                                        {/* STICKY COLUMN: Matches header background to hide scrolling content */}
                                                        <td className="p-3 pl-6 font-medium sticky left-0 z-20 bg-slate-50 dark:bg-[#020617] text-xs md:text-sm border-r border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 group/ch h-12 leading-tight print:static print:shadow-none print:bg-white print:text-black print:p-1">
                                                            <div className="flex items-center justify-between gap-2 h-full">
                                                                <span className="line-clamp-2 leading-tight font-semibold" title={ch.name}>{ch.name}</span>
                                                                {editMode && (
                                                                    <div className="flex items-center gap-1 min-w-fit no-print opacity-0 group-hover/ch:opacity-100 transition-opacity">
                                                                        <button 
                                                                            onClick={() => setRenameModal({ isOpen: true, key: ch.id, currentName: ch.name, type: 'chapter' })}
                                                                            className="text-[10px] text-slate-400 hover:text-blue-500 transition-colors p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10"
                                                                        >
                                                                            ✏️
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => onDeleteChapter(activeSubject, ch.id)}
                                                                            className="text-[10px] text-slate-400 hover:text-rose-500 transition-colors p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-500/10"
                                                                        >
                                                                            ✕
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        {allItems.map((item) => {
                                                            const itemIdx = allItems.findIndex(x => x.key === item.key);
                                                            const key = `s_${activeSubject}_${ch.id}_${itemIdx}`;
                                                            const val = userData[key] ?? 0;
                                                            const hasNote = !!userData[`note_${key}`];
                                                            return (
                                                                <td key={item.key} className="p-1 text-center relative group/cell border-r border-slate-200/30 dark:border-white/5 print:border-slate-200">
                                                                    <div className="flex justify-center">
                                                                        <StatusButton val={val} onClick={() => onUpdateStatus(key)} />
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => setNoteModal({ isOpen: true, key, text: userData[`note_${key}`] || '' })}
                                                                        className={`absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] transition-transform hover:scale-110 no-print ${hasNote ? 'bg-amber-400 text-white shadow-sm z-10' : 'text-slate-400 opacity-0 group-hover/cell:opacity-100 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-white/10'}`}
                                                                        title="Add/View Note"
                                                                    >
                                                                        {hasNote ? '📝' : '+'}
                                                                    </button>
                                                                </td>
                                                            );
                                                        })}
                                                        {editMode && <td className="p-2 bg-slate-50/30 dark:bg-white/5 no-print"></td>}
                                                    </tr>
                                                );
                                            })}
                                            
                                            {editMode && (
                                                <tr className="no-print">
                                                    <td colSpan={allItems.length + 2} className="p-4 text-center sticky left-0 bg-slate-100 dark:bg-[#0f172a] border-t border-slate-200 dark:border-white/10 z-20">
                                                        <button 
                                                            onClick={() => setAddChapterModal({ isOpen: true, paper: paper as 1 | 2 })}
                                                            className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl text-slate-500 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/5 transition-all text-xs font-bold flex items-center justify-center gap-2"
                                                        >
                                                            <span>+ Add New Chapter to Paper {paper}</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {noteModal && (
                <NoteModal 
                    isOpen={noteModal.isOpen} 
                    onClose={() => setNoteModal(null)} 
                    noteKey={noteModal.key} 
                    text={noteModal.text}
                    onSave={() => {
                        onUpdateNote(noteModal.key, noteModal.text);
                        setNoteModal(null);
                    }}
                    setText={(s) => setNoteModal(prev => prev ? { ...prev, text: s } : null)}
                />
            )}

            {renameModal && (
                <RenameModal 
                    isOpen={renameModal.isOpen}
                    onClose={() => setRenameModal(null)}
                    currentName={renameModal.currentName}
                    type={renameModal.type}
                    onSave={() => {
                        if (renameModal.type === 'column') {
                            onRenameColumn(activeSubject, renameModal.key as string, renameModal.currentName);
                        } else {
                            onRenameChapter(activeSubject, renameModal.key, renameModal.currentName);
                        }
                        setRenameModal(null);
                    }}
                    setName={(s) => setRenameModal(prev => prev ? { ...prev, currentName: s } : null)}
                />
            )}

            {addColumnModal && (
                <AddColumnModal 
                    onClose={() => setAddColumnModal(false)}
                    onAdd={(name, color) => onAddColumn(activeSubject, name, color)}
                />
            )}

            {addChapterModal && (
                <AddChapterModal 
                    paper={addChapterModal.paper}
                    onClose={() => setAddChapterModal(null)}
                    onAdd={(name) => onAddChapter(activeSubject, addChapterModal.paper, name)}
                />
            )}
        </div>
    );
};