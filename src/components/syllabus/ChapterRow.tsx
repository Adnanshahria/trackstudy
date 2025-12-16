import React from 'react';
import { TrackableItem, UserData, Chapter } from '../../types';
import { StatusButton } from './StatusButton';

interface Props {
    ch: Chapter;
    index: number;
    activeSubject: string;
    allItems: TrackableItem[];
    userData: UserData;
    editMode: boolean;
    actions: any;
}

export const ChapterRow: React.FC<Props> = ({ ch, index, activeSubject, allItems, userData, editMode, actions }) => (
    <tr className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group/tr">
        <td className="p-1 md:p-2 pl-2 md:pl-4 font-medium sticky left-0 z-20 bg-slate-50 dark:bg-[#020617] text-xs md:text-sm border-r border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 group/ch h-8 md:h-10 leading-tight print:static">
            <div className="flex items-center justify-between gap-1 md:gap-2 h-full">
                <div className="flex items-center gap-1 md:gap-2 overflow-hidden">
                    <span className="text-[8px] md:text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold shrink-0">{index + 1}.</span>
                    <span className="line-clamp-2 leading-tight font-semibold text-[11px] md:text-sm" title={ch.name}>{ch.name}</span>
                </div>
                {editMode && (
                    <div className="flex items-center gap-0.5 md:gap-1 min-w-fit no-print opacity-100 lg:opacity-0 lg:group-hover/ch:opacity-100 transition-opacity">
                        <button onClick={() => actions.setRenameModal({ isOpen: true, key: ch.id, currentName: ch.name, type: 'chapter' })} className="text-[9px] md:text-[10px] text-slate-400 hover:text-blue-500 transition-colors">✏️</button>
                        <button onClick={() => actions.onDeleteChapter(activeSubject, ch.id)} className="text-[9px] md:text-[10px] text-slate-400 hover:text-rose-500 transition-colors">✕</button>
                    </div>
                )}
            </div>
        </td>
        {allItems.map((item) => {
            const key = `s_${activeSubject}_${ch.id}_${item.key}`;
            const val = userData[key] ?? 0;
            const hasNote = !!userData[`note_${key}`];
            return (
                <td key={item.key} className="p-0.5 md:p-1 pr-3 md:pr-5 text-center relative border-r border-slate-200/30 dark:border-white/5 print:border-slate-200">
                    <div className="flex justify-center"><StatusButton val={val} onClick={() => actions.onUpdateStatus(key)} /></div>
                    <button onClick={() => actions.setNoteModal({ isOpen: true, key, text: userData[`note_${key}`] || '' })} className={`note-icon absolute flex items-center justify-center no-print transition-all ${hasNote ? 'bg-amber-400/90 text-white border-amber-500 opacity-100' : 'bg-transparent text-slate-400 dark:text-slate-500 border-slate-300/50 dark:border-slate-600/50 opacity-40 hover:opacity-100'}`} style={{ top: '1px', right: '1px', width: '12px', height: '12px', fontSize: '8px', borderRadius: '2px', borderWidth: '1px', borderStyle: 'solid' }}>{hasNote ? '📝' : '+'}</button>
                </td>
            );
        })}
        {editMode && <td className="p-0.5 md:p-1 bg-slate-50/30 dark:bg-white/5 no-print"></td>}
    </tr>
);