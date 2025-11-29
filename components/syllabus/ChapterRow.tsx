import React from 'react';
import { TrackableItem, UserData, Chapter } from '../../types';
import { StatusButton } from './StatusButton';

interface Props {
    ch: Chapter;
    activeSubject: string;
    allItems: TrackableItem[];
    userData: UserData;
    editMode: boolean;
    actions: any;
}

export const ChapterRow: React.FC<Props> = ({ ch, activeSubject, allItems, userData, editMode, actions }) => (
    <tr className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group/tr">
        <td className="p-3 pl-6 font-medium sticky left-0 z-20 bg-slate-50 dark:bg-[#020617] text-xs md:text-sm border-r border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 group/ch h-12 leading-tight print:static">
            <div className="flex items-center justify-between gap-2 h-full">
                <span className="line-clamp-2 leading-tight font-semibold" title={ch.name}>{ch.name}</span>
                {editMode && (
                    <div className="flex items-center gap-1 min-w-fit no-print opacity-100 md:opacity-0 md:group-hover/ch:opacity-100 transition-opacity">
                        <button onClick={() => actions.setRenameModal({ isOpen: true, key: ch.id, currentName: ch.name, type: 'chapter' })} className="text-[10px] text-slate-400 hover:text-blue-500 transition-colors">✏️</button>
                        <button onClick={() => actions.onDeleteChapter(activeSubject, ch.id)} className="text-[10px] text-slate-400 hover:text-rose-500 transition-colors">✕</button>
                    </div>
                )}
            </div>
        </td>
        {allItems.map((item) => {
            // FIX: Use item.key directly for data storage/retrieval.
            // This ensures that if columns are reordered or deleted, the data stays with the correct column type.
            const key = `s_${activeSubject}_${ch.id}_${item.key}`;
            const val = userData[key] ?? 0;
            const hasNote = !!userData[`note_${key}`];
            return (
                <td key={item.key} className="p-1 text-center relative group/cell border-r border-slate-200/30 dark:border-white/5 print:border-slate-200">
                    <div className="flex justify-center"><StatusButton val={val} onClick={() => actions.onUpdateStatus(key)} /></div>
                    <button onClick={() => actions.setNoteModal({ isOpen: true, key, text: userData[`note_${key}`] || '' })} className={`absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] transition-transform hover:scale-110 no-print ${hasNote ? 'bg-amber-400 text-white shadow-sm z-10' : 'text-slate-400 opacity-60 hover:opacity-100'}`}>{hasNote ? '📝' : '+'}</button>
                </td>
            );
        })}
        {editMode && <td className="p-2 bg-slate-50/30 dark:bg-white/5 no-print"></td>}
    </tr>
);