
import React from 'react';
import { CountdownResult } from '../../hooks/useCountdown';

interface Props {
    countdown: CountdownResult | null;
    label: string;
    onEdit: () => void;
}

const Unit = ({ val, label, isPast }: { val: number; label: string; isPast: boolean }) => (
    <div className="flex flex-col items-center bg-white/60 dark:bg-black/20 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-lg px-1.5 py-1 min-w-[40px] shadow-sm relative overflow-hidden flex-1">
        <div className={`absolute inset-0 ${isPast ? 'bg-rose-500/5' : 'bg-blue-500/5'}`}></div>
        <div className={`text-lg font-black text-transparent bg-clip-text leading-none mb-0.5 z-10 ${
            isPast 
            ? 'bg-gradient-to-b from-rose-400 to-rose-600 dark:from-rose-300 dark:to-rose-500' 
            : 'bg-gradient-to-b from-blue-400 to-blue-600 dark:from-blue-300 dark:to-blue-500'
        }`}>
            {isNaN(val) ? '00' : val.toString().padStart(2, '0')}
        </div>
        <div className="text-[8px] uppercase font-bold text-slate-400 tracking-wider z-10">{label}</div>
    </div>
);

export const CountdownCard: React.FC<Props> = ({ countdown, label, onEdit }) => {
    const isPast = countdown?.isPast || false;

    return (
        <div className="glass-card h-full p-3 flex flex-col justify-center items-center relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 group/timer transition-colors">
             <button 
                onClick={(e) => { e.stopPropagation(); onEdit(); }} 
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-slate-200/50 dark:bg-white/10 hover:bg-blue-500 hover:text-white text-slate-500 dark:text-slate-300 transition-all backdrop-blur-md opacity-50 group-hover/timer:opacity-100 z-20 cursor-pointer shadow-sm text-xs"
                title="Edit Timer"
             >
                ⚙️
             </button>
             
             <div className="relative z-10 text-center w-full">
                <div className={`text-[9px] font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5 ${isPast ? 'text-rose-600 dark:text-rose-300' : 'text-blue-600 dark:text-blue-300'}`}>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPast ? 'bg-rose-400' : 'bg-blue-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isPast ? 'bg-rose-500' : 'bg-blue-500'}`}></span>
                    </span>
                    <span className="truncate max-w-[100px]" title={label}>
                        {isPast ? `Since ${label}` : label}
                    </span>
                </div>
                <div className="flex justify-center gap-1 relative z-10 w-full">
                    {countdown ? (
                        <>
                            <Unit val={countdown.d} label="D" isPast={isPast} />
                            <div className={`py-1 text-sm font-light animate-pulse ${isPast ? 'text-rose-300' : 'text-slate-300'}`}>:</div>
                            <Unit val={countdown.h} label="H" isPast={isPast} />
                            <div className={`py-1 text-sm font-light animate-pulse ${isPast ? 'text-rose-300' : 'text-slate-300'}`}>:</div>
                            <Unit val={countdown.m} label="M" isPast={isPast} />
                        </>
                    ) : (
                        <div className="text-sm font-bold text-slate-500 dark:text-slate-400">Loading...</div>
                    )}
                </div>
            </div>
        </div>
    );
};
