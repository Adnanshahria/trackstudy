import React from 'react';
import { TickLog, formatRelativeTime } from '../../../types/tickLogTypes';

interface Props {
    log: TickLog;
}

export const TickLogCard: React.FC<Props> = ({ log }) => {
    const delta = log.percentAfter - log.percentBefore;
    const deltaColor = delta > 0 ? 'text-emerald-500' : delta < 0 ? 'text-rose-500' : 'text-slate-400';
    const deltaSign = delta > 0 ? '+' : '';

    // Color-coded percent pill
    const getPercentColor = (percent: number) => {
        if (percent === 100) return 'bg-emerald-500 text-white';
        if (percent >= 80) return 'bg-emerald-400/20 text-emerald-400';
        if (percent >= 60) return 'bg-blue-400/20 text-blue-400';
        if (percent >= 40) return 'bg-amber-400/20 text-amber-400';
        if (percent >= 20) return 'bg-orange-400/20 text-orange-400';
        return 'bg-slate-400/20 text-slate-400';
    };

    return (
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
            {/* Left: Timestamp */}
            <div className="flex flex-col min-w-[80px]">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {formatRelativeTime(log.timestamp)}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                    {new Date(log.iso).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
            </div>

            {/* Center: Percent Pill (Right aligned now) */}
            <div className="flex items-center gap-2 ml-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPercentColor(log.percentAfter)}`}>
                    {log.percentAfter}%
                </span>
                <span className={`text-xs font-mono font-bold ${deltaColor}`}>
                    {deltaSign}{delta}%
                </span>
            </div>

            {/* Right: Field tag */}
            <div className="text-right">

                {log.comment && (
                    <p className="text-[10px] text-slate-400 mt-1 max-w-[100px] truncate" title={log.comment}>
                        {log.comment}
                    </p>
                )}
            </div>
        </div>
    );
};
