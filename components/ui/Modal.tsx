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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
            <div 
                className={`modal-glass w-full max-w-2xl rounded-2xl flex flex-col max-h-[85vh] shadow-2xl shadow-black/30 ring-1 ring-white/15 animate-[scaleIn_0.2s_ease-out] ${className}`} 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center bg-white/5 rounded-t-2xl backdrop-blur-sm">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-200 drop-shadow-sm">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors focus:outline-none focus:bg-white/20"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};