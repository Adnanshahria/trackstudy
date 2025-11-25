import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ProgressBarConfig, TrackableItem } from '../../types';

export const PerformanceConfigModal = ({ currentConfig, allItems, onSave, onClose }: { currentConfig: ProgressBarConfig[], allItems: TrackableItem[], onSave: (c: ProgressBarConfig[]) => void, onClose: () => void }) => {
    const [config, setConfig] = useState<ProgressBarConfig[]>(JSON.parse(JSON.stringify(currentConfig)));
    const [titleEdit, setTitleEdit] = useState<{idx: number, val: string} | null>(null);

    const toggleVisibility = (idx: number) => {
        const newC = [...config];
        newC[idx].visible = !newC[idx].visible;
        setConfig(newC);
    };

    const toggleItem = (confIdx: number, itemKey: string) => {
        const newC = [...config];
        const items = newC[confIdx].items;
        if (items.includes(itemKey)) {
            newC[confIdx].items = items.filter(k => k !== itemKey);
            if (newC[confIdx].weights) delete newC[confIdx].weights![itemKey];
        } else {
            newC[confIdx].items = [...items, itemKey];
            if (!newC[confIdx].weights) newC[confIdx].weights = {};
            newC[confIdx].weights![itemKey] = 10; 
        }
        setConfig(newC);
    };

    const updateWeight = (confIdx: number, itemKey: string, val: number) => {
        const newC = [...config];
        if (!newC[confIdx].weights) newC[confIdx].weights = {};
        newC[confIdx].weights![itemKey] = Math.max(0, val);
        setConfig(newC);
    };
    
    const deleteBar = (idx: number) => {
        if (confirm("Delete this progress bar?")) {
            const newC = config.filter((_, i) => i !== idx);
            setConfig(newC);
        }
    };
    
    const addBar = () => {
        const newBar: ProgressBarConfig = {
            id: `p_${Date.now()}`,
            title: "New Progress",
            items: [],
            color: 'from-blue-400 to-blue-600',
            visible: true
        };
        setConfig([...config, newBar]);
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Configure Progress Bars">
            <div className="flex flex-col gap-6">
                {config.map((conf, idx) => {
                    const totalWeight = conf.weights ? Object.values(conf.weights).reduce((a: number, b: number) => a+b, 0) : 0;
                    const activeItemsCount = conf.items.length;
                    
                    return (
                        <div key={conf.id} className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 relative group">
                             <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-white/5">
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${conf.color}`}></div>
                                    <input 
                                        type="text" 
                                        value={titleEdit?.idx === idx ? titleEdit.val : conf.title}
                                        onChange={(e) => setTitleEdit({ idx, val: e.target.value })}
                                        onBlur={() => {
                                            if(titleEdit) {
                                                const newC = [...config];
                                                newC[idx].title = titleEdit.val;
                                                setConfig(newC);
                                                setTitleEdit(null);
                                            }
                                        }}
                                        className="bg-transparent font-bold text-sm border-b border-transparent hover:border-blue-500 focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-200 w-full"
                                    />
                                </div>
                                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                                    <input type="checkbox" checked={conf.visible !== false} onChange={() => toggleVisibility(idx)} className="accent-blue-500" />
                                    <span className="text-slate-500 dark:text-slate-400">Visible</span>
                                </label>
                            </div>
                            
                             <button 
                                onClick={() => deleteBar(idx)}
                                className="absolute top-2 right-2 text-rose-500 hover:bg-rose-500/10 p-1 rounded transition-all opacity-0 group-hover:opacity-100"
                                title="Delete Bar"
                            >
                                🗑️
                            </button>
                            
                            {activeItemsCount > 0 && (
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[10px] font-bold text-slate-400">ITEMS & WEIGHTS</span>
                                    <span className={`text-[10px] font-bold ${totalWeight === 100 ? 'text-green-500' : 'text-amber-500'}`}>Total Weight: {totalWeight}%</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                                {allItems.map(item => {
                                    const isChecked = conf.items.includes(item.key);
                                    const weight = conf.weights?.[item.key] ?? 0;
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
                                                        value={weight} 
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
                        </div>
                    );
                })}
                 <button 
                    onClick={addBar}
                    className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-white/10 rounded-xl text-slate-500 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/5 transition-all font-bold text-xs flex items-center justify-center gap-2"
                >
                    + Add New Progress Bar
                </button>
                <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-white/10">
                     <Button onClick={() => onSave(config)}>Save Changes</Button>
                </div>
            </div>
        </Modal>
    );
}