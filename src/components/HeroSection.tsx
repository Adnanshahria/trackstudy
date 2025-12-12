
import React from 'react';
import { CompositeData, UserSettings } from '../types';
import { ProgressCard } from './hero/ProgressCard';
import { CountdownCard } from './hero/CountdownCard';
import { WeightsEditor } from './hero/WeightsEditor';
import { CountdownEditModal } from './hero/CountdownEditModal';
import { useCountdown } from '../hooks/useCountdown';
import { useHeroLogic } from '../hooks/ui/useHeroLogic';

interface HeroSectionProps {
    compositeData: CompositeData;
    settings: UserSettings;
    onUpdateWeights: (newWeights: any, subjectKey?: string) => void;
    onUpdateCountdown: (target: string, label: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ compositeData, settings, onUpdateWeights, onUpdateCountdown }) => {
    // Ensure we have valid string defaults if settings are undefined
    const target = settings.countdownTarget || '2025-12-12T00:00';
    const label = settings.countdownLabel || 'Time Remaining';
    
    const countdown = useCountdown(target);
    const logic = useHeroLogic(settings, onUpdateWeights);

    return (
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8 print:hidden items-start">
            <div className="lg:col-span-3">
                <ProgressCard compositeData={compositeData} isEditing={logic.isEditingWeights} onEdit={() => logic.setIsEditingWeights(!logic.isEditingWeights)}>
                    <WeightsEditor 
                        settings={settings}
                        selectedSubject={logic.selectedSubject} setSelectedSubject={logic.setSelectedSubject}
                        weightTotal={logic.weightTotal} tempWeights={logic.tempWeights}
                        handleWeightChange={logic.handleWeightChange} saveWeights={logic.saveWeights}
                        currentConfigItems={logic.currentConfigItems} compositeData={compositeData}
                        isEditing={logic.isEditingWeights}
                    />
                </ProgressCard>
            </div>
            <div className="lg:col-span-1">
                <CountdownCard 
                    countdown={countdown} 
                    label={label} 
                    onEdit={() => logic.setIsEditingCountdown(true)} 
                />
            </div>
            
            <CountdownEditModal 
                isOpen={logic.isEditingCountdown} 
                onClose={() => logic.setIsEditingCountdown(false)} 
                initialTarget={target}
                initialLabel={label}
                onSave={onUpdateCountdown} 
            />
        </section>
    );
};
