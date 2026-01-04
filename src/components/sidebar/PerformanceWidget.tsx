
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
        <div className="bg-slate-800/80 border border-slate-700/50 shadow-lg shadow-black/20 rounded-2xl p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[10px] md:text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full" />
                    Performance
                </h3>
                <div className="flex gap-1">
                    <button
                        onClick={onConfig}
                        className="text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 w-7 h-7 rounded-lg font-bold text-lg flex items-center justify-center transition-colors"
                        title="Add Progress Bar"
                    >
                        +
                    </button>
                    <button
                        onClick={onConfig}
                        className="text-slate-400 hover:text-white hover:bg-slate-700 w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-sm"
                        title="Edit Performance"
                    >
                        ✏️
                    </button>
                </div>
            </div>

            {/* Progress Bars */}
            <div className="flex flex-col gap-4">
                {settings.progressBars.filter(conf => conf.visible !== false).map(conf => {
                    if (conf.items.length === 0) return null;
                    const items = settings.subjectConfigs?.[activeSubject] || settings.trackableItems;
                    const p = calculateProgress(activeSubject, conf.items, userData, conf.weights, items, settings.syllabus);
                    return (
                        <div key={conf.id}>
                            <div className="flex justify-between text-xs font-semibold mb-1.5">
                                <span className="text-slate-300">{conf.title}</span>
                                <span className="text-indigo-400 tabular-nums">{p.overall.toFixed(1)}%</span>
                            </div>
                            <ProgressBar progress={p.overall} color={`bg-gradient-to-r ${conf.color}`} className="!h-2.5" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
