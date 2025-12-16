
import React from 'react';
import { calculateProgress } from '../../utils/calculations';
import { SubjectData, UserData, UserSettings } from '../../types';

interface Props {
    subKey: string;
    data: SubjectData;
    isActive: boolean;
    isEditing: boolean;
    userData: UserData;
    settings: UserSettings;
    onChangeSubject: (key: string) => void;
    onRename: () => void;
    onDelete: () => void;
}

export const SubjectItem: React.FC<Props> = ({ subKey, data, isActive, isEditing, userData, settings, onChangeSubject, onRename, onDelete }) => {
    const items = settings.subjectConfigs?.[subKey] || settings.trackableItems;
    const progress = calculateProgress(subKey, items.map(i => i.key), userData, settings.subjectProgressWeights, items, settings.syllabus);
    const displayName = settings.customNames?.[subKey] || data.name;

    // Enhanced Color Map with Gradients & Transparencies
    const colorMap: Record<string, { bar: string, border: string, bg: string, text: string, iconBg: string, shadowHex: string }> = {
        emerald: { bar: 'from-emerald-400 to-emerald-600', border: 'border-emerald-500/30 ring-1 ring-emerald-500/20', bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', iconBg: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400', shadowHex: 'rgba(16,185,129,0.5)' },
        amber: { bar: 'from-amber-400 to-amber-600', border: 'border-amber-500/30 ring-1 ring-amber-500/20', bg: 'bg-amber-500/10', text: 'text-amber-700 dark:text-amber-300', iconBg: 'bg-amber-500/20 text-amber-600 dark:text-amber-400', shadowHex: 'rgba(245,158,11,0.5)' },
        blue: { bar: 'from-blue-400 to-blue-600', border: 'border-blue-500/30 ring-1 ring-blue-500/20', bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-300', iconBg: 'bg-blue-500/20 text-blue-600 dark:text-blue-400', shadowHex: 'rgba(59,130,246,0.5)' },
        rose: { bar: 'from-rose-400 to-rose-600', border: 'border-rose-500/30 ring-1 ring-rose-500/20', bg: 'bg-rose-500/10', text: 'text-rose-700 dark:text-rose-300', iconBg: 'bg-rose-500/20 text-rose-600 dark:text-rose-400', shadowHex: 'rgba(244,63,94,0.5)' },
        indigo: { bar: 'from-indigo-400 to-indigo-600', border: 'border-indigo-500/30 ring-1 ring-indigo-500/20', bg: 'bg-indigo-500/10', text: 'text-indigo-700 dark:text-indigo-300', iconBg: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400', shadowHex: 'rgba(99,102,241,0.5)' },
        purple: { bar: 'from-purple-400 to-purple-600', border: 'border-purple-500/30 ring-1 ring-purple-500/20', bg: 'bg-purple-500/10', text: 'text-purple-700 dark:text-purple-300', iconBg: 'bg-purple-500/20 text-purple-600 dark:text-purple-400', shadowHex: 'rgba(168,85,247,0.5)' },
        teal: { bar: 'from-teal-400 to-teal-600', border: 'border-teal-500/30 ring-1 ring-teal-500/20', bg: 'bg-teal-500/10', text: 'text-teal-700 dark:text-teal-300', iconBg: 'bg-teal-500/20 text-teal-600 dark:text-teal-400', shadowHex: 'rgba(20,184,166,0.5)' },
    };

    const theme = colorMap[data.color] || colorMap.blue;

    const styles = {
        bar: theme.bar,
        border: isActive ? theme.border : 'border-slate-200/50 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20',
        bg: isActive ? theme.bg : 'bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/60',
        text: isActive ? theme.text : 'text-slate-700 dark:text-slate-300',
        icon: isActive ? theme.iconBg : 'bg-slate-200/50 dark:bg-white/5 text-slate-500 dark:text-slate-400'
    };

    // STRICT GRID LAYOUT: Icon (32px/40px) | Text (1fr) | Percent (40px/45px) | Delete (20px/24px)
    const gridStyle = {
        gridTemplateColumns: '32px minmax(0, 1fr) 36px 20px',
        boxShadow: isActive ? `0 0 25px ${theme.shadowHex}, inset 0 0 10px ${theme.shadowHex.replace('0.5)', '0.1)')}` : undefined,
        zIndex: isActive ? 10 : 1,
        borderColor: isActive ? theme.shadowHex : undefined
    };
    const gridStyleMd = { gridTemplateColumns: '40px minmax(0, 1fr) 45px 24px' };

    return (
        <div
            onClick={() => onChangeSubject(subKey)}
            className={`group grid items-center p-3 md:p-4 rounded-xl md:rounded-2xl border cursor-pointer transition-all duration-300 relative gap-3 md:gap-4 hover:scale-[1.02] active:scale-[0.98] backdrop-blur-md ${styles.bg} ${styles.border}`}
            style={gridStyle}
        >
            {isActive && <div className={`absolute left-0 top-1.5 bottom-1.5 w-1 md:w-1.5 rounded-r-md bg-gradient-to-b ${styles.bar}`}></div>}

            {/* 1. Icon */}
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-base md:text-xl transition-colors shrink-0 ${styles.icon}`}>{data.icon}</div>

            {/* 2. Content */}
            <div className="flex flex-col justify-center gap-1 md:gap-1.5 min-w-0 h-[36px] md:h-[42px]">
                <div className="flex items-center gap-1 md:gap-2 w-full h-[18px] md:h-[20px]">
                    <span className={`font-bold text-xs md:text-sm truncate w-full leading-tight ${styles.text}`} title={displayName}>{displayName}</span>
                    {isEditing && <button onClick={(e) => { e.stopPropagation(); onRename(); }} className="text-[9px] md:text-[10px] text-slate-400 hover:text-blue-500 p-0.5 md:p-1 shrink-0 bg-white/50 dark:bg-black/20 rounded">✏️</button>}
                </div>
                <div className="h-1 md:h-1.5 bg-slate-200/50 dark:bg-black/20 rounded-full overflow-hidden w-full">
                    <div className={`h-full rounded-full bg-gradient-to-r ${styles.bar} shadow-[0_0_10px_rgba(0,0,0,0.1)] relative`} style={{ width: `${Math.max(2, progress.overall)}%` }}>
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* 3. Percentage */}
            <div className="text-right flex items-center justify-end shrink-0">
                <span className={`text-[10px] md:text-xs font-mono font-bold ${styles.text}`}>{progress.overall.toFixed(0)}%</span>
            </div>

            {/* 4. Delete Btn - Reserved Space */}
            <div className="flex items-center justify-center shrink-0 w-5 h-5 md:w-6 md:h-6">
                {isEditing && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="w-5 h-5 md:w-6 md:h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] md:text-xs hover:scale-110 shadow-sm transition-transform"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
};
