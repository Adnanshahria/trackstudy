import React from 'react';

export const StatusButton: React.FC<{ val: number; onClick: () => void }> = ({ val, onClick }) => {
    let bg = "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 print:border-gray-300 hover:border-blue-400 dark:hover:border-blue-500/50";
    let text = "text-slate-600 dark:text-slate-400 print:text-gray-600";
    let label = (val * 20) + '%';
    let fill = val * 20;

    if (val === 5) { bg = "!bg-emerald-500 !border-emerald-500 print:!bg-gray-300 print:!border-black shadow-md shadow-emerald-500/20"; text = "text-white print:text-black"; label = "✓"; fill = 100; }
    else if (val === 6) { bg = "!bg-rose-500 !border-rose-500 print:!bg-white print:!border-black shadow-md shadow-rose-500/20"; text = "text-white print:text-black"; label = "✕"; fill = 0; }

    return (
        <button 
            onClick={onClick}
            className={`relative overflow-hidden w-12 h-8 rounded-lg border flex items-center justify-center text-[10px] font-bold transition-all duration-200 active:scale-90 ${bg} ${text}`}
        >
            {val !== 5 && val !== 6 && (
                <div 
                    className="absolute top-0 bottom-0 left-0 bg-sky-500/20 dark:bg-sky-400/20 print:bg-gray-300 transition-all duration-300 ease-out" 
                    style={{ width: `${fill}%` }} 
                />
            )}
            <span className="relative z-10 drop-shadow-sm">{label}</span>
        </button>
    );
};