
import React from 'react';
import { CountdownResult } from '../../hooks/useCountdown';

interface Props {
    countdown: CountdownResult | null;
    label: string;
    onEdit: () => void;
}

const TimeUnit = ({ value, label, isPast }: { value: number; label: string; isPast: boolean }) => (
    <div className={`flex flex-col items-center justify-center rounded-lg px-2 py-1.5 min-w-[40px] border transition-all duration-300
        ${isPast
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}>
        <span className="text-xl md:text-2xl font-black tabular-nums leading-none">
            {isNaN(value) ? '00' : value.toString().padStart(2, '0')}
        </span>
        <span className="text-[8px] uppercase font-bold opacity-60 mt-0.5">{label}</span>
    </div>
);

export const CountdownCard: React.FC<Props> = ({ countdown, label, onEdit }) => {
    const isPast = countdown?.isPast || false;

    return (
        <div className={`relative h-full p-3 md:p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]
            bg-slate-800/80 border-slate-700/50 shadow-lg shadow-black/20
            ${isPast ? 'ring-1 ring-rose-500/30' : ''}`}>

            {/* Edit Button */}
            <button
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-lg 
                    bg-slate-700/50 hover:bg-indigo-500 text-slate-400 hover:text-white
                    transition-all opacity-60 hover:opacity-100 z-10"
                title="Edit Timer"
            >
                <span className="text-xs">⚙️</span>
            </button>

            <div className="flex flex-col h-full justify-center">
                {/* Label */}
                <div className={`flex items-center gap-1.5 mb-2 ${isPast ? 'text-rose-400' : 'text-indigo-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isPast ? 'bg-rose-500' : 'bg-indigo-500'}`} />
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider truncate">
                        {isPast ? `Since ${label}` : label}
                    </span>
                </div>

                {/* Timer Units */}
                <div className="flex items-center justify-center gap-1">
                    {countdown ? (
                        <>
                            <TimeUnit value={countdown.d} label="D" isPast={isPast} />
                            <span className={`text-lg font-light ${isPast ? 'text-rose-400/50' : 'text-indigo-400/50'}`}>:</span>
                            <TimeUnit value={countdown.h} label="H" isPast={isPast} />
                            <span className={`text-lg font-light ${isPast ? 'text-rose-400/50' : 'text-indigo-400/50'}`}>:</span>
                            <TimeUnit value={countdown.m} label="M" isPast={isPast} />
                        </>
                    ) : (
                        <div className="text-sm text-slate-500">Loading...</div>
                    )}
                </div>
            </div>
        </div>
    );
};
