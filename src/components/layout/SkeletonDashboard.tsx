
import React from 'react';

export const SkeletonDashboard: React.FC = () => {
    return (
        <div className="min-h-screen lg:h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#1A1A1C] transition-colors duration-300">
             <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-slate-200 dark:border-white/10 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">
                    Loading...
                </div>
             </div>
        </div>
    );
};
