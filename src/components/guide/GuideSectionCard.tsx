import React, { useState } from 'react';

interface Props {
    title: string;
    icon?: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

export const GuideSectionCard: React.FC<Props> = ({ title, icon, defaultOpen = false, children }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden transition-all duration-300">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isOpen ? 'bg-slate-100 dark:bg-white/10' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
                <div className="flex items-center gap-3">
                    {icon && <span className="text-lg">{icon}</span>}
                    <span className="font-bold text-sm uppercase tracking-wider text-slate-700 dark:text-slate-300">{title}</span>
                </div>
                <span className={`text-slate-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-4 border-t border-slate-200 dark:border-white/5">
                    {children}
                </div>
            </div>
        </div>
    );
};