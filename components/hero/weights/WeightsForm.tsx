import React from 'react';
import { Button } from '../../ui/Button';
import { UserSettings, TrackableItem, SubjectData } from '../../../types';

interface Props {
    settings: UserSettings;
    selectedSubject: string;
    setSelectedSubject: (s: string) => void;
    weightTotal: number;
    tempWeights: Record<string, number>;
    handleWeightChange: (k: string, v: string) => void;
    saveWeights: () => void;
    currentConfigItems: TrackableItem[];
}

export const WeightsForm: React.FC<Props> = ({ settings, selectedSubject, setSelectedSubject, weightTotal, tempWeights, handleWeightChange, saveWeights, currentConfigItems }) => (
    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/10 animate-fade-in backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Config:</span>
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 dark:text-white">
                    <option value="global">Global Defaults</option>
                    {Object.entries(settings.syllabus).map(([key, data]) => <option key={key} value={key}>{(data as SubjectData).name}</option>)}
                </select>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded ${weightTotal === 100 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-500 dark:text-rose-400"}`}>Total: {weightTotal}%</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 max-h-[200px] overflow-y-auto custom-scrollbar">
            {currentConfigItems.map((item: TrackableItem) => (
                <div key={item.key} className="flex flex-col gap-1">
                    <label className="text-[10px] text-slate-600 dark:text-slate-400 uppercase truncate font-semibold" title={item.name}>{item.name}</label>
                    <div className="relative">
                        <input type="number" value={tempWeights[item.key] ?? ''} onChange={(e) => handleWeightChange(item.key, e.target.value)} className="w-full bg-transparent border border-slate-300 dark:border-white/20 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-white" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 dark:text-slate-400">%</span>
                    </div>
                </div>
            ))}
        </div>
        <Button disabled={weightTotal !== 100} onClick={saveWeights} className={`w-full ${weightTotal !== 100 ? 'opacity-50 cursor-not-allowed' : ''}`}>Save Weights</Button>
    </div>
);