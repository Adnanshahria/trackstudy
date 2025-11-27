
import React from 'react';

export const SkeletonDashboard: React.FC = () => {
    return (
        <div className="min-h-screen lg:h-screen w-screen lg:overflow-hidden flex flex-col bg-slate-50 dark:bg-[#1A1A1C] transition-colors duration-300 relative">
             {/* Central Loading Overlay */}
             <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-black/50 backdrop-blur-[2px]">
                <div className="relative mb-4">
                    {/* Pulsing Brand Logo Loader */}
                    <div className="w-20 h-20 bg-black dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-slate-900 font-black text-3xl shadow-2xl animate-pulse">
                        TS
                    </div>
                    <div className="absolute -inset-4 bg-blue-500/20 rounded-3xl blur-xl animate-pulse"></div>
                </div>
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] animate-pulse">
                    Syncing Data...
                </div>
             </div>

             {/* Content Skeleton (Background Shimmer) */}
             <div className="flex-1 w-full max-w-screen-2xl mx-auto px-4 py-6 lg:overflow-hidden grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start opacity-20 pointer-events-none animate-pulse">
                
                {/* Sidebar Skeleton */}
                <div className="hidden lg:flex flex-col gap-4 h-full">
                    <div className="grid grid-cols-2 gap-3 shrink-0">
                        <div className="h-32 bg-slate-400 rounded-2xl"></div>
                        <div className="h-32 bg-slate-400 rounded-2xl"></div>
                    </div>
                    <div className="h-40 bg-slate-400 rounded-3xl shrink-0"></div>
                    <div className="flex-1 bg-slate-400 rounded-3xl min-h-[200px]"></div>
                </div>

                 {/* Sidebar Skeleton (Mobile) */}
                 <div className="lg:hidden flex flex-col gap-4">
                     <div className="h-28 bg-slate-400 rounded-2xl"></div>
                </div>

                {/* Syllabus Skeleton */}
                <div className="h-full flex flex-col gap-6 lg:overflow-y-auto pr-1 pb-20 lg:pb-0">
                    <div className="h-20 bg-slate-400 rounded-2xl shrink-0"></div>
                    <div className="flex-1 bg-slate-400 rounded-3xl shrink-0 min-h-[300px]"></div>
                </div>
             </div>
        </div>
    );
};
