import React, { useState, useEffect } from 'react';
import { CompositeData, UserSettings, TrackableItem, SubjectData } from '../types';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

interface HeroSectionProps {
    compositeData: CompositeData;
    streak: number;
    settings: UserSettings;
    onUpdateWeights: (newWeights: any, subjectKey?: string) => void;
    onUpdateCountdown: (target: string, label: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ compositeData, streak, settings, onUpdateWeights, onUpdateCountdown }) => {
    const [countdown, setCountdown] = useState<{ d: number; h: number; m: number } | null>(null);
    const [isEditingWeights, setIsEditingWeights] = useState(false);
    const [isEditingCountdown, setIsEditingCountdown] = useState(false);
    
    // Weight Config State
    const [selectedSubject, setSelectedSubject] = useState<string>('global');
    const [tempWeights, setTempWeights] = useState<Record<string, number>>({});
    const [weightTotal, setWeightTotal] = useState(0);

    // Countdown Config State
    const [tempTarget, setTempTarget] = useState(settings.countdownTarget || '2025-12-12T00:00');
    const [tempLabel, setTempLabel] = useState(settings.countdownLabel || 'Time Remaining');

    useEffect(() => {
        const targetDateStr = settings.countdownTarget || '2025-12-12T00:00:00+06:00';
        const target = new Date(targetDateStr);
        
        const interval = setInterval(() => {
            const now = new Date();
            const diff = target.getTime() - now.getTime();
            if (diff < 0) { setCountdown(null); return; }
            setCountdown({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000)
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [settings.countdownTarget]);

    useEffect(() => {
        if (isEditingWeights) {
            let w: Record<string, number> = {};
            if (selectedSubject === 'global') {
                w = { ...settings.weights };
            } else {
                w = { ...(settings.subjectWeights?.[selectedSubject] || settings.weights) };
            }
            setTempWeights(w);
        }
    }, [isEditingWeights, selectedSubject, settings]);

    useEffect(() => {
        const total = Object.values(tempWeights).reduce((a: number, b: number) => a + b, 0);
        setWeightTotal(total);
    }, [tempWeights]);

    const handleWeightChange = (key: string, val: string) => {
        const num = parseInt(val) || 0;
        setTempWeights(prev => ({ ...prev, [key]: Math.min(100, Math.max(0, num)) }));
    };

    const saveWeights = () => {
        if (weightTotal === 100) {
            const key = selectedSubject === 'global' ? undefined : selectedSubject;
            onUpdateWeights(tempWeights, key);
            setIsEditingWeights(false);
        }
    };

    const saveCountdown = () => {
        onUpdateCountdown(tempTarget, tempLabel);
        setIsEditingCountdown(false);
    };

    const currentConfigItems: TrackableItem[] = selectedSubject === 'global' 
        ? settings.trackableItems 
        : (settings.subjectConfigs?.[selectedSubject] || settings.trackableItems);

    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 print:hidden">
            {/* Weighted Progress Card */}
            <div className="glass-card md:col-span-2 relative overflow-visible group p-6 rounded-3xl bg-white/40 dark:bg-slate-800/40">
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Weighted Progress</h2>
                            <div className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 drop-shadow-sm">
                                {compositeData.composite.toFixed(1)}%
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsEditingWeights(!isEditingWeights)} 
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/50 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-blue-500 hover:text-white transition-all shadow-sm border border-white/20 z-20"
                            title="Configure Weights"
                        >
                            {isEditingWeights ? '✕' : '⚙️'}
                        </button>
                    </div>

                    <div className="w-full h-6 bg-slate-200/50 dark:bg-slate-900/50 rounded-full overflow-hidden mb-6 border border-white/50 dark:border-white/5 shadow-inner relative">
                        <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 transition-all duration-1000 relative shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${Math.max(compositeData.composite, 1.5)}%` }}>
                            {/* Glass Shine */}
                            <div className="absolute inset-x-0 top-0 h-[50%] bg-white/30 rounded-t-full"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                        </div>
                    </div>

                    {isEditingWeights ? (
                        <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-4 border border-slate-200 dark:border-white/10 animate-fade-in backdrop-blur-sm">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-500">Config:</span>
                                    <select 
                                        value={selectedSubject} 
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                        className="bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="global">Global Defaults</option>
                                        {Object.entries(settings.syllabus).map(([key, data]) => (
                                            <option key={key} value={key}>{(data as SubjectData).name}</option>
                                        ))}
                                    </select>
                                </div>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${weightTotal === 100 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-rose-500/10 text-rose-500 dark:text-rose-400"}`}>Total: {weightTotal}%</span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 max-h-[200px] overflow-y-auto custom-scrollbar">
                                {currentConfigItems.map((item: TrackableItem) => (
                                    <div key={item.key} className="flex flex-col gap-1">
                                        <label className="text-[10px] text-slate-500 dark:text-slate-400 uppercase truncate font-semibold" title={item.name}>
                                            {item.name}
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                value={tempWeights[item.key] || 0}
                                                onChange={(e) => handleWeightChange(item.key, e.target.value)}
                                                className="w-full bg-transparent border border-slate-300 dark:border-white/20 rounded-lg px-2 py-1 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                            />
                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button disabled={weightTotal !== 100} onClick={saveWeights} className={`w-full ${weightTotal !== 100 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                Save Weights
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                            {(Object.values(compositeData.breakdown) as { name: string; val: number; weight: number; color: string }[]).sort((a,b) => b.weight - a.weight).map(item => {
                                return (
                                    <div key={item.name} className={`flex flex-col bg-white/50 dark:bg-white/5 rounded-xl p-3 border border-slate-200/50 dark:border-white/5 transition-all hover:bg-white/80 dark:hover:bg-white/10 ${item.weight === 0 ? 'opacity-40 grayscale' : 'opacity-100'}`}>
                                        <div className="flex justify-between items-end mb-2">
                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase truncate pr-1" title={item.name}>{item.name}</div>
                                            <div className={`text-[10px] font-mono ${item.weight === 0 ? 'text-slate-400' : 'text-blue-600 dark:text-blue-400 font-bold'}`}>{item.weight}%</div>
                                        </div>
                                        <div className="h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden mb-2">
                                            <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                                        </div>
                                        <div className="text-right text-[10px] font-bold text-slate-700 dark:text-slate-200">{item.val.toFixed(0)}%</div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="glass-card flex-1 flex flex-col justify-center items-center bg-gradient-to-br from-orange-500/10 to-red-500/5 border-orange-500/20 rounded-3xl p-4 hover:border-orange-500/40 transition-colors">
                    <div className="text-center">
                        <div className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-2">Current Streak</div>
                        <div className="text-5xl font-black text-orange-500 dark:text-orange-400 flex items-center justify-center gap-2 drop-shadow-sm filter">
                            <span className="animate-bounce text-4xl filter drop-shadow-md">🔥</span> <span>{streak}</span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Consecutive Days</div>
                    </div>
                </div>

                <div className="glass-card flex-1 p-5 flex flex-col justify-center items-center relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-blue-200 dark:border-white/10 group/timer hover:border-blue-400/30 transition-colors">
                     <button 
                        onClick={() => setIsEditingCountdown(true)}
                        className="absolute top-3 right-3 opacity-0 group-hover/timer:opacity-100 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 text-slate-600 dark:text-slate-200 transition-all backdrop-blur-md"
                        title="Edit Timer"
                    >
                        ⚙️
                    </button>
                     <div className="relative z-10 text-center w-full">
                        <div className="text-[10px] font-bold text-blue-600 dark:text-blue-300 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-ping"></span>
                            {settings.countdownLabel || 'Time Remaining'}
                        </div>
                        <div className="flex justify-center gap-2 relative z-10 w-full">
                            {countdown ? (
                                <>
                                    <CountdownUnit val={countdown.d} label="Days" />
                                    <div className="py-2 text-2xl font-light text-slate-300">:</div>
                                    <CountdownUnit val={countdown.h} label="Hrs" />
                                    <div className="py-2 text-2xl font-light text-slate-300">:</div>
                                    <CountdownUnit val={countdown.m} label="Mins" />
                                </>
                            ) : (
                                <div className="text-xl font-bold text-rose-500 animate-pulse">Target Reached!</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isEditingCountdown && (
                <Modal isOpen={true} onClose={() => setIsEditingCountdown(false)} title="Countdown Settings">
                    <div className="flex flex-col gap-4">
                         <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-500">Event Name</label>
                            <input 
                                type="text"
                                value={tempLabel}
                                onChange={(e) => setTempLabel(e.target.value)}
                                className="bg-transparent border border-slate-300 dark:border-white/20 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white transition-colors"
                                placeholder="e.g. Final Exam"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-500">Target Date & Time</label>
                            <input 
                                type="datetime-local"
                                value={tempTarget.substring(0, 16)}
                                onChange={(e) => setTempTarget(e.target.value)}
                                className="bg-transparent border border-slate-300 dark:border-white/20 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white transition-colors"
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-2">
                             <Button variant="secondary" onClick={() => setIsEditingCountdown(false)}>Cancel</Button>
                             <Button onClick={saveCountdown}>Save Timer</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </section>
    );
};

const CountdownUnit = ({ val, label }: { val: number; label: string }) => (
    <div className="flex flex-col items-center bg-white/60 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl px-3 py-3 min-w-[65px] shadow-lg shadow-black/5">
        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-700 to-blue-600 dark:from-white dark:to-blue-300 leading-none mb-1">{val.toString().padStart(2, '0')}</div>
        <div className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">{label}</div>
    </div>
);