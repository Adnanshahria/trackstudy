import React from 'react';

interface Props {
    paper: number;
    pVal: number;
    isOpen: boolean;
    activeSubject: string;
    onTogglePaper: (key: string) => void;
    editMode: boolean;
    onToggleEdit: () => void;
    onDeletePaper?: (sub: string, paperId: number) => void;
}

export const PaperHeader: React.FC<Props> = ({ paper, pVal, isOpen, activeSubject, onTogglePaper, editMode, onToggleEdit, onDeletePaper }) => (
    <div className="relative flex items-center justify-between p-2 md:p-4 bg-slate-50/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors z-10 border-b-2 border-slate-200 dark:border-white/10">
        <div className="font-bold text-base md:text-lg flex items-center gap-2 md:gap-4 text-slate-800 dark:text-slate-200 cursor-pointer flex-1 select-none" onClick={() => onTogglePaper(`${activeSubject}-p${paper}`)}>
            <span className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/20 dark:to-indigo-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-serif font-black italic shadow-inner text-sm md:text-base">P{paper}</span>
            <span className="hidden md:inline">Paper {paper}</span>
            <span className="md:hidden">P{paper}</span>
            <span className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-black/30 px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-black/5 dark:border-white/10">{pVal.toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-1 md:gap-3 no-print relative z-50 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            {editMode && onDeletePaper && (
                <button onClick={(e) => { e.stopPropagation(); onDeletePaper(activeSubject, paper); }} className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full transition-all text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-sm cursor-pointer relative z-50">✕</button>
            )}
            <button onClick={(e) => { e.stopPropagation(); onToggleEdit(); }} className={`w-7 h-7 md:w-9 md:h-9 flex items-center justify-center rounded-full transition-all text-sm cursor-pointer relative z-50 ${editMode ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-blue-500'}`}>✏️</button>
            <button onClick={() => onTogglePaper(`${activeSubject}-p${paper}`)} className={`w-7 h-7 md:w-9 md:h-9 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all text-sm cursor-pointer relative z-50 ${isOpen ? 'bg-blue-600 text-white rotate-180' : 'text-slate-400'}`}>▼</button>
        </div>
    </div>
);