import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }> = ({ variant = 'primary', className, ...props }) => {
    const base = "px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/20 border border-blue-400/20 focus:ring-blue-500",
        secondary: "bg-white/5 border border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white/10 hover:text-slate-900 dark:hover:text-white backdrop-blur-md focus:ring-slate-400",
        ghost: "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/5 focus:ring-slate-400",
        danger: "bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-lg shadow-rose-500/20 border border-rose-400/20 focus:ring-rose-500"
    };

    return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
};