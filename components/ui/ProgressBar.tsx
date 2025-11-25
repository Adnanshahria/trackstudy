import React from 'react';

export const ProgressBar: React.FC<{ progress: number; color?: string; className?: string }> = ({ progress, color = 'bg-blue-500', className = '' }) => (
    <div className={`w-full h-3 bg-slate-200/70 dark:bg-slate-700/50 rounded-full overflow-hidden border border-white/50 dark:border-white/5 shadow-inner ${className}`}>
        <div 
            className={`h-full rounded-full transition-all duration-700 relative ${color}`} 
            style={{ width: `${Math.max(progress, 2)}%` }}
        >
             {/* Glassy Shine Top Half */}
             <div className="absolute inset-x-0 top-0 h-[50%] bg-white/30 rounded-t-full"></div>
             {/* Shimmer Effect */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 animate-pulse"></div>
        </div>
    </div>
);