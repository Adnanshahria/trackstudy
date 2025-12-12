
import { useState, useEffect } from 'react';
import { UserSettings, TrackableItem } from '../../types';

export const useHeroLogic = (
    settings: UserSettings, 
    onUpdateWeights: (newWeights: any, subjectKey?: string) => void
) => {
    const [isEditingWeights, setIsEditingWeights] = useState(false);
    const [isEditingCountdown, setIsEditingCountdown] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<string>('global');
    const [tempWeights, setTempWeights] = useState<Record<string, number>>({});
    const [weightTotal, setWeightTotal] = useState(0);

    const currentConfigItems: TrackableItem[] = selectedSubject === 'global' ? settings.trackableItems : (settings.subjectConfigs?.[selectedSubject] || settings.trackableItems);

    useEffect(() => {
        if (isEditingWeights) {
            setTempWeights(selectedSubject === 'global' ? { ...settings.weights } : { ...(settings.subjectWeights?.[selectedSubject] || settings.weights) });
        }
    }, [isEditingWeights, selectedSubject, settings]);

    useEffect(() => {
        setWeightTotal(currentConfigItems.reduce((acc, item) => acc + (tempWeights[item.key] || 0), 0));
    }, [tempWeights, currentConfigItems]);

    const handleWeightChange = (key: string, val: string) => {
        if (val === '') {
             // Allow empty string temporarily - it will be treated as 0 in calculations
             setTempWeights(prev => ({ ...prev, [key]: '' as any }));
             return;
        }
        const parsed = parseFloat(val);
        const rounded = Math.round(parsed * 100) / 100;
        const safeVal = isNaN(rounded) ? 0 : Math.min(100, Math.max(0, rounded));
        setTempWeights(prev => ({ ...prev, [key]: safeVal }));
    };

    const saveWeights = () => {
        if (Math.abs(weightTotal - 100) < 0.01) {
            onUpdateWeights(tempWeights, selectedSubject === 'global' ? undefined : selectedSubject);
            setIsEditingWeights(false);
        }
    };

    return {
        isEditingWeights, setIsEditingWeights,
        isEditingCountdown, setIsEditingCountdown,
        selectedSubject, setSelectedSubject,
        tempWeights, weightTotal,
        currentConfigItems,
        handleWeightChange, saveWeights
    };
};