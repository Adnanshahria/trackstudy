import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../ui/Button';
import { UserSettings, TrackableItem, SubjectData } from '../../../types';

interface Props {
    settings: UserSettings;
    selectedSubject: string;
    setSelectedSubject: (s: string) => void;
    weightTotal: number;
    tempWeights: Record<string, number>;
    handleWeightChange: (k: string, v: string) => void;
    saveWeights: () => void;
    currentConfigItems: TrackableItem[];
}

export const WeightsForm: React.FC<Props> = ({ settings, selectedSubject, setSelectedSubject, weightTotal, tempWeights, handleWeightChange, saveWeights, currentConfigItems }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get display name for selected option
    const getDisplayName = () => {
        if (selectedSubject === 'global') return 'Global Defaults';
        const subject = settings.syllabus[selectedSubject] as SubjectData;
        return subject?.name || 'Select...';
    };

    // Get icon for selected option
    const getIcon = () => {
        if (selectedSubject === 'global') return '🌐';
        const subject = settings.syllabus[selectedSubject] as SubjectData;
        return subject?.icon || '';
    };

    const options = [
        { key: 'global', name: 'Global Defaults', icon: '🌐' },
        ...Object.entries(settings.syllabus).map(([key, data]) => ({
            key,
            name: (data as SubjectData).name,
            icon: (data as SubjectData).icon
        }))
    ];

    return (
        <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/10 animate-fade-in backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Config:</span>

                    {/* Custom Dropdown */}
                    <div ref={dropdownRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white hover:border-blue-400 dark:hover:border-blue-500 transition-colors min-w-[140px]"
                        >
                            <span>{getIcon()}</span>
                            <span className="flex-1 text-left truncate">{getDisplayName()}</span>
                            <svg className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in">
                                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                    {options.map(option => (
                                        <button
                                            key={option.key}
                                            onClick={() => {
                                                setSelectedSubject(option.key);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-500/10 ${selectedSubject === option.key
                                                    ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold'
                                                    : 'text-slate-700 dark:text-slate-200'
                                                }`}
                                        >
                                            <span>{option.icon}</span>
                                            <span className="truncate">{option.name}</span>
                                            {selectedSubject === option.key && (
                                                <span className="ml-auto text-blue-500">✓</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${weightTotal === 100 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-500 dark:text-rose-400"}`}>Total: {weightTotal}%</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 max-h-[200px] overflow-y-auto custom-scrollbar">
                {currentConfigItems.map((item: TrackableItem) => (
                    <div key={item.key} className="flex flex-col gap-1">
                        <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase truncate font-semibold" title={item.name}>{item.name}</label>
                        <div className="relative">
                            <input type="number" value={tempWeights[item.key] ?? ''} onChange={(e) => handleWeightChange(item.key, e.target.value)} className="w-full bg-transparent border border-slate-300 dark:border-white/20 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-white" />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">%</span>
                        </div>
                    </div>
                ))}
            </div>
            <Button disabled={weightTotal !== 100} onClick={saveWeights} className={`w-full ${weightTotal !== 100 ? 'opacity-50 cursor-not-allowed' : ''}`}>Save Weights</Button>
        </div>
    );
};