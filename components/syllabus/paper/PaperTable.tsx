
import React from 'react';
import { TrackableItem, UserData, Chapter } from '../../../types';
import { ChapterRow } from '../ChapterRow';

interface Props {
    paper: number;
    chapters: Chapter[];
    allItems: TrackableItem[];
    userData: UserData;
    activeSubject: string;
    editMode: boolean;
    actions: any;
    setRenameModal: (v: any) => void;
    onDeleteColumn: (s: string, k: string) => void;
    setAddColumnModal: (v: boolean) => void;
    setAddChapterModal: (v: any) => void;
}

export const PaperTable: React.FC<Props> = ({ paper, chapters, allItems, userData, activeSubject, editMode, actions, setRenameModal, onDeleteColumn, setAddColumnModal, setAddChapterModal }) => (
    <div className="overflow-x-auto lg:overflow-y-auto custom-scrollbar lg:max-h-[70vh] relative print:max-h-none print:overflow-visible">
        <table className="w-full text-left border-collapse min-w-[500px] lg:min-w-[700px] print:min-w-0">
            <thead className="sticky top-0 z-30 print:static">
                <tr className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 bg-slate-100 dark:bg-[#0f172a] shadow-sm print:bg-white table-header-glow print:font-bold">
                    <th className="p-2 pl-4 w-28 lg:w-32 sticky left-0 top-0 z-40 bg-slate-100 dark:bg-[#0f172a] border-r border-slate-200 dark:border-white/5 print:static font-bold">Chapter</th>
                    {allItems.map(t => (
                        <th key={t.key} className="p-2 text-center min-w-[45px] border-r border-slate-200/50 dark:border-white/5 print:min-w-0">
                            <div className="flex flex-col items-center justify-center gap-1"><span className="font-bold">{t.name}</span>{editMode && <div className="flex gap-1 no-print"><button onClick={() => setRenameModal({ isOpen: true, key: t.key, currentName: t.name, type: 'column' })} className="text-slate-400 hover:text-blue-500 transition-colors">✏️</button><button onClick={() => onDeleteColumn(activeSubject, t.key)} className="text-slate-400 hover:text-rose-500 transition-colors">✕</button></div>}</div>
                        </th>
                    ))}
                    {editMode && <th className="p-2 text-center w-10 bg-blue-500/5 sticky right-0 z-30 no-print"><button onClick={() => setAddColumnModal(true)} className="w-7 h-7 rounded-full transition-all bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">+</button></th>}
                </tr>
            </thead>
            <tbody className="text-sm print:text-xs">
                {chapters.map((ch, idx) => <ChapterRow key={ch.id} ch={ch} index={idx} activeSubject={activeSubject} allItems={allItems} userData={userData} editMode={editMode} actions={actions} />)}
                {editMode && <tr className="no-print"><td colSpan={allItems.length + 2} className="p-4 text-center sticky left-0 bg-slate-100 dark:bg-[#0f172a] border-t border-slate-200 dark:border-white/10 z-20"><button onClick={() => setAddChapterModal({ isOpen: true, paper })} className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl text-slate-500 hover:text-blue-500 transition-all text-xs font-bold">+ Add New Chapter to Paper {paper}</button></td></tr>}
            </tbody>
        </table>
    </div>
);
