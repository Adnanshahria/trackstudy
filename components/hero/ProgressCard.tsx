
import React from 'react';
import { CompositeData } from '../../types';

interface Props {
    compositeData: CompositeData;
    onEdit?: () => void;
    isEditing?: boolean;
    children?: React.ReactNode;
}

export const ProgressCard: React.FC<Props> = ({ compositeData, onEdit, isEditing, children }) => {
    return (
        <div className="glass-card relative overflow-hidden group p-3 rounded-2xl transition-all duration-300 h-full flex flex-col justify-between">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-1.5">
                    <div>
                        <h2 className="text-[9px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-0.5">Weighted</h2>
                        <div className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 drop-shadow-sm">
                            {compositeData.composite.toFixed(1)}<span className="text-lg">%</span>
                        </div>
                    </div>
                    {onEdit && (
                        <button 
                            onClick={onEdit} 
                            className={`w-6 h-6 flex items-center justify-center rounded-full transition-all shadow-sm border border-white/20 ${isEditing ? 'bg-blue-500 text-white' : 'bg-white/50 dark:bg-white/5 text-slate-400 dark:text-slate-500 hover:bg-blue-500 hover:text-white'}`}
                            title="Configure Weights"
                        >
                            {isEditing ? '✓' : '⚙️'}
                        </button>
                    )}
                </div>

                <div className="w-full h-3 bg-slate-200/50 dark:bg-slate-900/50 rounded-full overflow-hidden border border-white/50 dark:border-white/5 shadow-inner relative mb-3">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-1000 relative shadow-[0_0_20px_rgba(99,102,241,0.6)]" style={{ width: `${Math.max(compositeData.composite, 2)}%` }}>
                        <div className="absolute inset-x-0 top-0 h-[50%] bg-white/30 rounded-t-full"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                </div>

                {children}
            </div>
        </div>
    );
};
