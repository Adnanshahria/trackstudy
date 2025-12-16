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
                className={`w-full max-w-[95vw] md:max-w-2xl rounded-xl md:rounded-2xl flex flex-col max-h-[90vh] md:max-h-[85vh] shadow-2xl shadow-black/50 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 animate-[scaleIn_0.2s_ease-out] ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-3 py-2 md:px-5 md:py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800 rounded-t-xl md:rounded-t-2xl">
                    <h3 className="font-bold text-xs md:text-sm uppercase tracking-wider text-slate-700 dark:text-slate-200">{title}</h3>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 md:w-8 md:h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none text-sm"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-3 md:p-6 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-slate-900">
                    {children}
                </div>
            </div>
        </div>
    );
};