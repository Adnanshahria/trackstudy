
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
    const colorMap: Record<string, { bar: string, border: string, bg: string, text: string, iconBg: string }> = {
        emerald: { bar: 'from-emerald-400 to-emerald-600', border: 'border-emerald-500/50', bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', iconBg: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' },
        amber: { bar: 'from-amber-400 to-amber-600', border: 'border-amber-500/50', bg: 'bg-amber-500/10', text: 'text-amber-700 dark:text-amber-300', iconBg: 'bg-amber-500/20 text-amber-600 dark:text-amber-400' },
        blue: { bar: 'from-blue-400 to-blue-600', border: 'border-blue-500/50', bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-300', iconBg: 'bg-blue-500/20 text-blue-600 dark:text-blue-400' },
        rose: { bar: 'from-rose-400 to-rose-600', border: 'border-rose-500/50', bg: 'bg-rose-500/10', text: 'text-rose-700 dark:text-rose-300', iconBg: 'bg-rose-500/20 text-rose-600 dark:text-rose-400' },
        indigo: { bar: 'from-indigo-400 to-indigo-600', border: 'border-indigo-500/50', bg: 'bg-indigo-500/10', text: 'text-indigo-700 dark:text-indigo-300', iconBg: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' },
        purple: { bar: 'from-purple-400 to-purple-600', border: 'border-purple-500/50', bg: 'bg-purple-500/10', text: 'text-purple-700 dark:text-purple-300', iconBg: 'bg-purple-500/20 text-purple-600 dark:text-purple-400' },
        teal: { bar: 'from-teal-400 to-teal-600', border: 'border-teal-500/50', bg: 'bg-teal-500/10', text: 'text-teal-700 dark:text-teal-300', iconBg: 'bg-teal-500/20 text-teal-600 dark:text-teal-400' },
    };

    const theme = colorMap[data.color] || colorMap.blue;

    const styles = {
        bar: theme.bar,
        border: isActive ? theme.border : 'border-transparent dark:border-white/5',
        bg: isActive ? theme.bg : 'bg-slate-50/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10',
        text: isActive ? theme.text : 'text-slate-700 dark:text-slate-300',
        icon: isActive ? theme.iconBg : 'bg-slate-200/50 dark:bg-white/10 text-slate-500 dark:text-slate-400'
    };
    
    // STRICT GRID LAYOUT: Icon (40px) | Text (1fr) | Percent (45px) | Delete (24px)
    // The last column is strictly 24px even if empty, preventing jitter.
    const gridStyle = { gridTemplateColumns: '40px minmax(0, 1fr) 45px 24px' };

    return (
        <div 
            onClick={() => onChangeSubject(subKey)} 
            className={`group grid items-center p-3 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden gap-3 ${styles.bg} ${styles.border} ${isActive ? 'shadow-md shadow-black/5' : ''}`}
            style={gridStyle}
        >
            {isActive && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${styles.bar}`}></div>}
            
            {/* 1. Icon */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-colors shrink-0 ${styles.icon}`}>{data.icon}</div>
            
            {/* 2. Content */}
            <div className="flex flex-col justify-center gap-1.5 min-w-0 h-[42px]">
                <div className="flex items-center gap-2 w-full h-[20px]">
                    <span className={`font-bold text-sm truncate w-full leading-tight ${styles.text}`} title={displayName}>{displayName}</span>
                    {isEditing && <button onClick={(e) => { e.stopPropagation(); onRename(); }} className="text-[10px] text-slate-500 hover:text-blue-500 p-1 shrink-0 bg-white/50 dark:bg-black/20 rounded">✏️</button>}
                </div>
                <div className="h-1.5 bg-slate-200/50 dark:bg-black/20 rounded-full overflow-hidden w-full">
                    <div className={`h-full rounded-full bg-gradient-to-r ${styles.bar} shadow-[0_0_10px_rgba(0,0,0,0.1)] relative`} style={{ width: `${Math.max(2, progress.overall)}%` }}>
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* 3. Percentage */}
            <div className="text-right flex items-center justify-end shrink-0">
                <span className={`text-xs font-mono font-bold ${styles.text}`}>{progress.overall.toFixed(0)}%</span>
            </div>

            {/* 4. Delete Btn - Reserved Space */}
            <div className="flex items-center justify-center shrink-0 w-6 h-6">
                {isEditing && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(); }} 
                        className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs hover:scale-110 shadow-sm transition-transform"
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
};
