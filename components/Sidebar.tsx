import React, { useState } from 'react';
import { calculateProgress } from '../utils/calculations';
import { UserData, UserSettings, ProgressBarConfig, SubjectData } from '../types';
import { Modal } from './ui/Modal';
import { ProgressBar } from './ui/ProgressBar';
import { AddSubjectModal } from './sidebar/AddSubjectModal';
import { PerformanceConfigModal } from './sidebar/PerformanceConfigModal';
import { SubjectConfigModal } from './sidebar/SubjectConfigModal';
import { Button } from './ui/Button';

interface SidebarProps {
    activeSubject: string;
    onChangeSubject: (key: string) => void;
    userData: UserData;
    settings: UserSettings;
    onUpdateSettings: (s: UserSettings) => void;
    onDeleteSubject: (key: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSubject, onChangeSubject, userData, settings, onUpdateSettings, onDeleteSubject }) => {
    const [showPerfConfig, setShowPerfConfig] = useState(false);
    const [showSubjectConfig, setShowSubjectConfig] = useState(false);
    const [renameModal, setRenameModal] = useState<{isOpen: boolean, key: string, currentName: string} | null>(null);
    const [addSubjectModal, setAddSubjectModal] = useState(false);
    const [isEditingSubjects, setIsEditingSubjects] = useState(false);

    const getDisplayName = (key: string, defaultName: string) => {
        return settings.customNames?.[key] || defaultName;
    };

    const handlePerfConfigSave = (newConfigs: ProgressBarConfig[]) => {
        onUpdateSettings({ ...settings, progressBars: newConfigs });
        setShowPerfConfig(false);
    };

    const handleSubjectConfigSave = (newItems: string[], newWeights: Record<string, number>) => {
        onUpdateSettings({ 
            ...settings, 
            subjectProgressItems: newItems,
            subjectProgressWeights: newWeights 
        });
        setShowSubjectConfig(false);
    };
    
    const deleteSubject = (key: string) => {
        if (confirm(`Delete ${settings.syllabus[key].name}? All progress data and configurations for this subject will be permanently lost.`)) {
            onDeleteSubject(key);
        }
    };

    const subjectItemsToCalculate = settings.subjectProgressItems || settings.trackableItems.map(t => t.key);
    const subjectWeights = settings.subjectProgressWeights;
    const activeSubjectItems = settings.subjectConfigs?.[activeSubject] || settings.trackableItems;

    return (
        <aside className="flex flex-col gap-6">
            <div className="glass-panel p-5 rounded-3xl">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span> Subjects
                    </h3>
                    <div className="flex gap-2">
                         <button 
                            onClick={() => setIsEditingSubjects(!isEditingSubjects)}
                            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${isEditingSubjects ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-white/50 dark:hover:bg-white/5'}`}
                            title="Edit Subjects"
                        >
                            ✏️
                        </button>
                         <button 
                            onClick={() => setAddSubjectModal(true)}
                            className="w-8 h-8 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all font-bold"
                            title="Add New Subject"
                        >
                            +
                        </button>
                        <button 
                            onClick={() => setShowSubjectConfig(true)} 
                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-white transition-all rounded-xl hover:bg-white/50 dark:hover:bg-white/5"
                            title="Configure Calculation"
                        >
                             ⚙️
                        </button>
                    </div>
                </div>
                <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                    {(Object.entries(settings.syllabus) as [string, SubjectData][]).map(([key, data]) => {
                        const isActive = activeSubject === key;
                        const itemsForThisSubject = settings.subjectConfigs?.[key] || settings.trackableItems;
                        const itemKeys = itemsForThisSubject.map(i => i.key);

                        const progress = calculateProgress(key, itemKeys, userData, subjectWeights, itemsForThisSubject, settings.syllabus);
                        const displayName = getDisplayName(key, data.name);
                        
                        let borderColor = 'border-transparent';
                        let bgColor = 'bg-transparent';
                        let textColor = 'text-slate-600 dark:text-slate-400';
                        let barColor = 'bg-indigo-500';
                        let iconBg = 'bg-slate-100 dark:bg-white/5';
                        let shadow = '';
                        
                        if(data.color === 'emerald') { barColor = 'bg-emerald-500'; if(isActive) { borderColor = 'border-emerald-500/50'; bgColor='bg-emerald-500/10'; textColor = 'text-emerald-700 dark:text-emerald-300'; iconBg='bg-emerald-100 dark:bg-emerald-500/20'; shadow='shadow-sm shadow-emerald-500/10'; } }
                        else if(data.color === 'amber') { barColor = 'bg-amber-500'; if(isActive) { borderColor = 'border-amber-500/50'; bgColor='bg-amber-500/10'; textColor = 'text-amber-700 dark:text-amber-300'; iconBg='bg-amber-100 dark:bg-amber-500/20'; shadow='shadow-sm shadow-amber-500/10'; } }
                        else if(data.color === 'indigo') { barColor = 'bg-indigo-500'; if(isActive) { borderColor = 'border-indigo-500/50'; bgColor='bg-indigo-500/10'; textColor = 'text-indigo-700 dark:text-indigo-300'; iconBg='bg-indigo-100 dark:bg-indigo-500/20'; shadow='shadow-sm shadow-indigo-500/10'; } }
                        else if(data.color === 'blue') { barColor = 'bg-blue-500'; if(isActive) { borderColor = 'border-blue-500/50'; bgColor='bg-blue-500/10'; textColor = 'text-blue-700 dark:text-blue-300'; iconBg='bg-blue-100 dark:bg-blue-500/20'; shadow='shadow-sm shadow-blue-500/10'; } }
                        else if(data.color === 'rose') { barColor = 'bg-rose-500'; if(isActive) { borderColor = 'border-rose-500/50'; bgColor='bg-rose-500/10'; textColor = 'text-rose-700 dark:text-rose-300'; iconBg='bg-rose-100 dark:bg-rose-500/20'; shadow='shadow-sm shadow-rose-500/10'; } }

                        return (
                            <div 
                                key={key}
                                onClick={() => onChangeSubject(key)}
                                className={`group flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-colors duration-200 relative overflow-hidden ${isActive ? `${bgColor} ${borderColor} ${shadow}` : `hover:bg-white/50 dark:hover:bg-white/5 border-transparent`}`}
                            >
                                {isActive && <div className={`absolute left-0 top-0 bottom-0 w-1 ${barColor}`}></div>}
                                
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-colors ${iconBg}`}>
                                    {data.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className={`font-bold text-sm truncate max-w-[120px] ${isActive ? 'text-slate-800 dark:text-white' : textColor}`}>{displayName}</span>
                                            {isEditingSubjects && (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setRenameModal({ isOpen: true, key, currentName: displayName });
                                                    }}
                                                    className="text-[10px] text-slate-400 hover:text-blue-500 transition-opacity p-1 rounded hover:bg-slate-200 dark:hover:bg-white/10"
                                                >
                                                    ✏️
                                                </button>
                                            )}
                                        </div>
                                        <span className={`text-xs font-mono font-bold ${textColor}`}>{progress.overall.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-200 dark:bg-black/20 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${progress.overall}%` }}></div>
                                    </div>
                                </div>
                                
                                {isEditingSubjects && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); deleteSubject(key); }}
                                        className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs hover:scale-110 transition-all shadow-sm z-10 ml-2"
                                        title="Delete Subject"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="glass-panel p-5 rounded-3xl">
                <div className="flex justify-between items-center mb-5">
                    <h3 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-purple-500 rounded-full"></span> Performance
                    </h3>
                    <button 
                        onClick={() => setShowPerfConfig(true)} 
                        className="text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                        ⚙️
                    </button>
                </div>
                
                <div className="flex flex-col gap-6">
                    {settings.progressBars.filter(conf => conf.visible !== false).map(conf => {
                        if (conf.items.length === 0) return null;
                        const itemsForThisSubject = settings.subjectConfigs?.[activeSubject] || settings.trackableItems;
                        const p = calculateProgress(activeSubject, conf.items, userData, conf.weights, itemsForThisSubject, settings.syllabus);
                        
                        return (
                            <div key={conf.id}>
                                <div className="flex justify-between text-xs font-bold mb-2 tracking-wide text-slate-700 dark:text-slate-300">
                                    <span>{conf.title}</span>
                                    <span className="text-blue-600 dark:text-blue-400">{p.overall.toFixed(1)}%</span>
                                </div>
                                <ProgressBar progress={p.overall} color={`bg-gradient-to-r ${conf.color}`} />
                                <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 px-0.5">
                                    <span className="opacity-70 font-medium">Paper 1: {p.p1.toFixed(0)}%</span>
                                    <span className="opacity-70 font-medium">Paper 2: {p.p2.toFixed(0)}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {showPerfConfig && (
                <PerformanceConfigModal 
                    currentConfig={settings.progressBars} 
                    allItems={activeSubjectItems} 
                    onSave={handlePerfConfigSave} 
                    onClose={() => setShowPerfConfig(false)} 
                />
            )}

            {showSubjectConfig && (
                <SubjectConfigModal
                    currentItems={subjectItemsToCalculate}
                    currentWeights={subjectWeights || {}}
                    allItems={activeSubjectItems}
                    onSave={handleSubjectConfigSave}
                    onClose={() => setShowSubjectConfig(false)}
                />
            )}

            {renameModal && (
                <Modal isOpen={true} onClose={() => setRenameModal(null)} title="Rename Subject">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-500">New Subject Name</label>
                            <input 
                                type="text" 
                                value={renameModal.currentName}
                                onChange={(e) => setRenameModal(prev => prev ? { ...prev, currentName: e.target.value } : null)}
                                className="bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-white transition-colors"
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-2">
                            <Button variant="secondary" onClick={() => setRenameModal(null)}>Cancel</Button>
                            <Button onClick={() => {
                                onUpdateSettings({
                                    ...settings,
                                    customNames: { ...settings.customNames, [renameModal.key]: renameModal.currentName }
                                });
                                setRenameModal(null);
                            }}>Save Name</Button>
                        </div>
                    </div>
                </Modal>
            )}
            
            {addSubjectModal && (
                <AddSubjectModal 
                    onClose={() => setAddSubjectModal(false)} 
                    onAdd={(name, emoji, color) => {
                        const newKey = `subj_${Date.now()}`;
                        const newSyllabus = { 
                            ...settings.syllabus,
                            [newKey]: { name, icon: emoji, color, chapters: [] } 
                        };
                        onUpdateSettings({ ...settings, syllabus: newSyllabus });
                    }}
                />
            )}
        </aside>
    );
};