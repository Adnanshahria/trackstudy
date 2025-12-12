import React from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { TrackableItem } from '../../../types';

interface ViewProps {
    items: string[];
    weights: Record<string, number>;
    allItems: TrackableItem[];
    totalWeight: number;
    toggleItem: (key: string) => void;
    updateWeight: (key: string, val: number) => void;
    handleSave: () => void;
    onClose: () => void;
}

export const SubjectConfigView: React.FC<ViewProps> = (props) => {
    return (
        <Modal isOpen={true} onClose={props.onClose} title="Configure Subject Progress">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Select items for subject calculation.</p>
                    <span className={`text-xs font-bold ${props.totalWeight === 100 ? 'text-green-500' : 'text-amber-500'}`}>Total Weight: {props.totalWeight}%</span>
                </div>

                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 flex flex-col gap-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {props.allItems.map(item => {
                        const isChecked = props.items.includes(item.key);
                        const weight = props.weights[item.key] ?? 0;
                        return (
                            <div key={item.key} className="flex items-center justify-between p-2 rounded hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                <label className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => props.toggleItem(item.key)}
                                        className="accent-blue-500 w-4 h-4 rounded"
                                    />
                                    <span>{item.name}</span>
                                </label>
                                {isChecked && (
                                    <div className="flex items-center gap-2 animate-fade-in">
                                        <label className="text-[10px] text-slate-500 uppercase">Weight</label>
                                        <input
                                            type="number"
                                            value={weight || ''}
                                            onChange={(e) => props.updateWeight(item.key, parseInt(e.target.value) || 0)}
                                            className="w-14 bg-transparent border border-slate-300 dark:border-white/20 rounded px-2 py-1 text-xs text-center text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-end gap-3 mt-4">
                    <Button onClick={props.handleSave}>Save Configuration</Button>
                </div>
            </div>
        </Modal>
    );
};