
import React from 'react';

type TabType = 'dashboard' | 'syllabus' | 'settings';

interface BottomNavProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const NavItem: React.FC<{
    icon: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center flex-1 py-1.5 transition-all duration-300 relative ${isActive
            ? 'text-blue-500'
            : 'text-slate-400 dark:text-slate-500'
            }`}
    >
        {/* Active glow background */}
        {isActive && (
            <div className="absolute inset-0 bg-blue-500/10 rounded-xl mx-2" />
        )}

        <span className={`text-lg transition-all duration-300 relative z-10 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'scale-100'
            }`}>
            {icon}
        </span>
        <span className={`text-[9px] font-bold uppercase tracking-wide relative z-10 ${isActive ? 'text-blue-500' : ''
            }`}>
            {label}
        </span>

        {/* Bottom indicator line with glow */}
        {isActive && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.9)]" />
        )}
    </button>
);

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
            {/* Backdrop blur background */}
            <div className="absolute inset-0 bg-white/90 dark:bg-black/95 backdrop-blur-xl border-t border-slate-200 dark:border-white/10" />

            {/* Nav items - reduced height */}
            <div className="relative flex items-center justify-around h-12 max-w-lg mx-auto px-2 safe-area-pb">
                <NavItem
                    icon="🏠"
                    label="Home"
                    isActive={activeTab === 'dashboard'}
                    onClick={() => onTabChange('dashboard')}
                />
                <NavItem
                    icon="📚"
                    label="Syllabus"
                    isActive={activeTab === 'syllabus'}
                    onClick={() => onTabChange('syllabus')}
                />
                <NavItem
                    icon="⚙️"
                    label="Settings"
                    isActive={activeTab === 'settings'}
                    onClick={() => onTabChange('settings')}
                />
            </div>
        </nav>
    );
};

export type { TabType };
