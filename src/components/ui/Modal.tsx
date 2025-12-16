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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 md:p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className={`w-full max-w-[95vw] md:max-w-2xl rounded-xl md:rounded-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] shadow-2xl shadow-black/50 overflow-hidden ring-1 ring-white/10 animate-[scaleIn_0.2s_ease-out] ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Glassmorphic */}
                <div className="relative z-10 px-3 py-2 md:px-5 md:py-4 border-b border-slate-200/50 dark:border-white/10 flex justify-between items-center bg-white/80 dark:bg-[#0f172a]/70 backdrop-blur-xl">
                    <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider text-slate-700 dark:text-slate-200 drop-shadow-sm">{title}</h3>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 md:w-8 md:h-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none text-sm"
                    >
                        ✕
                    </button>

                    {/* Glass shine effect */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/10 to-transparent opacity-50"></div>
                </div>

                {/* Body - Solid */}
                <div className="p-3 md:p-6 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-[#020617] relative z-0">
                    {children}
                </div>
            </div>
        </div>
    );
};