
import React from 'react';
import { SubjectData } from '../../types';

interface Props {
    subject: SubjectData;
    onOpenPrintModal: () => void;
}

export const SyllabusHeader: React.FC<Props> = ({ subject, onOpenPrintModal }) => (
    <div className="flex items-center justify-between no-print glass-panel p-4 rounded-2xl">
        <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
            <span className="text-3xl filter drop-shadow-md">{subject.icon}</span> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">{subject.name} Syllabus</span>
        </h3>
        <div className="flex items-center gap-4">
            <button onClick={onOpenPrintModal} className="px-4 py-2 text-xs font-bold bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-2 shadow-sm">🖨️ Print View</button>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex gap-4">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow shadow-emerald-500/50"></span> Done</div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500 shadow shadow-rose-500/50"></span> Skip</div>
            </div>
        </div>
    </div>
);
