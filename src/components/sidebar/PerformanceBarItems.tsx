import React from 'react';
import { TrackableItem } from '../../types';

interface Props {
    items: string[];
    weights?: Record<string, number>;
    allItems: TrackableItem[];
    idx: number;
    toggleItem: (confIdx: number, itemKey: string) => void;
    updateWeight: (confIdx: number, itemKey: string, val: number) => void;
}

export const PerformanceBarItems: React.FC<Props> = ({ items, weights, allItems, idx, toggleItem, updateWeight }) => (
    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
        {allItems.map(item => {
            const isChecked = items.includes(item.key);
            const weight = weights?.[item.key] ?? 0;
            return (
                <div key={item.key} className="flex items-center justify-between p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                    <label className="flex items-center gap-3 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleItem(idx, item.key)}
                            className="accent-blue-500 rounded-sm w-3.5 h-3.5"
                        />
                        <span>{item.name}</span>
                    </label>
                    {isChecked && (
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                value={weight || ''}
                                onChange={(e) => updateWeight(idx, item.key, parseInt(e.target.value) || 0)}
                                className="w-12 bg-transparent border border-slate-300 dark:border-white/20 rounded px-1 py-0.5 text-[10px] text-center text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                            />
                            <span className="text-[9px] text-slate-500">%</span>
                        </div>
                    )}
                </div>
            );
        })}
    </div>
);