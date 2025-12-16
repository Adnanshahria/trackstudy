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
            <div className="flex flex-col gap-3 md:gap-4">
                <div className="flex justify-between items-center">
                    <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400">Select items for subject calculation.</p>
                    <span className={`text-[10px] md:text-xs font-bold ${props.totalWeight === 100 ? 'text-green-500' : 'text-amber-500'}`}>Total: {props.totalWeight}%</span>
                </div>

                <div className="bg-slate-50 dark:bg-black p-2 md:p-4 rounded-lg md:rounded-xl border border-slate-200 dark:border-white/10 flex flex-col gap-1.5 md:gap-2 max-h-[50vh] md:max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {props.allItems.map(item => {
                        const isChecked = props.items.includes(item.key);
                        const weight = props.weights[item.key] ?? 0;
                        return (
                            <div key={item.key} className="flex items-center justify-between p-1.5 md:p-2 rounded hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                                <label className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-slate-700 dark:text-slate-200 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => props.toggleItem(item.key)}
                                        className="accent-blue-500 w-3.5 h-3.5 md:w-4 md:h-4 rounded"
                                    />
                                    <span>{item.name}</span>
                                </label>
                                {isChecked && (
                                    <div className="flex items-center gap-1.5 md:gap-2 animate-fade-in">
                                        <label className="text-[8px] md:text-[10px] text-slate-500 uppercase">Wt</label>
                                        <input
                                            type="number"
                                            value={weight || ''}
                                            onChange={(e) => props.updateWeight(item.key, parseInt(e.target.value) || 0)}
                                            className="w-10 md:w-14 bg-transparent border border-slate-300 dark:border-white/20 rounded px-1.5 md:px-2 py-0.5 md:py-1 text-[10px] md:text-xs text-center text-slate-800 dark:text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-end gap-2 md:gap-3 mt-2 md:mt-4">
                    <Button onClick={props.handleSave}>Save Configuration</Button>
                </div>
            </div>
        </Modal>
    );
};