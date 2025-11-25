import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TrackableItem } from '../../types';

export const SubjectConfigModal = ({ currentItems, currentWeights, allItems, onSave, onClose }: { currentItems: string[], currentWeights: Record<string, number>, allItems: TrackableItem[], onSave: (i: string[], w: Record<string, number>) => void, onClose: () => void }) => {
    const [items, setItems] = useState<string[]>(currentItems);
    const [weights, setWeights] = useState<Record<string, number>>({ ...currentWeights });

    const toggleItem = (key: string) => {
        if (items.includes(key)) {
            setItems(items.filter(k => k !== key));
            const newW = { ...weights }; delete newW[key]; setWeights(newW);
        } else {
            setItems([...items, key]);
            setWeights({ ...weights, [key]: 10 }); 
        }
    };

    const updateWeight = (key: string, val: number) => {
        setWeights({ ...weights, [key]: Math.max(0, val) });
    };
    
    const totalWeight = Object.values(weights).reduce((a: number, b: number) => a+b, 0);

    return (
        <Modal isOpen={true} onClose={onClose} title="Configure Subject Progress">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Select items for subject calculation.</p>
                    <span className={`text-xs font-bold ${totalWeight === 100 ? 'text-green-500' : 'text-amber-500'}`}>Total Weight: {totalWeight}%</span>
                </div>
                
                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 flex flex-col gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {allItems.map(item => {
                        const isChecked = items.includes(item.key);
                        const weight = weights[item.key] ?? 0;
                        return (
                            <div key={item.key} className="flex items-center justify-between p-2 rounded hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                                    <input 
                                        type="checkbox" 
                                        checked={isChecked} 
                                        onChange={() => toggleItem(item.key)}
                                        className="accent-blue-500 w-4 h-4 rounded" 
                                    />
                                    <span>{item.name}</span>
                                </label>
                                {isChecked && (
                                    <div className="flex items-center gap-2 animate-fade-in">
                                        <label className="text-[10px] text-slate-500 uppercase">Weight</label>
                                        <input 
                                            type="number" 
                                            value={weight} 
                                            onChange={(e) => updateWeight(item.key, parseInt(e.target.value) || 0)}
                                            className="w-14 bg-transparent border border-slate-300 dark:border-white/20 rounded px-2 py-1 text-xs text-center text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-end gap-3 mt-4">
                     <Button onClick={() => onSave(items, weights)}>Save Configuration</Button>
                </div>
            </div>
        </Modal>
    );
}