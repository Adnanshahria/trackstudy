
import React from 'react';
import { ProgressBar } from '../ui/ProgressBar';
import { calculateProgress } from '../../utils/calculations';
import { UserData, UserSettings } from '../../types';

interface Props {
    settings: UserSettings;
    userData: UserData;
    activeSubject: string;
    onConfig: () => void;
}

export const PerformanceWidget: React.FC<Props> = ({ settings, userData, activeSubject, onConfig }) => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2"><span className="w-1.5 h-4 bg-purple-500 rounded-full"></span> Performance</h3>
                <div className="flex gap-1">
                    <button onClick={onConfig} className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 p-1 rounded-lg font-bold text-lg leading-none" title="Add Progress Bar">+</button>
                    <button onClick={onConfig} className="text-slate-400 hover:text-blue-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5">⚙️</button>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                {settings.progressBars.filter(conf => conf.visible !== false).map(conf => {
                    if (conf.items.length === 0) return null;
                    const items = settings.subjectConfigs?.[activeSubject] || settings.trackableItems;
                    const p = calculateProgress(activeSubject, conf.items, userData, conf.weights, items, settings.syllabus);
                    return (
                        <div key={conf.id}>
                            <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300"><span>{conf.title}</span><span className="text-blue-600 dark:text-blue-400">{p.overall.toFixed(1)}%</span></div>
                            <ProgressBar progress={p.overall} color={`bg-gradient-to-r ${conf.color}`} className="!h-2.5" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
