
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
        <table className="w-full text-left border-collapse min-w-[380px] md:min-w-[500px] lg:min-w-[700px] print:min-w-0">
            <thead className="sticky top-0 z-30 print:static">
                <tr className="text-[9px] md:text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 bg-slate-100 dark:bg-[#0f172a] shadow-sm table-header-glow print:font-bold">
                    <th className="p-1.5 md:p-2 pl-2 md:pl-4 w-20 md:w-28 lg:w-32 sticky left-0 top-0 z-40 bg-slate-100 dark:bg-[#0f172a] border-r border-slate-200 dark:border-white/5 print:static font-bold">Chapter</th>
                    {allItems.map(t => (
                        <th key={t.key} className="p-1 md:p-2 text-center min-w-[36px] md:min-w-[45px] border-r border-slate-200/50 dark:border-white/5 print:min-w-0">
                            <div className="flex flex-col items-center justify-center gap-0.5 md:gap-1"><span className="font-bold text-[8px] md:text-[10px]">{t.name}</span>{editMode && <div className="flex gap-1 no-print"><button onClick={() => setRenameModal({ isOpen: true, key: t.key, currentName: t.name, type: 'column' })} className="text-slate-400 hover:text-blue-500 transition-colors text-[10px]">✏️</button><button onClick={() => onDeleteColumn(activeSubject, t.key)} className="text-slate-400 hover:text-rose-500 transition-colors text-[10px]">✕</button></div>}</div>
                        </th>
                    ))}
                    {editMode && <th className="p-1 md:p-2 text-center w-8 md:w-10 bg-blue-500/5 sticky right-0 z-30 no-print"><button onClick={() => setAddColumnModal(true)} className="w-5 h-5 md:w-7 md:h-7 rounded-full transition-all bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 text-xs">+</button></th>}
                </tr>
            </thead>
            <tbody className="text-xs md:text-sm print:text-xs">
                {chapters.map((ch, idx) => <ChapterRow key={ch.id} ch={ch} index={idx} activeSubject={activeSubject} allItems={allItems} userData={userData} editMode={editMode} actions={actions} />)}
                {editMode && <tr className="no-print"><td colSpan={allItems.length + 2} className="p-2 md:p-4 text-center sticky left-0 bg-slate-100 dark:bg-[#0f172a] border-t border-slate-200 dark:border-white/10 z-20"><button onClick={() => setAddChapterModal({ isOpen: true, paper })} className="w-full py-2 md:py-3 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-lg md:rounded-xl text-slate-500 hover:text-blue-500 transition-all text-[10px] md:text-xs font-bold">+ Add Chapter</button></td></tr>}
            </tbody>
        </table>
    </div>
);
