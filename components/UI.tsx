import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className = '' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className={`glass-card w-full max-w-lg rounded-2xl p-0 flex flex-col max-h-[85vh] shadow-2xl ${className}`} onClick={(e) => e.stopPropagation()}>
                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-200">{title}</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">✕</button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' }> = ({ variant = 'primary', className, ...props }) => {
    const base = "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20",
        secondary: "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white",
        ghost: "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/5"
    };
    return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
};

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