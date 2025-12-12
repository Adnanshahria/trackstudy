import React from 'react';

interface Props {
    label: string;
    icon: string;
    type?: string;
    value: string;
    onChange: (val: string) => void;
    onEnter: () => void;
    placeholder?: string;
    rightElement?: React.ReactNode;
}

export const AuthInput: React.FC<Props> = ({ label, icon, type = "text", value, onChange, onEnter, placeholder, rightElement }) => (
    <div className="space-y-1.5 animate-fade-in">
        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider ml-2">{label}</label>
        <div className="relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg opacity-50">{icon}</span>
            <input 
                type={type} 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && onEnter()} 
                placeholder={placeholder}
                className={`w-full bg-transparent border border-slate-300 dark:border-white/20 rounded-2xl pl-12 ${rightElement ? 'pr-16' : 'pr-4'} py-3.5 text-sm font-semibold focus:outline-none focus:border-blue-500 focus:ring-4 dark:text-white transition-all`} 
            />
            {rightElement}
        </div>
    </div>
);