
import React from 'react';
import { CompositeData } from '../../../types';

export const WeightsGraph: React.FC<{ compositeData: CompositeData }> = ({ compositeData }) => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.values(compositeData.breakdown) as any[]).sort((a,b) => b.weight - a.weight).map(item => (
            <div key={item.name} className={`flex flex-col bg-white/50 dark:bg-white/5 rounded-xl p-3 border border-slate-200/50 dark:border-white/5 transition-all hover:bg-white/80 dark:hover:bg-white/10 ${item.weight === 0 ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                <div className="flex justify-between items-end mb-2">
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase truncate pr-1" title={item.name}>{item.name}</div>
                    <div className={`text-[10px] font-mono ${item.weight === 0 ? 'text-slate-400' : 'text-blue-600 dark:text-blue-400 font-bold'}`}>{item.weight}%</div>
                </div>
                <div className="h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden mb-2">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                </div>
                <div className="text-right text-[10px] font-bold text-slate-700 dark:text-slate-200">{item.val.toFixed(0)}%</div>
            </div>
        ))}
    </div>
);
