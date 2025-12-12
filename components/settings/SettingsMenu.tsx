import React, { useState, useRef } from 'react';
import { MenuDropdown } from './MenuDropdown';
import { useClickOutside } from '../../hooks/ui/useClickOutside';
import { UserData } from '../../types';

interface SettingsMenuProps {
    userId: string | null;
    userData?: UserData;
    onLogout: () => Promise<void>;
    onToggleTheme: () => void;
    theme: 'dark' | 'light';
    onOpenGuide: () => void;
    onOpenDevModal: () => void;
    onOpenAppearance: () => void;
    onForceSync: () => void;
    onOpenAdmin?: () => void;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useClickOutside(menuRef, () => setIsOpen(false));

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 shadow-lg border border-slate-700/50 ${isOpen ? 'bg-blue-600 text-white ring-4 ring-blue-500/20' : 'bg-slate-900 dark:bg-black text-white hover:scale-105 hover:bg-slate-800'}`}
                title="Settings & Menu"
            >
                <span className={`text-lg transition-transform duration-500 ${isOpen ? 'rotate-90' : ''}`}>⚙️</span>
            </button>
            {isOpen && <MenuDropdown {...props} onClose={() => setIsOpen(false)} />}
        </div>
    );
};