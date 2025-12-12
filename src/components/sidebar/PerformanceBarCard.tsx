import React from 'react';
import { ProgressBarConfig, TrackableItem } from '../../types';
import { PerformanceBarItems } from './PerformanceBarItems';

interface Props {
    conf: ProgressBarConfig;
    idx: number;
    allItems: TrackableItem[];
    titleEdit: { idx: number; val: string } | null;
    setTitleEdit: (val: { idx: number; val: string } | null) => void;
    updateConfigTitle: (idx: number, val: string) => void;
    toggleVisibility: (idx: number) => void;
    deleteBar: (idx: number) => void;
    toggleItem: (confIdx: number, itemKey: string) => void;
    updateWeight: (confIdx: number, itemKey: string, val: number) => void;
}

export const PerformanceBarCard: React.FC<Props> = ({ 
    conf, idx, allItems, titleEdit, setTitleEdit, updateConfigTitle, 
    toggleVisibility, deleteBar, toggleItem, updateWeight 
}) => {
    const totalWeight = conf.weights ? Object.values(conf.weights).reduce((a: number, b: number) => a + b, 0) : 0;

    return (
        <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 relative group">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-white/5">
                <div className="flex items-center gap-3 flex-1">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${conf.color}`}></div>
                    <input 
                        type="text" 
                        value={titleEdit?.idx === idx ? titleEdit.val : conf.title}
                        onChange={(e) => setTitleEdit({ idx, val: e.target.value })}
                        onBlur={() => { if (titleEdit) { updateConfigTitle(idx, titleEdit.val); setTitleEdit(null); } }}
                        className="bg-transparent font-bold text-sm border-b border-transparent hover:border-blue-500 focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-200 w-full"
                    />
                </div>
                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                    <input type="checkbox" checked={conf.visible !== false} onChange={() => toggleVisibility(idx)} className="accent-blue-500" />
                    <span className="text-slate-500 dark:text-slate-400">Visible</span>
                </label>
            </div>
            
            <button onClick={() => deleteBar(idx)} className="absolute top-2 right-2 text-rose-500 hover:bg-rose-500/10 p-1 rounded transition-all opacity-0 group-hover:opacity-100">🗑️</button>
            
            {conf.items.length > 0 && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-slate-400">ITEMS & WEIGHTS</span>
                    <span className={`text-[10px] font-bold ${totalWeight === 100 ? 'text-green-500' : 'text-amber-500'}`}>Total Weight: {totalWeight}%</span>
                </div>
            )}

            <PerformanceBarItems items={conf.items} weights={conf.weights} allItems={allItems} idx={idx} toggleItem={toggleItem} updateWeight={updateWeight} />
        </div>
    );
};