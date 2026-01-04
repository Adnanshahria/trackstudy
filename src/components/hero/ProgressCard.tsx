
import React from 'react';
import { CompositeData } from '../../types';

interface Props {
    compositeData: CompositeData;
    onEdit?: () => void;
    isEditing?: boolean;
    children?: React.ReactNode;
}

export const ProgressCard: React.FC<Props> = ({ compositeData, onEdit, isEditing, children }) => {
    const progress = compositeData.composite;

    return (
        <div className="relative h-full p-3 md:p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
            bg-slate-800/80 border-slate-700/50 shadow-lg shadow-black/20">

            {/* Header */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h2 className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Weighted
                    </h2>
                    <div className="flex items-baseline gap-0.5">
                        <span className="text-3xl md:text-4xl font-black text-white tabular-nums">
                            {progress.toFixed(1)}
                        </span>
                        <span className="text-base text-slate-400 font-medium">%</span>
                    </div>
                </div>
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className={`w-6 h-6 flex items-center justify-center rounded-lg transition-all
                            ${isEditing
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-700/50 text-slate-400 hover:bg-indigo-500 hover:text-white opacity-60 hover:opacity-100'}`}
                        title="Configure Weights"
                    >
                        <span className="text-xs">{isEditing ? '✓' : '⚙️'}</span>
                    </button>
                )}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 md:h-3 bg-slate-900/60 rounded-full overflow-hidden border border-slate-700/30">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${Math.max(progress, 2)}%` }}
                >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full" />
                </div>
            </div>

            {children}
        </div>
    );
};
