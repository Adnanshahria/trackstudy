import React from 'react';

export const StatusButton: React.FC<{ val: number; onClick: () => void }> = React.memo(({ val, onClick }) => {
    let bg = "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 print:border-gray-300 hover:border-blue-400 dark:hover:border-blue-500/50";
    let text = "text-slate-400 dark:text-slate-500 print:text-gray-400";
    let label = (val * 20) + '%';
    let fill = val * 20;

    if (val === 5) { bg = "!bg-emerald-500 !border-emerald-500 print:!bg-gray-300 print:!border-black shadow-md shadow-emerald-500/20"; text = "text-white print:text-black"; label = "✓"; fill = 100; }
    else if (val === 6) { bg = "!bg-rose-500 !border-rose-500 print:!bg-white print:!border-black shadow-md shadow-rose-500/20"; text = "text-white print:text-black"; label = "✕"; fill = 0; }

    return (
        <button
            onClick={onClick}
            className={`relative overflow-hidden w-9 h-6 md:w-12 md:h-8 rounded-md md:rounded-lg border flex items-center justify-center text-[8px] md:text-[10px] font-bold transition-all duration-200 hover:scale-105 active:scale-90 hover:shadow-md ${bg} ${text}`}
        >
            {val !== 5 && val !== 6 && (
                <div
                    className="absolute inset-0 origin-left bg-sky-500/20 dark:bg-sky-400/20 print:bg-gray-300 transition-transform duration-300 ease-out will-change-transform"
                    style={{ transform: `scaleX(${fill / 100})` }}
                />
            )}
            <span className="relative z-10 drop-shadow-sm">{label}</span>
        </button>
    );
});