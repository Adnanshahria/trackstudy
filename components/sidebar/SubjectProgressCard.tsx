
import React from 'react';
import { ProgressBar } from '../ui/ProgressBar';
import { calculateProgress } from '../../utils/calculations';
import { UserData, UserSettings } from '../../types';

interface Props {
    activeSubject: string;
    settings: UserSettings;
    userData: UserData;
    onConfig: () => void;
    onChangeSubject: (key: string) => void;
}

export const SubjectProgressCard: React.FC<Props> = ({ activeSubject, settings, userData, onConfig, onChangeSubject }) => {
    const subject = settings.syllabus[activeSubject];
    if (!subject) return null;

    const items = settings.subjectConfigs?.[activeSubject] || settings.trackableItems;
    const subjectItems = settings.subjectProgressItems?.length
        ? settings.subjectProgressItems
        : items.map(i => i.key);

    const progress = calculateProgress(
        activeSubject,
        subjectItems,
        userData,
        settings.subjectProgressWeights,
        items,
        settings.syllabus
    );

    // Get all subjects for dropdown
    const allSubjects = Object.entries(settings.syllabus).map(([key, data]) => ({
        key,
        name: settings.customNames?.[key] || data.name,
        icon: data.icon
    }));

    // Color based on subject
    const colorMap: Record<string, string> = {
        emerald: 'from-emerald-400 to-emerald-600',
        amber: 'from-amber-400 to-amber-600',
        blue: 'from-blue-400 to-blue-600',
        rose: 'from-rose-400 to-rose-600',
        indigo: 'from-indigo-400 to-indigo-600',
        purple: 'from-purple-400 to-purple-600',
        teal: 'from-teal-400 to-teal-600',
    };
    const barColor = colorMap[subject.color] || colorMap.blue;

    return (
        <div className="glass-panel rounded-3xl p-5 shadow-sm shrink-0">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-cyan-500 rounded-full"></span>
                    Subject Progress
                </h3>
                <button
                    onClick={onConfig}
                    className="text-slate-400 hover:text-blue-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
                    title="Configure subject progress"
                >
                    ⚙️
                </button>
            </div>

            {/* Native Dropdown for Subject Selection */}
            <div className="mb-4">
                <select
                    value={activeSubject}
                    onChange={(e) => onChangeSubject(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '20px' }}
                >
                    {allSubjects.map(sub => (
                        <option key={sub.key} value={sub.key}>
                            {sub.icon} {sub.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-3">
                {/* Overall Progress */}
                <div>
                    <div className="flex justify-between text-xs font-bold mb-1.5 text-slate-700 dark:text-slate-300">
                        <span>Overall</span>
                        <span className="text-blue-600 dark:text-blue-400">{progress.overall.toFixed(1)}%</span>
                    </div>
                    <ProgressBar progress={progress.overall} color={`bg-gradient-to-r ${barColor}`} className="!h-3" />
                </div>

                {/* Paper 1 Progress */}
                <div>
                    <div className="flex justify-between text-[10px] font-bold mb-1 text-slate-500 dark:text-slate-400">
                        <span>Paper 1</span>
                        <span>{progress.p1.toFixed(1)}%</span>
                    </div>
                    <ProgressBar progress={progress.p1} color={`bg-gradient-to-r from-cyan-400 to-cyan-600`} className="!h-2" />
                </div>

                {/* Paper 2 Progress */}
                <div>
                    <div className="flex justify-between text-[10px] font-bold mb-1 text-slate-500 dark:text-slate-400">
                        <span>Paper 2</span>
                        <span>{progress.p2.toFixed(1)}%</span>
                    </div>
                    <ProgressBar progress={progress.p2} color={`bg-gradient-to-r from-violet-400 to-violet-600`} className="!h-2" />
                </div>
            </div>
        </div>
    );
};
