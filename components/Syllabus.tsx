import React, { useState } from 'react';
import { calculateProgress } from '../utils/calculations';
import { UserData, UserSettings, TrackableItem } from '../types';
import { Modal, Button } from './UI';

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
    if (!subject) return <div>Subject not found.</div>;

    const allItems = settings.subjectConfigs?.[activeSubject] || settings.trackableItems;
    const allChapters = subject.chapters;

    const handlePrint = () => window.print();

    return (
        <div className="flex flex-col gap-6 min-w-0">
             <div className="flex items-center justify-between no-print">
                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <span className="text-2xl mr-2">{subject.icon}</span> {subject.name} Syllabus
                </h3>
                <div className="flex items-center gap-4">
                    <button onClick={handlePrint} className="px-3 py-1.5 text-xs bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors flex items-center gap-2">
                         🖨️ Print
                    </button>
                    <div className="text-xs text-slate-500 dark:text-slate-400 hidden md:flex gap-4">
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500"></span> Done</div>
                        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-rose-500"></span> Skip</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 print-grid">
                {[1, 2].map(paper => {
                    const chapters = allChapters.filter(c => c.paper === paper);
                    const itemKeys = allItems.map(i => i.key);
                    const progress = calculateProgress(activeSubject, itemKeys, userData, undefined, allItems, settings.syllabus);
                    const pVal = paper === 1 ? progress.p1 : progress.p2;
                    const isOpen = settings.syllabusOpenState[`${activeSubject}-p${paper}`] !== false;

                    return (
                        <div key={paper} className="group glass-card rounded-3xl overflow-hidden transition-all border-slate-200 dark:border-white/10 print:border print:shadow-none print:rounded-lg">
                            <div className="relative flex items-center justify-between p-4 bg-slate-50/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors z-10 print:bg-gray-100">
                                <div 
                                    className="font-bold text-base flex items-center gap-3 text-slate-800 dark:text-slate-200 cursor-pointer flex-1"
                                    onClick={() => onTogglePaper(`${activeSubject}-p${paper}`)}
                                >
                                    <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-serif font-bold italic">P{paper}</span>
                                    Paper {paper}
                                    <span className="text-xs font-normal text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-black/20 px-2 py-0.5 rounded ml-1">{pVal.toFixed(0)}% Done</span>
                                </div>
                                <div className="flex items-center gap-3 no-print">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setEditMode(!editMode); }}
                                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${editMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-white/10 hover:text-blue-500'}`}
                                        title={editMode ? "Exit Edit Mode" : "Edit Syllabus"}
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={() => onTogglePaper(`${activeSubject}-p${paper}`)}
                                        className={`w-8 h-8 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all transform duration-300 ${isOpen ? 'bg-blue-600 text-white border-transparent rotate-180' : 'text-slate-400 dark:text-slate-400'}`}
                                    >
                                        ▼
                                    </button>
                                </div>
                            </div>
                            
                            {isOpen && (
                                <div className="overflow-auto custom-scrollbar max-h-[60vh] md:max-h-[70vh] animate-fade-in relative print:max-h-none print:overflow-visible">
                                    <table className="w-full text-left border-collapse min-w-[900px] print:min-w-0">
                                        <thead className="sticky top-0 z-30 print:static">
                                            <tr className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500 border-b border-slate-200 dark:border-white/10 bg-slate-50/95 dark:bg-[#0f172a] backdrop-blur-sm shadow-sm print:bg-white">
                                                <th className="p-2 pl-5 w-48 sticky left-0 top-0 z-50 bg-slate-50 dark:bg-[#0f172a] shadow-[2px_0_5px_rgba(0,0,0,0.05)] border-r border-slate-200 dark:border-white/5 print:static print:shadow-none print:w-auto print:bg-white">
                                                    Chapter
                                                </th>
                                                {allItems.map(t => (
                                                    <th key={t.key} className="p-2 text-center min-w-[60px] group/th relative border-r border-slate-200/50 dark:border-white/5 print:min-w-0 print:text-[8px] print:p-1">
                                                        <div className="flex flex-col items-center justify-center gap-1">
                                                            <span>{t.name}</span>
                                                            {editMode && (
                                                                <div className="flex gap-1 no-print">
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setRenameModal({ isOpen: true, key: t.key, currentName: t.name, type: 'column' });
                                                                        }}
                                                                        className="text-slate-400 hover:text-blue-500 transition-colors p-0.5"
                                                                    >
                                                                        ✏️
                                                                    </button>
                                                                    <button 
                                                                        onClick={(e) => { e.stopPropagation(); onDeleteColumn(activeSubject, t.key); }}
                                                                        className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
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
                                                            className="w-6 h-6 rounded-full bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white flex items-center justify-center transition-colors mx-auto"
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
                                                        <td className="p-2 pl-5 font-medium sticky left-0 z-20 bg-white dark:bg-[#1e293b] text-xs md:text-sm shadow-[2px_0_5px_rgba(0,0,0,0.05)] border-r border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 group/ch h-10 leading-tight print:static print:shadow-none print:bg-white print:text-black print:p-1">
                                                            <div className="flex items-center justify-between gap-2 h-full">
                                                                <span className="line-clamp-2 leading-tight" title={ch.name}>{ch.name}</span>
                                                                {editMode && (
                                                                    <div className="flex items-center gap-1 min-w-fit no-print">
                                                                        <button 
                                                                            onClick={() => setRenameModal({ isOpen: true, key: ch.id, currentName: ch.name, type: 'chapter' })}
                                                                            className="text-[10px] text-slate-400 hover:text-blue-500 transition-opacity p-1"
                                                                        >
                                                                            ✏️
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => onDeleteChapter(activeSubject, ch.id)}
                                                                            className="text-[10px] text-slate-400 hover:text-rose-500 transition-opacity p-1"
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
                                                                        className={`absolute top-0 right-0 w-3 h-3 rounded-full flex items-center justify-center text-[6px] transition-transform hover:scale-110 no-print ${hasNote ? 'bg-blue-500 text-white shadow-sm z-10' : 'text-slate-400 opacity-0 group-hover/cell:opacity-100 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-white/10'}`}
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
                                                    <td colSpan={allItems.length + 2} className="p-2 text-center sticky left-0 bg-slate-50/80 dark:bg-[#1e293b]/80 backdrop-blur-sm border-t border-slate-200 dark:border-white/10 z-20">
                                                        <button 
                                                            onClick={() => setAddChapterModal({ isOpen: true, paper: paper as 1 | 2 })}
                                                            className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-lg text-slate-500 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/5 transition-all text-xs font-bold flex items-center justify-center gap-2"
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
                <Modal isOpen={noteModal.isOpen} onClose={() => setNoteModal(null)} title="Study Note">
                    <div className="flex flex-col gap-4">
                        <p className="text-xs text-slate-500 dark:text-slate-400">ID: {noteModal.key}</p>
                        <textarea 
                            className="w-full h-40 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 text-slate-800 dark:text-slate-200 resize-none"
                            value={noteModal.text}
                            onChange={(e) => setNoteModal(prev => prev ? { ...prev, text: e.target.value } : null)}
                            placeholder="Add details or reminders..."
                        />
                        <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setNoteModal(null)}>Cancel</Button>
                            <Button onClick={() => {
                                onUpdateNote(noteModal.key, noteModal.text);
                                setNoteModal(null);
                            }}>Save Note</Button>
                        </div>
                    </div>
                </Modal>
            )}

            {renameModal && (
                <Modal isOpen={renameModal.isOpen} onClose={() => setRenameModal(null)} title={renameModal.type === 'chapter' ? "Rename Chapter" : "Rename Column"}>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs text-slate-500">New Name</label>
                            <input 
                                type="text"
                                value={renameModal.currentName}
                                onChange={(e) => setRenameModal(prev => prev ? { ...prev, currentName: e.target.value } : null)}
                                className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
                            />
                        </div>
                         <div className="flex justify-end gap-3">
                            <Button variant="secondary" onClick={() => setRenameModal(null)}>Cancel</Button>
                            <Button onClick={() => {
                                if (renameModal.type === 'column') {
                                    onRenameColumn(activeSubject, renameModal.key as string, renameModal.currentName);
                                } else {
                                    onRenameChapter(activeSubject, renameModal.key, renameModal.currentName);
                                }
                                setRenameModal(null);
                            }}>Save</Button>
                        </div>
                    </div>
                </Modal>
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

const AddColumnModal = ({ onClose, onAdd }: { onClose: () => void, onAdd: (name: string, color: string) => void }) => {
    const [name, setName] = useState('');
    const [color, setColor] = useState('bg-purple-500');
    const colors = [
        { name: 'Blue', val: 'bg-blue-500' },
        { name: 'Green', val: 'bg-emerald-500' },
        { name: 'Orange', val: 'bg-amber-500' },
        { name: 'Purple', val: 'bg-purple-500' },
        { name: 'Pink', val: 'bg-pink-500' },
        { name: 'Gray', val: 'bg-slate-500' },
    ];

    return (
        <Modal isOpen={true} onClose={onClose} title="Add New Column">
             <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-500">Column Name</label>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
                        placeholder="e.g. Model Test"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-xs text-slate-500">Color</label>
                    <div className="flex gap-2 flex-wrap">
                        {colors.map(c => (
                            <button 
                                key={c.val}
                                onClick={() => setColor(c.val)}
                                className={`w-8 h-8 rounded-full ${c.val} transition-transform ${color === c.val ? 'scale-110 ring-2 ring-offset-2 ring-slate-400' : ''}`}
                                title={c.name}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-2">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => { if(name.trim()) { onAdd(name, color); onClose(); } }} disabled={!name.trim()}>Add Column</Button>
                </div>
            </div>
        </Modal>
    );
};

const AddChapterModal = ({ paper, onClose, onAdd }: { paper: 1 | 2, onClose: () => void, onAdd: (name: string) => void }) => {
    const [name, setName] = useState('');
    return (
        <Modal isOpen={true} onClose={onClose} title={`Add Chapter to Paper ${paper}`}>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-500">Chapter Name</label>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
                        placeholder="e.g. New Chapter"
                    />
                </div>
                <div className="flex justify-end gap-3 mt-2">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={() => { if(name.trim()) { onAdd(name); onClose(); } }} disabled={!name.trim()}>Add Chapter</Button>
                </div>
            </div>
        </Modal>
    );
};

const StatusButton: React.FC<{ val: number; onClick: () => void }> = ({ val, onClick }) => {
    let bg = "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 print:border-gray-300";
    let text = "text-slate-400 dark:text-slate-400 print:text-gray-400";
    let label = (val * 20) + '%';
    let fill = val * 20;

    if (val === 5) { bg = "!bg-emerald-500 !border-emerald-600 print:!bg-gray-300 print:!border-black"; text = "text-white print:text-black"; label = "✓"; fill = 100; }
    else if (val === 6) { bg = "!bg-rose-500 !border-rose-600 print:!bg-white print:!border-black"; text = "text-white print:text-black"; label = "✕"; fill = 0; }

    return (
        <button 
            onClick={onClick}
            className={`relative overflow-hidden w-10 h-7 rounded-lg border flex items-center justify-center text-[10px] font-bold transition-all active:scale-95 ${bg} ${text} shadow-sm print:shadow-none`}
        >
            {val !== 5 && val !== 6 && <div className="absolute top-0 bottom-0 left-0 bg-sky-500/20 dark:bg-sky-500/30 print:bg-gray-300 transition-all duration-300" style={{ width: `${fill}%` }} />}
            <span className="relative z-10 drop-shadow-sm">{label}</span>
        </button>
    );
};