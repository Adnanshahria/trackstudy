
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

    const colorMap: Record<string, { bar: string, border: string, bg: string, text: string }> = {
        emerald: { bar: 'bg-emerald-500', border: 'border-emerald-500/50', bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300' },
        amber: { bar: 'bg-amber-500', border: 'border-amber-500/50', bg: 'bg-amber-500/10', text: 'text-amber-700 dark:text-amber-300' },
        blue: { bar: 'bg-blue-500', border: 'border-blue-500/50', bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-300' },
        rose: { bar: 'bg-rose-500', border: 'border-rose-500/50', bg: 'bg-rose-500/10', text: 'text-rose-700 dark:text-rose-300' },
        indigo: { bar: 'bg-indigo-500', border: 'border-indigo-500/50', bg: 'bg-indigo-500/10', text: 'text-indigo-700 dark:text-indigo-300' },
        purple: { bar: 'bg-purple-500', border: 'border-purple-500/50', bg: 'bg-purple-500/10', text: 'text-purple-700 dark:text-purple-300' },
        teal: { bar: 'bg-teal-500', border: 'border-teal-500/50', bg: 'bg-teal-500/10', text: 'text-teal-700 dark:text-teal-300' },
    };

    const theme = colorMap[data.color] || colorMap.blue;

    const styles = {
        bar: theme.bar,
        border: isActive ? theme.border : 'border-transparent',
        bg: isActive ? theme.bg : 'bg-transparent hover:bg-white/50 dark:hover:bg-white/5',
        text: isActive ? theme.text : 'text-slate-600 dark:text-slate-400',
        icon: 'bg-slate-100 dark:bg-white/5'
    };
    
    // FIX: Fixed 4-column layout. 4th column (24px) is always reserved for the delete button.
    // This prevents the middle content column from resizing when the delete button appears/disappears.
    const gridStyle = { gridTemplateColumns: '40px minmax(0, 1fr) 45px 24px' };

    return (
        <div 
            onClick={() => onChangeSubject(subKey)} 
            className={`group grid items-center p-3 rounded-2xl border cursor-pointer transition-colors relative overflow-hidden gap-3 ${styles.bg} ${styles.border}`}
            style={gridStyle}
        >
            {isActive && <div className={`absolute left-0 top-0 bottom-0 w-1 ${styles.bar}`}></div>}
            
            {/* 1. Icon: Fixed */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-colors shrink-0 ${styles.icon}`}>{data.icon}</div>
            
            {/* 2. Content: Fluid */}
            <div className="flex flex-col justify-center gap-1.5 min-w-0">
                <div className="flex items-center gap-2 w-full">
                    <span className={`font-bold text-sm truncate w-full ${styles.text}`} title={displayName}>{displayName}</span>
                    {isEditing && <button onClick={(e) => { e.stopPropagation(); onRename(); }} className="text-[10px] text-slate-400 hover:text-blue-500 p-1 shrink-0">✏️</button>}
                </div>
                <div className="h-1.5 bg-slate-200 dark:bg-black/20 rounded-full overflow-hidden w-full">
                    <div className={`h-full rounded-full ${styles.bar}`} style={{ width: `${progress.overall}%` }}></div>
                </div>
            </div>

            {/* 3. Percentage: Fixed */}
            <div className="text-right flex items-center justify-end shrink-0">
                <span className={`text-xs font-mono font-bold ${styles.text}`}>{progress.overall.toFixed(0)}%</span>
            </div>

            {/* 4. Delete Btn: Fixed Reserved Space */}
            <div className="flex items-center justify-center shrink-0 w-6">
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
